import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import {createTransaction} from "../models/databaseConnection"
import * as makeTransaction from "../models/databaseConnection"
import { ActiveUserModel, queryByEmployeeId, queryById, queryBySessionKey } from "../models/activeUserModel";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { promises } from "dns";
import sequelize from "sequelize";






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

async function findEmployee(id: signIn ) :Promise<CommandResponse<EmployeeModel>> 
{
     return employeeInfo.queryByEmployeeId(Number(id.employeeId)).then(function(value)
      {
          if(value)
          {
              return Promise.resolve(<CommandResponse<EmployeeModel>> 
                {status:200,
                 data: value
                });
          }
          else
          {
            return Promise.reject(<CommandResponse<EmployeeModel>>{
                status: 404,
                message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
            });
          }
      });
   
      
    
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

async function inTransaction(id:ActiveUserModel, key: string) :Promise<CommandResponse<ActiveUserModel>>
{
    return createTransaction().then(function(Transaction) 
    {
        return queryByEmployeeId(id.employeeId, Transaction).then(function(user)
        {
            if(user)
            {
                return user.update(<object>{sessionKey:key}, <sequelize.InstanceUpdateOptions>{transaction:Transaction})
            }
            else
            {
                return ActiveUserModel.create(id,<sequelize.CreateOptions>{transaction:Transaction})
            }
        }).then(function(user)
        {
            Transaction.commit()
            return <CommandResponse<ActiveUserModel>>
            {
                status:200,
                data:user
            }
        })
    })
    
}