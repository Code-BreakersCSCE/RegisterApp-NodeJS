document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm(empID, empPass) {
	let numTest = /^\d+$/.test(empID);
	
	if (numTest == false) {
		return false; //this return case is for invalid employee ID
	} else if (empPass === "") {
		return false; //this return case is for invalid employee password
	} else {
		return true;
	}
}
