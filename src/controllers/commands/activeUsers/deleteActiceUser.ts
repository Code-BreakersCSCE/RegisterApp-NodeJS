import {createTransaction} from "../models/databaseConnection"
import * as makeTransaction from "../models/databaseConnection"
import { ActiveUserModel, queryBySessionKey } from "../models/activeUserModel";
 

async function deleteActive(sessionId:string)   
{
    let transaction = await makeTransaction.createTransaction();
    let user= await queryBySessionKey(sessionId, transaction)
    if(user)
    {
        user.destroy()
    }
}