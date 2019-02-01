const fs = require('fs');

const User = require('./user');
const Todo = require('./todo');
const { homePage, loginPageWithErr, initialLoginPage } = require('./constants');

const {
	readArgs,
	sendContent,
	sendNotFound,
	sendServerError,
	redirect,
	getPath,
	isErrorFileNotFound,
	setCookie,
	getCookie,
} = require('./serverUtil');

const logRequest = function (req, res, next) {
	console.log(req.method, req.url);
	console.log('headers =>', JSON.stringify(req.headers, null, 2));
	console.log('body =>', req.body);
	next();
};

const readBody = function (req, res, next) {
	let content = "";
	req.on('data', (chunk) => content += chunk);
	req.on('end', () => {
		req.body = content;
		next();
	});
};

const renderFile = function (req, res) {
	const path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		try {
			sendContent(content, res);
		} catch (error) {
			if (isErrorFileNotFound(err.code)) {
				return sendNotFound(res);
			}
			sendServerError(res);
		};
	});
};

const renderHomePage = function (req, res, next) {
	if (req.headers['cookie']) return redirect(res, '/userHomePage');
	sendContent(homePage, res);
};

const validateUserName = function (req, res, next) {
	const { userName } = readArgs(req.body);
	const user = new User(userName);
	const validation = user.isNameAvailable();
	sendContent(JSON.stringify({ validation }), res);
}

const signUp = function (req, res, next) {
	const { userName, email, password, confirmedPassword } = readArgs(req.body);
	const user = new User(userName)
	user.register(email, password);
	user.initializeData();
	renderLogin(req, res, next);
};

const renderLogin = function (req, res, next) {
	sendContent(initialLoginPage, res);
};

const login = function (req, res, next) {
	const { userName, password } = readArgs(req.body);
	const user = new User(userName);
	if (user.isValidUser(password)) {
		setCookie(res, "username", userName);
		return redirect(res, '/userHomePage');
	};
	sendContent(loginPageWithErr, res);
};

const renderUserHomePage = function (req, res, next) {
	try {
		const userName = getCookie(req, "username");
		const user = new User(userName);
		sendContent(user.getHomePage(), res);
	} catch (err) {
		sendNotFound(res);
	};
};

const renderTodoEditor = function (req, res, next) {
	const todoDetails = readArgs(req.body);
	const userName = getCookie(req, "username");
	const user = new User(userName);
	user.initializeTodo(todoDetails);
	const todo = new Todo(todoDetails.title, todoDetails.description)
	sendContent(todo.editor(), res);
};

const updateList = function (req, res, next) {
	const { title, listItems } = readArgs(req.body);
	const userName = getCookie(req, "username");
	const user = new User(userName);
	user.updateList(title, listItems);
};

const renderTodoList = function (req, res, next) {
	try {
		const user = new User(getCookie(req, "username"));
		const title = req.url.slice(6);
		let { description, listItems } = user.getListData(title);
		listItems = JSON.parse(listItems);
		const todo = new Todo(title, description, listItems);
		sendContent(todo.editor(), res);
	} catch (err) {
		sendNotFound(res);
	};
};

const deleteList = function (req, res, next) {
	const title = readArgs(req.body).title;
	const userName = getCookie(req, "username");
	const user = new User(userName);
	user.deleteList(title);
};

const logOut = function (req, res, next) {
	const now = new Date().toUTCString();
	res.setHeader("Set-Cookie", `username=; expires=${now}`);
	redirect(res, '/');
};

module.exports = {
	logRequest,
	readBody,
	logOut,
	signUp,
	renderFile,
	renderHomePage,
	renderLogin,
	renderUserHomePage,
	renderTodoList,
	renderTodoEditor,
	login,
	deleteList,
	updateList,
	validateUserName
};