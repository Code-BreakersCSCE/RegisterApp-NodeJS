
import { CommandResponse, Employee } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { mapEmployeeData } from "./helpers/employeeHelper";



export async function  findById(id:string) :Promise<CommandResponse<Employee>> {
   if(id=="")
   {
       return Promise.reject(<CommandResponse<Employee>>{
           status: 422,
           message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
       })
   }

   return EmployeeRepository.queryById(id).then(function(Employee){
       if(Employee)
       {
           return Promise.resolve(<CommandResponse<Employee>>{
               status: 200,
               data: mapEmployeeData(Employee)
           });
       }

       return Promise.reject(<CommandResponse<Employee>>{
           status:404,
           message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
       });
   })
    
};

