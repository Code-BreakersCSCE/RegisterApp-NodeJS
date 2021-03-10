import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import { ActiveUser, CommandResponse, Employee } from "../../typeDefinitions";
import { Resources, ResourceKey } from "../../../resourceLookup";

 //functianlity for finding active user

export const execute = async (): Promise<CommandResponse<EmployeeModel>> =>{
    return employeeInfo.queryActiveExists()
    .then((foundEmployee: EmployeeModel|null): Promise<CommandResponse<EmployeeModel>>=>
    {
        if(!foundEmployee)
        {
            return Promise.reject(<CommandResponse<EmployeeModel>>
                {
                    status: 404, 
                    message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
                });
        }

        return Promise.resolve(<CommandResponse<EmployeeModel>>
            {
                status: 200,
                data: foundEmployee
               
                
                
            });
        
    });
};