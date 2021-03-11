import * as crypto from "crypto";
import { Employee } from "../../../typeDefinitions";
import { EmployeeModel } from "../../models/employeeModel";
import { EmployeeClassification } from "../../models/constants/entityTypes";

export const hashString = (toHash: string): string => {
	const hash = crypto.createHash("sha256");
	hash.update(toHash);
	return hash.digest("hex");
};

export const isElevatedUser = (
	employeeClassification: EmployeeClassification
): boolean => {
	if (employeeClassification > 1) {
		return true;
	}

	return false; // TODO: Determine if an employee is an elevated user by their classification
};
