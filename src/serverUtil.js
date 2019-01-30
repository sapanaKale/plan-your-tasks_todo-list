const { initializeUsersDetails } = require('./dataUtil');

const usersDetails = initializeUsersDetails();

const readArgs = function (text) {
	const args = new Object;
	const splitKeyValue = pair => pair.split('=');
	const assignKeyValueToArgs = ([key, value]) => args[key] = value;
	text.split('&').map(splitKeyValue).forEach(assignKeyValueToArgs);
	return args;
};

const send = function (statusCode, content, res) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const sendContent = send.bind(null, 200);
const sendNotFound = send.bind(null, 404, "Not Found");
const sendServerError = send.bind(null, 500, "Internal Server Error");

const redirect = function (res, location) {
	res.statusCode = 302;
	res.setHeader("Location", location);
	res.end();
};

const getPath = function (url) {
	if (url == "/") return "./public/index.html";
	return "./public" + url;
};

const isErrorFileNotFound = function (errorCode) {
	return errorCode == "ENOENT";
};

const setCookie = function (res, cookie) {
	res.setHeader('Set-Cookie', "username=" + cookie);
};

const getUserName = function (req) {
	return req.headers['cookie'].split("=")[1];
};

const getAllUsersName = function () {
	return JSON.stringify(Object.keys(usersDetails));
};

module.exports = {
	readArgs,
	sendContent,
	sendNotFound,
	sendServerError,
	redirect,
	getPath,
	isErrorFileNotFound,
	setCookie,
	getUserName,
	getAllUsersName
};