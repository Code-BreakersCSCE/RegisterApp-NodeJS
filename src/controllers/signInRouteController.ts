import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import {
	PageResponse,
	CommandResponse,
	ApiResponse,
	SignInRequest,
	Employee,
} from "./typeDefinitions";
import {
	ParameterLookup,
	QueryParameterLookup,
	ViewNameLookup,
	RouteLookup,
} from "./lookups/routingLookup";
import * as EmployeeSigninCommand from "./commands/employees/employeeSigninCommand";
import * as ClearActiveUser from "./commands/activeUsers/deleteActiceUser";
import * as EmployeeExistsQuery from "./commands/employees/activeEmployeeExistsQuery";

export const start = async (req: Request, res: Response): Promise<void> => {
	// starter
	console.log("starter");
	return res.render(ViewNameLookup.SignIn);
	// return EmployeeExistsQuery.execute()
	// 	.then((employeeCommandResponse: CommandResponse<Employee>): void => {
	// 		if (employeeCommandResponse.data == null) {
	// 			return res.redirect(ViewNameLookup.EmployeeDetail); // no employee load employee detail view
	// 		}

	// 		return res.render(ViewNameLookup.SignIn); // if employees exist then load sign in view
	// 	})
	// 	.catch((error: any): void => {
	// 		return res.redirect(ViewNameLookup.SignIn);
	// 	});
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
	//  TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	console.log("signin");
	return res.render(ViewNameLookup.MainMenu);
	// return EmployeeSigninCommand.signInProcedure(req.body, req.sessionID)
	// 	.then((): void => {
	// 		console.log("si2");
	// 		return res.redirect(RouteLookup.MainMenu);
	// 	})
	// 	.catch((error: any): void => {
	// 		console.error("Error at sign in" + error.message);

	// 		return res.redirect(
	// 			RouteLookup.SignIn +
	// 				"?" +
	// 				QueryParameterLookup.ErrorCode +
	// 				"=" +
	// 				ResourceKey.USER_UNABLE_TO_SIGN_IN
	// 		);
	// 	});
};

export const clearActiveUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
	console.log("signout");
	return res.render(ViewNameLookup.SignIn);
	// if (req.session == null) {
	// 	return res.redirect(RouteLookup.SignIn);
	// }
	// ClearActiveUser.deleteActive(req.session.id);
	// return res.redirect(RouteLookup.SignIn);
};
