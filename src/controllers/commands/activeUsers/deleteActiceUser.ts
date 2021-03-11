import * as makeTransaction from "../models/databaseConnection";
import { ActiveUserModel, queryBySessionKey } from "../models/activeUserModel";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { Resources, ResourceKey } from "../../../resourceLookup";

export async function deleteActive(sessionId: string) {
	return makeTransaction.createTransaction().then(function (transaction) {
		return queryBySessionKey(sessionId, transaction).then(function (user) {
			if (user) {
				user.destroy();
				transaction.commit();
				return <CommandResponse<ActiveUserModel>>{
					status: 200,
					message: "user deleted",
				};
			} else {
				transaction.rollback();
				return <CommandResponse<ActiveUserModel>>{
					status: 500,
					message: Resources.getString(
						ResourceKey.USER_SESSION_NOT_FOUND
					),
				};
			}
		});
	});
}
