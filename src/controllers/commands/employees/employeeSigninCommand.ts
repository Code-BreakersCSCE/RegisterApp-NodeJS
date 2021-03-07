import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import {createTransaction} from "../models/databaseConnection"
import * as makeTransaction from "../models/databaseConnection"
import { ActiveUserModel, queryByEmployeeId, queryById, queryBySessionKey } from "../models/activeUserModel";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { Resources, ResourceKey } from "../../../resourceLookup";

import sequelize from "sequelize";
import { promises } from "dns";






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
    
    

  function checkPassword(InputPassword: signIn, dataBasePassword: String) 
{
    
    
    if(InputPassword.password == dataBasePassword)
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function inTransaction(id:ActiveUserModel, key: String) :Promise<CommandResponse<ActiveUserModel>>
{
    return createTransaction().then(function(Transaction) 
    {  
        // updateing the database
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
         // error handling 
        }).catch(function(error:any): Promise<CommandResponse<ActiveUserModel>>
            {

            Transaction.rollback()
            return Promise.reject(<CommandResponse<ActiveUserModel>>
            {
                status: 500,
                message: Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
            })
        })
    
    })
}

async function signInProcedure(request:signIn, sessionKey:String ='') :Promise<CommandResponse<ActiveUserModel>>
{
    if(sessionKey=='' && !verifyCredentals(request))
    {
        return Promise.reject(<CommandResponse<ActiveUserModel>>
        {
            status: 500,
            message: Resources.getString(ResourceKey.USER_SIGN_IN_CREDENTIALS_INVALID)
        
        })
    }
    // checking sign in and updating table
    return employeeInfo.queryByEmployeeId(Number(request.employeeId)).then(function(employee)
    {
        if(employee!=null && checkPassword(request, String(employee.password)))
        {
          return inTransaction(<ActiveUserModel>{employeeId:employee.id,
            name:(employee.firstName+" "+employee.lastName),
            classification:employee.classification},sessionKey) 
        }
        else
        {
            return Promise.reject(<CommandResponse<ActiveUserModel>>
                {
                    status: 401,
                    message:Resources.getString(ResourceKey.USER_UNABLE_TO_SIGN_IN)
                })
        }
    }).then(function(value)
    {
        return <CommandResponse<ActiveUserModel>>
        {
            status:200,
            data: <ActiveUserModel>
            {
                id: (<ActiveUserModel>value.data).id,
                name:(<ActiveUserModel>value.data).name,
                employeeId: (<ActiveUserModel>value.data).employeeId,
                classification: (<ActiveUserModel>value.data).classification
            }
        }
    })
}