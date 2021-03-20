import { EmployeeModel } from "../models/employeeModel";
import { CommandResponse } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";

export const execute = async (): Promise<CommandResponse<boolean>> => {
	console.log("query 1");
	return EmployeeRepository.queryActiveExists().then(
		(queriedEmployee: EmployeeModel | null): CommandResponse<boolean> => {
			console.log("query 2");
			if (!queriedEmployee) {
				return <CommandResponse<boolean>>{
					status: 404,
					message: Resources.getString(
						ResourceKey.EMPLOYEE_NOT_FOUND
					),
				};
			}

			return <CommandResponse<boolean>>{
				data: true,
				status: 200,
			};
		}
	);
};
