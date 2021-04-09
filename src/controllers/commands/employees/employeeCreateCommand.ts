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

export function validateSaveRequest(
	req: EmployeeSaveRequest,
	initalEmployee: boolean = false
): CommandResponse<Employee> {
	let invalidReq = false;
	let errMesage: String = "";
	if (isBlankString(req.firstName)) {
		invalidReq = true;
		errMesage = "first name is blank";
	} else if (isBlankString(req.lastName)) {
		invalidReq = true;
		errMesage = "last name is blank";
	} else if (isBlankString(req.password)) {
		invalidReq = true;
		errMesage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
	} else if (
		!initalEmployee &&
		(req.classification == null ||
			isNaN(req.classification) ||
			!(req.classification in req))
	) {
		errMesage = Resources.getString(ResourceKey.EMPLOYEE_TYPE_INVALID);
		invalidReq = true;
	}

	if (!invalidReq) {
		return <CommandResponse<Employee>>{ status: 200 };
	}

	return <CommandResponse<Employee>>{
		status: 422,
		message: errMesage,
	};
}

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
