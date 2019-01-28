const fs = require('fs');
const usersDetails = JSON.parse(fs.readFileSync('./private/usersDetails.json'));
const usersData = JSON.parse(fs.readFileSync('./private/usersData.json'));

const App = require('./createApp');
const app = new App();

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
	let args = {};
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
	res.statusCode = 301;
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
	let path = getPath(req.url);
	fs.readFile(path, (err, content) => {
		try {
			sendContent(content, res);
		} catch (error) {
			if (isErrorFileNotFound(err.code)) {
				sendNotFound(res);
				return;
			}
			sendServerError(res);
		};
	});
};

const renderHomePage = function (req, res, next) {
	if (req.headers['cookie']) {
		let cookie = getUserName(req);
		let userHomePage = fs.readFileSync('./public/userHomePage.html', 'utf8');
		userHomePage = userHomePage.replace('##username##', cookie);
		return sendContent(userHomePage, res);
	};
	sendContent(fs.readFileSync('./public/index.html', 'utf8'), res);
};

const renderUsersName = function (req, res, next) {
	sendContent(JSON.stringify(Object.keys(usersDetails)), res);
};

const signUp = function (req, res, next) {
	let { userName, email, password } = readArgs(req.body);
	usersDetails[userName] = { email, password };
	let details = JSON.stringify(usersDetails);
	fs.writeFile('./private/usersDetails.json', details, () => { });
	usersData[userName] = {}
	fs.writeFile('./private/usersData.json', JSON.stringify(usersData), () => { });
	renderLogin(req, res, next);
};

const renderLogin = function (req, res, next) {
	let loginPage = fs.readFileSync('./public/loginPage.html', 'utf8');
	loginPage = loginPage.replace("#msg#", "");
	sendContent(loginPage, res);
};

const isValidUserName = function (userName) {
	return Object.keys(usersDetails).includes(userName);
};

const isValidPassword = function (userName, password) {
	return usersDetails[userName].password == password;
};

const isValidUser = function (userName, password) {
	return isValidUserName(userName) && isValidPassword(userName, password);
};

const loginPageWithError = function (res) {
	let loginPage = fs.readFileSync('./public/loginPage.html', 'utf8');
	loginPage = loginPage.replace("#msg#", "invalid username or password");
	sendContent(loginPage, res);
};

const setCookie = function (res, cookie) {
	res.setHeader('Set-Cookie', "username=" + cookie);
};

const getUserName = function (req) {
	return req.headers['cookie'].split("=")[1];
};

const login = function (req, res, next) {
	let { userName, password } = readArgs(req.body);
	let userHomePage = fs.readFileSync('./public/userHomePage.html', 'utf8');
	if (isValidUser(userName, password)) {
		userHomePage = userHomePage.replace('##username##', userName);
		setCookie(res, userName);
		return redirect(res, '/userHomePage');
	};
	loginPageWithError(res);
};

const renderLogOut = function (req, res, next) {
	res.setHeader("Set-Cookie", "username=; expires=" + new Date().toUTCString());
	redirect(res, '/');
};

const renderCreateTodo = function (req, res, next) {
	let { title, description } = readArgs(req.body);
	usersData[getUserName(req)][title] = { description, "listItems": [] };
	fs.writeFile('./private/usersData.json', JSON.stringify(usersData), () => { });
	let todoPage = fs.readFileSync('./public/createTodo.html', 'utf8');
	todoPage = todoPage.replace(/##title##/g, title);
	todoPage = todoPage.replace('##description##', description);
	sendContent(todoPage, res);
};

const updateList = function (req, res, next) {
	let { title, listItems } = readArgs(req.body);
	usersData[getUserName(req)][title].listItems = listItems;
	fs.writeFile('./private/usersData.json', JSON.stringify(usersData), () => { });
};

const generateToDoListHtml = function (titleList) {
	let listHtml = titleList.map(x =>
		`<div style = "width:40px;">${x}</div>`
	);
	return listHtml.join('');
};

const renderUserHomePage = function (req, res, next) {
	let userName = getUserName(req);
	let userHomePage = fs.readFileSync('./public/userHomePage.html', 'utf8');
	userHomePage = userHomePage.replace('##username##', userName);
	let lists = Object.keys(usersData[userName]);
	userHomePage = userHomePage.replace('##myLists##', generateToDoListHtml(lists));
	return sendContent(userHomePage, res);
};

app.use(readBody);
app.use(logRequest);
app.get('/', renderHomePage);
app.get('/usersName', renderUsersName);
app.post('/signUp', signUp);
app.get('/loginPage.html', renderLogin);
app.post('/login', login);
app.post('/createToDo.html', renderCreateTodo);
app.post('/updateList', updateList);
app.get('/userHomePage', renderUserHomePage);
app.post('/logout', renderLogOut);
app.use(renderFile);

const requestHandler = app.handleRequest.bind(app);

module.exports = {
	requestHandler,
	logRequest,
	readArgs,
	readBody,
	renderFile,
	renderLogin,
	loginPageWithError,
	renderUserHomePage: login,
	renderUsersName,
	renderHomePage,
	renderLogOut,
	signUp
};