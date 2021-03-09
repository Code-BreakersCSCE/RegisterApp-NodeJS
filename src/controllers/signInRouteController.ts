// import { Request, Response } from "express";
// import { Resources, ResourceKey } from "../resourceLookup";
// import { PageResponse, CommandResponse, ApiResponse, SignInRequest, Employee } from "./typeDefinitions"
// import { ParameterLookup, QueryParameterLookup, ViewNameLookup, RouteLookup } from "./lookups/routingLookup"
// import * as EmployeeSigninCommand from "./commands/employees/employeeSigninCommand"
// import * as ClearActiveUser from "./commands/activeUsers/deleteActiceUser";
// import * as EmployeeExistsQuery from "./commands/employees/activeEmployeeExistsQuery";

// export const start = async (req: Request, res: Response): Promise<void> =>
// {
// 	// starter
// 	return EmployeeExistsQuery.execute()
// 		.then((employeeCommandResponse: CommandResponse<Employee>): void => 
// 		{
// 			if (employeeCommandResponse.data == null)
// 			{
// 				return res.redirect(ViewNameLookup.EmployeeDetail); // no employee load employee detail view
// 			}
// 			else
// 			{
// 				return res.render(ViewNameLookup.SignIn); // if employees exist then load sign in view
// 			}
// 		})
// };

// export const signIn = async (req: Request, res: Response): Promise<void> =>
// {
// 	//  TODO: Use the credentials provided in the request body (req.body)
// 	//  and the "id" property of the (Express.Session)req.session variable
// 	//  to sign in the user
// 	return EmployeeSigninCommand.signInProcedure(req.body, req.session.id)
// 		.then(): void => {
// 			return res.redirect(ViewNameLookup.MainMenu); // successful sign in

// 		}).catch((error: any): void => {
// 			return res.redirect(ViewNameLookup.SignIn); // failed sign in returns to sign in page

// 		});
// };

// export const clearActiveUser = async (req: Request, res: Response): Promise<void> =>
// {
// 	// TODO: Sign out the user associated with req.session.id
// 	if (req.session == null)
// 	{
// 		return res.redirect(RouteLookup.SignIn);
// 	}

// 	return ClearActiveUser.deleteActive(req.session.id);
// };
