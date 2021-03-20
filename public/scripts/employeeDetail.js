let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Things that need doing when the view is loaded
    document.getElementById("saveButton").addEventListener("click, saveActionClick");
	
	const employeefirstnameElement = getEmployeeFirstNameElement();

	employeefirstnameElement.focus();
	employeefirstnameElement.select();
	
});

// Save
function saveActionClick(event) {
    if(!validateSave()){
        return;
    }

    const saveActionElement = event.target;
    saveActionElement.disabled = true;

    const employeeId = getEmployeeId();
    const employeeIdIsDefined = ((employeeId != null) && (employeeId.trim() !== ""));
	const saveActionUrl = ("/api/employeeDetail/"
    + (employeeIdIsDefined ? employeeId : ""));
    const saveEmployeeRequest = {
        id: employeeId,
		managerId: getEmployeeManagerId().value,
        lastname : getEmployeeLastNameElement().value,
		firstname : getEmployeeFirstNameElement().value,
		password : getEmployeePasswordEditElement().value,
        classification: getEmployeeTypeSelectElement().value
    };
    // TODO: Actually save the employee via an AJAX call

    if (employeeIdIsDefined){
        ajaxPut(saveActionUrl, saveemployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

        if (isSuccessResponse(callbackResponse)) {    
	    completeSaveAction(callbackResponse);
        }
        });
    
    }  else {
        ajaxPost(saveActionUrl, saveemployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse)) {
				completeSaveAction(callbackResponse);

				
				}
			
		});
	}   
        
}

function validateSave() {
	const firstNameElement = getEmployeeFirstNameElement();
	if (firstNameElement.value.trim() === "") {
		displayError("Please provide a valid employee First name.");
		firstNameElement.focus();
		firstNameElement.select();
		return false;
	}

	const lastNameElement = getEmployeeLastNameElement();
	if (lastNameElement.value.trim() === "") {
		displayError("Please provide a valid employee last name.");
		lastNameElement.focus();
		lastNameElement.select();
		return false;
	}

	const passwordElement = getEmployeePasswordElement();
	if (passwordElement.value.trim() === "") {
		displayError("Please provide a valid employee password.");
		passwordElement.focus();
		passwordElement.select();
		return false;
	}

	if (passwordElement.value !== getEmployeeConfirmPassword()) {
		displayError("Passwords do not match.");
		passwordElement.focus()
		passwordElement.select();
		return false;
	}

	const employeeTypeSelectElement = getEmployeeTypeSelectElement();
	if (!employeeTypeSelectElement.closest("tr").classList.contains("hidden")) {
		if (employeeTypeSelectElement.value <= 0) {
			displayError("Please provide a valid employee Type.");
			employeeTypeSelectElement.focus();
			return false;
		}
	}

	return true;
}
function completeSaveAction(callbackResponse){
	if(callbackResponse.data = null){
		return;
	}
	if ((callbackResponse.data.redirectUrl != null)
		&& (callbackResponse.data.redirectUrl !== "")) {

		window.location.replace(callbackResponse.data.redirectUrl);
		return;
	}
	
	displayEmployeeSavedAlertModal();

	const employeeEmployeeIdElement = getEmployeeEmployeeIdElement();
	const employeeEmployeeIdRowElement = employeeEmployeeIdElement.closest("tr");
	if (employeeEmployeeIdRowElement.classList.contains("hidden")) {
		setEmployeeId(callbackResponse.data.employee.id);
		employeeEmployeeIdElement.value = callbackResponse.data.employee.employeeId;
		employeeEmployeeIdRowElement.classList.remove("hidden");
	}
}
function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	getSavedAlertModalElement().style.display = "none";
}
// End save

//Beginning of getters and setters
function getEmployeeId(){
	return document.getElementById("employeeId").value;	
}
function setEmployeeId(employeeId) {
	document.getElementById("employeeId").value = employeeId;
}

function getEmployeeManagerId() {
	return document.getElementById("employeeManagerId").value;
}

function getEmployeeEmployeeId() {
	return getEmployeeEmployeeIdElement().value;
}
function getEmployeeEmployeeIdElement() {
	return document.getElementById("employeeEmployeeId");
}

function getSavedAlertModalElement() {
	return document.getElementById("employeeSavedAlertModal");
}

function getEmployeeFirstNameEditElement() {
	return document.getElementById("employeeFirstName");
}

function getEmployeeLastNameEditElement() {
	return document.getElementById("employeeLastName");
}

function getEmployeePasswordEditElement() {
	return document.getElementById("employeePassword");
}

function getEmployeeConfirmPassword() {
	return document.getElementById("employeeConfirmPassword").value;
}

function getEmployeeTypeSelectElement() {
	return document.getElementById("employeeType");
}
//End of getters and setters