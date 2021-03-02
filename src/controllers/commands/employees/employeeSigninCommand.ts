import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import {createTransaction} from "../models/databaseConnection"
import { Transaction } from "sequelize/types";
import { values } from "sequelize/types/lib/operators";
import {Express, response} from "express"




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

function findEmployee(id: signIn  ) 
{
    var promiseInfo= employeeInfo.queryByEmployeeId(Number(id.employeeId))
    var employee=promiseInfo.then(response=>
        { 
            const jason =JSON.stringify(response) 
            return jason
        })
        return employee
}
    
    

  function checkPassword(InputPassword: signIn, employee: EmployeeModel) 
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

