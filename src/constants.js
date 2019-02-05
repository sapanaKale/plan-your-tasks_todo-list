const {
	getContent,
	replaceContent } = require('./dataUtil');

const userHomePage = getContent('./public/html/userHome.html');
const homePage = getContent('./public/html/index.html');
const todoEditor = getContent('./public/html/todoEditor.html');
const loginPage = getContent('./public/html/login.html');
const loginErrMsg = "invalid username or password";
const initialLoginPage = replaceContent(loginPage, "#msg#", "");
const loginPageWithErr = replaceContent(loginPage, "#msg#", loginErrMsg);

module.exports = {
	userHomePage,
	homePage,
	initialLoginPage,
	loginPageWithErr,
	todoEditor
};