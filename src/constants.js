const {
	getContent,
	replaceContent } = require('./dataUtil');

const userHomePage = getContent('./public/userHomePage.html');
const homePage = getContent('./public/index.html');
const todoEditor = getContent('./public/createTodo.html');
const loginPage = getContent('./public/loginPage.html');
const loginErr = "invalid username or password";
const initialLoginPage = replaceContent(loginPage, "#msg#", "");
const loginPageWithErr = replaceContent(loginPage, "#msg#", loginErr);

module.exports = {
	userHomePage,
	homePage,
	initialLoginPage,
	loginPageWithErr,
	todoEditor
};