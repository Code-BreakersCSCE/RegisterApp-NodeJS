import {
	CommandResponse,
	Employee,
	EmployeeSaveRequest,
} from "../../typeDefinitions";
import * as employee from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { hashString, mapEmployeeData } from "./helpers/employeeHelper";
import { isBlankString, isValidUUID } from "../helpers/helper";
import { EmployeeClassification } from "../models/constants/entityTypes";
import { validateSaveRequest } from "../employees/employeeCreateCommand";
import * as DatabaseConnection from "../models/databaseConnection";
import Sequelize from "sequelize";
function createUpdateObject(req: EmployeeSaveRequest) {
	const update: any = {};
	if (req.firstName != null) {
		update.firstName = req.firstName;
	}
	if (req.lastName != null) {
		update.lastName = req.lastName;
	}
	if (req.active != null) {
		update.active = req.active;
	}
	if (!isBlankString(req.password)) {
		update.passwrod = Buffer.from(hashString(req.password));
	}
	if (req.classification != null) {
		update.classification = <EmployeeClassification>req.classification;
	}
	if (!isBlankString(req.managerId) && isValidUUID(<string>req.managerId)) {
		update.managerId = req.managerId;
	}

	return update;
}

export async function updateEmployee(req: EmployeeSaveRequest) {
	const validRequest = validateSaveRequest(req);
	if (validRequest.status == 200) {
		return DatabaseConnection.createTransaction().then(function (trans) {
			return employee
				.queryById(<string>req.id, trans)
				.then(function (employee) {
					if (employee == null) {
						return Promise.reject(<CommandResponse<Employee>>{
							status: 404,
							message: Resources.getString(
								ResourceKey.EMPLOYEES_UNABLE_TO_QUERY
							),
						});
					}

					return employee.update(createUpdateObject(req), <
						Sequelize.InstanceUpdateOptions
					>{ Transaction: trans });
				})
				.then(function (employee) {
					trans.commit();
					return <CommandResponse<Employee>>{
						status: 200,
						data: mapEmployeeData(employee),
					};
				})
				.catch(function (err) {
					if (trans != null) {
						trans.rollback();
					}
					return Promise.reject(<CommandResponse<Employee>>{
						status: err.status || 500,
						message:
							err.message ||
							Resources.getString(
								ResourceKey.EMPLOYEE_UNABLE_TO_SAVE
							),
					});
				});
		});
	}
	return Promise.reject(validRequest);
}
