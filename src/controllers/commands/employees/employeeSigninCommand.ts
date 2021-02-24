import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import { DatabaseConnection } from "../models/databaseConnection";
import { Http2ServerRequest, Http2ServerResponse } from "http2";


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

function findEmployee(id: signIn) 
{
    
    return employeeInfo.queryByEmployeeId(Number(id.employeeId));
}

function checkPassword(InputPassword: signIn, employee:signIn) 
{
    if(InputPassword.password == String(employee.password))
    {
        return true;
    }
    else
    {
        return false;
    }
}

var express = require("express");
var sesseion=require("express-session");
var app=express();

app.use(sesseion({secret:"String for place holder"}))
app.post('/', function(req  , res)
{ 
    
    if(verifyCredentals(req))
    {
        var employee: EmployeeModel
        employee=findEmployee(req)
        if(checkPassword(req,employee))
        
        {

        }    
    }
    

})