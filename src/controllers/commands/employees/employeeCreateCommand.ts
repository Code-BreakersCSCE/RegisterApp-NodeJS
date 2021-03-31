import { CommandResponse, Employee } from "../../typeDefinitions";
import * as EmployeeRepository from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { mapEmployeeData,  } from "./helpers/employeeHelper";
import { isBlankString } from "../helpers/helper";



interface EmployeeSaveRequest{
    recordId: string,
    active: boolean,
    firstName:string,
    lastName:string,
    password:string,
    managerId?: string,
    classification: number,
    initialEmployee?: Boolean

};

function validateSaveRequest(req: EmployeeSaveRequest,initalEmployee:boolean=false):CommandResponse<Employee>{
    let invalidReq=false;
    let errMesage:String="";
    if(isBlankString(req.firstName)|| isBlankString(req.lastName)){
        invalidReq=true;
        errMesage="one of the name fields are blank";
    }
    else if(isBlankString(req.password))
    {
        invalidReq=true;
        errMesage=Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID)
    }
    else if(!initalEmployee &&((req.classification==null) || isNaN(req.classification) || !(req.classification in req )))
    {
        errMesage=Resources.getString(ResourceKey.EMPLOYEE_TYPE_INVALID);
        invalidReq=true;
    }

    if(!invalidReq)
    {
        return <CommandResponse<Employee>>{ status:200};
    }

    return <CommandResponse<Employee>>{
        status:422,
        message:errMesage
    };

}

export async function newEmployee(req:EmployeeSaveRequest, initalEmployee:boolean=false) {
    
}