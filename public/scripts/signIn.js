document.addEventListener("DOMContentLoaded", () => {
	const employeeIdEditElement = getEmployeeIdEditElement();
});

function validateForm() {
	const employeeIdEditElement = getEmployeeIdEditElement();
	if (
		isNaN(Number(employeeIdEditElement.value)) ||
		Number(employeeIdEditElement.value) <= 0
	) {
		displayError("Check Employee ID");
		return false;
	}

	const passwordEditElement = getPasswordEditElement();
	if (
		passwordEditElement.value == null ||
		passwordEditElement.value.trim() === ""
	) {
		displayError("Password is blank");
		return false;
	}

	return true;
}

function getPasswordEditElement() {
	return document.getElementById("password");
}

function getEmployeeIdEditElement() {
	return document.getElementById("employeeId");
}
