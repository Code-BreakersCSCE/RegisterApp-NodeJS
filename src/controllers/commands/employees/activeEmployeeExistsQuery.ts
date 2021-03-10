import { EmployeeModel } from "../models/employeeModel";
import* as employeeInfo from "../models/employeeModel";
import { CommandResponse, Employee } from "../../typeDefinitions";
import { Resources, ResourceKey } from "../../../resourceLookup";

 //functianlity for finding active user

export const execute = async (): Promise<CommandResponse<Employee>> =>{
    return employeeInfo.queryActiveExists()
    .then((foundEmployee: EmployeeModel|null): Promise<CommandResponse<Employee>>=>
    {
        if(!employeeInfo)
        {
            return Promise.reject(<CommandResponse<Employee>>
                {
                    status: 404, 
                    message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
                });
        }

        return Promise.resolve(<CommandResponse<Employee>>
            {
                status: 200,
                
            });
        
    });
};