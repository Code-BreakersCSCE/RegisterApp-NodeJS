import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import { DatabaseConnection } from "../models/databaseConnection";


interface signIn
{
    employeeId: string;
    password: string;

}

function verifyId(id: signIn)
{
   return isNaN(Number(id.employeeId));
    
}

function verifyPassword(password: signIn)
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
    return (verifyId(credentals) && verifyPassword(credentals));
}

function findEmployee(id: signIn)
{
    return employeeInfo.queryByEmployeeId(Number(id.employeeId));
}

function checkPassword(password: signIn, employee: EmployeeModel)
{
    if(password.password == String(employee.password))
    {
        return true;
    }
    else
    {
        return false;
    }
}