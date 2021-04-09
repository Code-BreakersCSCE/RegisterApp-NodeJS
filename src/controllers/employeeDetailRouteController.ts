// employeeDetailRouteController.ts

import { Request, Response } from "express";
import * as Helper from "./helpers/routeControllerHelper";
import { Resources, ResourceKey } from "../resourceLookup";
import * as EmployeeQuery from "./commands/employees/employeeQuery";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";
import * as EmployeeCreateCommand from "./commands/employees/employeeCreateCommand";
import * as EmployeeUpdateCommand from "./commands/employees/employeeUpdateCommand";
import * as EmployeeExistsQuery from "./commands/employees/activeEmployeeExistsQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup, ParameterLookup, RouteLookup, QueryParameterLookup } from "./lookups/routingLookup";
import { EmployeeClassification, EmployeeClassificationLabel } from "./commands/models/constants/entityTypes";
import { CommandResponse, Employee, EmployeeDetailPageResponse, EmployeeSaveRequest, EmployeeSaveResponse, EmployeeType, ActiveUser } from "./typeDefinitions";

interface CanCreateEmployee {
	employeeExists: boolean;
	isElevatedUser: boolean;
}

const buildEmployeeTypes = (): EmployeeType[] => {
	const employeeTypes: EmployeeType[] = [];

	employeeTypes.push(<EmployeeType>{
		value: EmployeeClassification.NotDefined,
		label: EmployeeClassificationLabel.NotDefined
	});
	employeeTypes.push(<EmployeeType>{
		value: EmployeeClassification.Cashier,
		label: EmployeeClassificationLabel.Cashier
	});
	employeeTypes.push(<EmployeeType>{
		value: EmployeeClassification.ShiftManager,
		label: EmployeeClassificationLabel.ShiftManager
	});
	employeeTypes.push(<EmployeeType>{
		value: EmployeeClassification.GeneralManager,
		label: EmployeeClassificationLabel.GeneralManager
	});

	return employeeTypes;
};

const buildEmptyEmployee = (): Employee => {
	return <Employee>{
		id: "",
		lastName: "",
		active: false,
		firstName: "",
		employeeId: "",
		classification: EmployeeClassification.NotDefined,
		managerId: Resources.getString(ResourceKey.EMPTY_UUID)
	};
};

const processStartEmployeeDetailError = (error: any, res: Response): void => {
	if (Helper.processStartError(error, res)) {
		return;
	}

	res.status((error.status || 500))
		.render(
			ViewNameLookup.EmployeeDetail,
			<EmployeeDetailPageResponse>{
				isInitialEmployee: false,
				employee: buildEmptyEmployee(),
				employeeTypes: buildEmployeeTypes(),
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_QUERY))
			});
};

const determineCanCreateEmployee = async (req: Request): Promise<CanCreateEmployee> => {
	let employeeExists: boolean;
		// TODO: Logic to determine if the user associated with the current session
	//  is able to create an employee
	
	return EmployeeExistsQuery.execute()
		.then((employeeExistsCommandResponse: CommandResponse<boolean>): Promise<CommandResponse<ActiveUser>> => {
			employeeExists = ((employeeExistsCommandResponse.data != null) && employeeExistsCommandResponse.data);
			
		if (!employeeExists) {
			return Promise.resolve(<CommandResponse<ActiveUser>>{ status: 200 });
		}
		
			return ValidateActiveUser.execute((<Express.Session>req.session).id);
		}).then((activeUserCommandResponse: CommandResponse<ActiveUser>): CanCreateEmployee => {
			return <CanCreateEmployee>{
				employeeExists: employeeExists,
				isElevatedUser: ((activeUserCommandResponse.data != null) && EmployeeHelper.isElevatedUser(
					(<ActiveUser>activeUserCommandResponse.data).classification))
			};
		});
		

	return <CanCreateEmployee>{ employeeExists: false, isElevatedUser: false };
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): void => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return res.redirect(Helper.buildNoPermissionsRedirectUrl());
			}

			// TODO: Serve up the page
			return res.render(
				ViewNameLookup.EmployeeDetail,
				<EmployeeDetailPageResponse>{
					employee: buildEmptyEmployee(),
					employeeTypes: buildEmployeeTypes(),
					isInitialEmployee: !canCreateEmployee.employeeExists,
					errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
				});

		}).catch((error: any): void => {
			// TODO: Handle any errors that occurred
			return processStartEmployeeDetailError(error, res);
		});
};

export const startWithEmployee = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<Employee>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<Employee>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			return EmployeeQuery.findById(
				req.params[ParameterLookup.EmployeeId]);
		}).then((employeeCommandResponse: CommandResponse<Employee>): void => {
			return res.render(
				ViewNameLookup.EmployeeDetail,
				<EmployeeDetailPageResponse>{
					isInitialEmployee: false,
					employeeTypes: buildEmployeeTypes(),
					employee: employeeCommandResponse.data,
					errorMessage: Resources.getString(req.query[QueryParameterLookup.ErrorCode])
				});
		}).catch((error: any): void => {
			return processStartEmployeeDetailError(error, res);
		});
};

const saveEmployee = async (
	req: Request,
	res: Response,
	performSave: (
		employeeSaveRequest: EmployeeSaveRequest,
		isInitialEmployee?: boolean
	) => Promise<CommandResponse<Employee>>
): Promise<void> => {

	if (Helper.handleInvalidApiSession(req, res)) {
		return;
	}

	let employeeExists: boolean;

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): Promise<CommandResponse<Employee>> => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return Promise.reject(<CommandResponse<boolean>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			employeeExists = canCreateEmployee.employeeExists;

			return performSave(req.body, !employeeExists);
		}).then((saveEmployeeCommandResponse: CommandResponse<Employee>): void => {
			// TODO: Handle the save response and send a response to the HTTP request
			const response: EmployeeSaveResponse = <EmployeeSaveResponse>{
				employee: <Employee>saveEmployeeCommandResponse.data
			};
			
			if (!employeeExists) {
				response.redirectUrl = (RouteLookup.SignIn
					+ "?" + QueryParameterLookup.EmployeeId
					+ "=" + (<Employee>saveEmployeeCommandResponse.data).employeeId);
			}
			
			res.status(saveEmployeeCommandResponse.status).send(response);
			
		}).catch((error: any): void => {
			return Helper.processApiError(
				error,
				res,
				<Helper.ApiErrorHints>{
					defaultErrorMessage: Resources.getString(
						ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
				});
		});
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
	return saveEmployee(req, res, EmployeeUpdateCommand.updateEmployee); // TODO: invoke saveEmployee() with the appropriate save functionality
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
	return saveEmployee(req, res, EmployeeCreateCommand.newEmployee); // TODO: invoke saveEmployee() with the appropriate save functionality
};