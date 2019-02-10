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

const redirect = function (res, location) {
	res.statusCode = 302;
	res.setHeader("Location", location);
	res.end();
};

const setCookie = function(res, name, value) {
	res.setHeader('Set-Cookie', `${name}=${value}`)
};

const getCookie = function(req, name){
	let cookies = readArgs(req.headers['cookie']);
	return cookies[name];
};

const decrypt = function(content){
	return unescape(content).replace(/\+/g, " ").trim();
};

module.exports = {
	readArgs,
	sendContent,
	sendNotFound,
	redirect,
	setCookie,
	getCookie,
	decrypt
};