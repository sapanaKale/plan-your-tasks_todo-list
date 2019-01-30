const fs = require('fs');
const App = require('./createApp');
const app = new App();

const { User,
	Todo,
	getAllUsersName,
	homePage,
	initialLoginPage,
	loginPageWithErr } = require('./lib');

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

const readArgs = function (text) {
	const args = {};
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
		}
	});
};

const renderHomePage = function (req, res, next) {
	if (req.headers['cookie']) return redirect(res, '/userHomePage');
	sendContent(homePage, res);
};

const renderUsersName = function (req, res, next) {
	sendContent(getAllUsersName(), res);
};

const signUp = function (req, res, next) {
	const { userName, email, password } = readArgs(req.body);
	const user = new User(userName)
	user.register(email, password);
	user.initializeData();
	renderLogin(req, res, next);
};

const renderLogin = function (req, res, next) {
	sendContent(initialLoginPage, res);
};

const setCookie = function (res, cookie) {
	res.setHeader('Set-Cookie', "username=" + cookie);
};

const getUserName = function (req) {
	return req.headers['cookie'].split("=")[1];
};

const login = function (req, res, next) {
	const { userName, password } = readArgs(req.body);
	const user = new User(userName);
	if (user.isValidUser(password)) {
		setCookie(res, userName);
		return redirect(res, '/userHomePage');
	};
	sendContent(loginPageWithErr, res);
};

const renderUserHomePage = function (req, res, next) {
	try {
		const userName = getUserName(req);
		const user = new User(userName);
		sendContent(user.getHomePage(), res);
	} catch (err) {
		sendNotFound(res);
	}
};

const renderTodoEditor = function (req, res, next) {
	const todoDetails = readArgs(req.body);
	const userName = getUserName(req);
	const user = new User(userName);
	user.initializeTodo(todoDetails);
	const todo = new Todo(todoDetails.title, todoDetails.description)
	sendContent(todo.editor(), res);
};

const updateList = function (req, res, next) {
	const { title, listItems } = readArgs(req.body);
	const userName = getUserName(req);
	const user = new User(userName);
	user.updateList(title, listItems);
};

const renderTodoList = function (req, res, next) {
	try {
		const user = new User(getUserName(req));
		const title = req.url.slice(6);
		let { description, listItems } = user.getListData(title);
		listItems = JSON.parse(listItems);
		const todo = new Todo(title, description, listItems);
		sendContent(todo.editor(), res);
	} catch (err) {
		sendNotFound(res);
	}
};

const deleteList = function (req, res, next) {
	const title = readArgs(req.body).title;
	const userName = getUserName(req);
	const user = new User(userName);
	user.deleteList(title);
};

const logOut = function (req, res, next) {
	const now = new Date().toUTCString();
	res.setHeader("Set-Cookie", `username=; expires=${now}`);
	redirect(res, '/');
};

app.use(readBody);
app.use(logRequest);
app.get('/', renderHomePage);
app.get('/usersName', renderUsersName);
app.post('/signUp', signUp);
app.get('/loginPage.html', renderLogin);
app.post('/login', login);
app.post('/createToDo.html', renderTodoEditor);
app.post('/updateList', updateList);
app.get('/userHomePage', renderUserHomePage);
app.get(/\/todo\//, renderTodoList);
app.post('/deleteList', deleteList);
app.post('/logout', logOut);
app.use(renderFile);

const requestHandler = app.handleRequest.bind(app);

module.exports = {
	requestHandler,
	logRequest,
	readArgs,
	readBody,
	renderFile,
	renderLogin,
	renderUserHomePage,
	login,
	renderUsersName,
	renderHomePage,
	logOut,
	signUp
};