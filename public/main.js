const disableSubmit = function () {
	document.getElementById('submit').disabled = true;
};

const validateUserName = function (userName) {
	fetch('/usersName')
		.then(function (res) {
			return res.json();
		})
		.then(function (names) {
			checkUserName(userName, names);
		})
};

const checkUserName = function (userName, names) {
	document.getElementById('unMsg').innerText = "";
	if (names.includes(userName)) {
		document.getElementById('unMsg').innerText = "userName already exists!!";
		disableSubmit();
	};
};

const isPasswordInvalid = function () {
	const password = document.getElementById('password').value;
	const confirmedPassword = document.getElementById('confirmPassword').value;
	return password != confirmedPassword;
};

const checkPassword = function () {
	document.getElementById('pwMsg').innerText = "";
	if (isPasswordInvalid()) {
		document.getElementById("pwMsg").innerText = "password doesn't match"
		disableSubmit();
	};
};

const validateInfo = function () {
	document.getElementById('submit').disabled = false;
	checkPassword();
	const name = document.getElementById('userName').value;
	validateUserName(name);
};