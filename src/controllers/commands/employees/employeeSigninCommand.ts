import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import {createTransaction} from "../models/databaseConnection"
import * as makeTransaction from "../models/databaseConnection"
import { ActiveUserModel, queryByEmployeeId, queryById, queryBySessionKey } from "../models/activeUserModel";






interface signIn
{
    employeeId: string;
    password: string;

}

function verifyIfValidId(id: signIn)
{
   return !(isNaN(Number(id.employeeId)));
    
}

function verifyIfValidPassword(password: signIn)
{
    if(password.password)
    {
        return true
    }
    else
    {
        return false;
    }
}

function verifyCredentals(credentals:signIn)
{
    return (verifyIfValidId(credentals) && verifyIfValidPassword(credentals));
}

async function findEmployee(id: signIn )  
{
    var employeeData= await employeeInfo.queryByEmployeeId(Number(id.employeeId))
    return employeeData
    
}
    
    

  function checkPassword(InputPassword: signIn, employee: signIn) 
{
    
    var employeeData = employee
    if(InputPassword.password == String(employeeData.password))
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function inTransaction(id:string, key: string) 
{
    let transaction = await makeTransaction.createTransaction();
    let currentUser= await queryByEmployeeId(id, transaction);
    if(currentUser)
    {
        currentUser.sessionKey=key;
        currentUser.update(currentUser)
        
    }
    else
    {
       let newuser : ActiveUserModel =new ActiveUserModel
       newuser.employeeId=id
       newuser.sessionKey=key
       ActiveUserModel.create(newuser)
        
    }
    
}