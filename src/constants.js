const {
	getContent,
	replaceContent } = require('./dataUtil');

const userHomePage = getContent('./public/userHome.html');
const homePage = getContent('./public/index.html');
const todoEditor = getContent('./public/todoEditor.html');
const loginPage = getContent('./public/login.html');
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