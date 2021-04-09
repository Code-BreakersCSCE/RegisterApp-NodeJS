import {
	CommandResponse,
	Employee,
	EmployeeSaveRequest,
} from "../../typeDefinitions";
import { EmployeeModel } from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { hashString, mapEmployeeData } from "./helpers/employeeHelper";
import { isBlankString } from "../helpers/helper";
import { EmployeeClassification } from "../models/constants/entityTypes";
import * as Helper from "../helpers/helper";

const validateSaveRequest = (
	employeeSaveRequest: EmployeeSaveRequest,
	isInitialEmployee: boolean = false
): CommandResponse<Employee> => {

	let errorMessage: string = "";

	if (Helper.isBlankString(employeeSaveRequest.firstName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
	} else if (Helper.isBlankString(employeeSaveRequest.lastName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
	} else if (Helper.isBlankString(employeeSaveRequest.password)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
	} else if (!isInitialEmployee
		&& ((employeeSaveRequest.classification == null)
			|| isNaN(employeeSaveRequest.classification)
			|| !(employeeSaveRequest.classification in EmployeeClassification))) {

		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_TYPE_INVALID);
	} else if (!Helper.isBlankString(employeeSaveRequest.managerId)
		&& !Helper.isValidUUID(<string>employeeSaveRequest.managerId)) {

		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_MANAGER_ID_INVALID);
	}

	return ((errorMessage === "")
		? <CommandResponse<Employee>>{ status: 200 }
		: <CommandResponse<Employee>>{
			status: 422,
			message: errorMessage
		});
};

export async function newEmployee(
	req: EmployeeSaveRequest,
	initalEmployee: boolean = false
) {
	const validRequest = validateSaveRequest(req);
	if (validRequest.status == 200) {
		const newEmployee: EmployeeModel = <EmployeeModel>{
			firstName: req.firstName,
			lastName: req.lastName,
			password: Buffer.from(hashString(req.password)),
			active: true,
			managerId: req.managerId,
			classification: !initalEmployee
				? <EmployeeClassification>req.classification
				: EmployeeClassification.GeneralManager,
		};
		return EmployeeModel.create(newEmployee).then(function (
			newEmployee
		): CommandResponse<Employee> {
			return <CommandResponse<Employee>>{
				status: 201,
				data: mapEmployeeData(newEmployee),
			};
		});
	}
	return Promise.reject(validRequest);
}
