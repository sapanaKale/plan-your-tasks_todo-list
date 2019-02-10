const express = require('express');
const app = express();

const {
	readBody,
	logRequest,
	renderHomePage,
	signUp,
	renderLogin,
	login,
	renderUserHomePage,
	renderTodoEditor,
	updateList,
	renderTodoList,
	deleteList,
	logOut,
	validateUserName } = require('./requestHandlers');

app.use(readBody);
app.use(logRequest);
app.get('/', renderHomePage);
app.post('/validateUserName', validateUserName);
app.post('/signUp', signUp);
app.get('/login.html', renderLogin);
app.post('/login', login);
app.post('/todoEditor.html', renderTodoEditor);
app.post('/updateList', updateList);
app.get('/userHomePage', renderUserHomePage);
app.get(/\/todo\//, renderTodoList);
app.post('/deleteList', deleteList);
app.post('/logout', logOut);
app.use(express.static("public"));

module.exports = app;