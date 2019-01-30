const App = require('./createApp');
const app = new App();

const {
	readBody,
	logRequest,
	renderFile,
	renderHomePage,
	renderUsersName,
	signUp,
	renderLogin,
	login,
	renderUserHomePage,
	renderTodoEditor,
	updateList,
	renderTodoList,
	deleteList,
	logOut } = require('./requestHandlers');

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

module.exports = app.handleRequest.bind(app);