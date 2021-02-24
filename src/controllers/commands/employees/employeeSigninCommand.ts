import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";


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