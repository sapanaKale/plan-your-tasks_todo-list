const fs = require('fs');

const usersDetails = JSON.parse(fs.readFileSync('./private/usersDetails.json'));
const usersData = JSON.parse(fs.readFileSync('./private/usersData.json'));

const {generateToDoListHtml, generateListItemsHtml} = require("./partialHtml");

const getContent = path => fs.readFileSync(path, 'utf8');

const replaceContent = function (page, replaceTo, replaceWith) {
	return page.replace(replaceTo, replaceWith);
};

const userHomePage = getContent('./public/userHomePage.html');
const todoEditor = getContent('./public/createTodo.html');
const homePage = getContent('./public/index.html');
const loginPage = getContent('./public/loginPage.html');
const loginErr = "invalid username or password";
const initialLoginPage = replaceContent(loginPage, "#msg#", "");
const loginPageWithErr = replaceContent(loginPage, "#msg#", loginErr);

const updateData = function (path, content) {
	fs.writeFile(path, content, () => { });
};

const updateUserDetails = updateData.bind(null, './private/usersDetails.json');
const updateUserData = updateData.bind(null, './private/usersData.json');

const getAllUsersName = function () {
	return JSON.stringify(Object.keys(usersDetails));
};

class User {
	constructor(userName) {
		this.userName = userName;
	}

	isValidUserName() {
		return Object.keys(usersDetails).includes(this.userName);
	};

	isValidPassword(password) {
		return usersDetails[this.userName].password == password;
	};

	isValidUser(password) {
		return this.isValidUserName() && this.isValidPassword(password);
	};

	register(email, password) {
		usersDetails[this.userName] = { email, password };
		updateUserDetails(JSON.stringify(usersDetails));
	};

	initializeData() {
		usersData[this.userName] = new Array;
		updateUserData(JSON.stringify(usersData));
	};

	initializeTodo(todoDetails) {
		const { title, description } = todoDetails;
		usersData[this.userName].unshift({ title, description, listItems: "[]" });
		updateUserData(JSON.stringify(usersData));
	};

	getListData(listTitle) {
		return usersData[this.userName].filter(x => x.title == listTitle)[0];
	};

	updateList(listTitle, listItems) {
		const todoList = this.getListData(listTitle);
		todoList.listItems = listItems;
		updateUserData(JSON.stringify(usersData));
	};

	getAlltodos() {
		return usersData[this.userName].map(x => x.title);
	};

	getHomePage() {
		const homePage = replaceContent(userHomePage, '##username##', this.userName);
		const lists = this.getAlltodos();
		const listsHtml = generateToDoListHtml(lists);
		return replaceContent(homePage, '##myLists##', listsHtml);
	};

	deleteList(title) {
		const list = this.getListData(title);
		const indexOfList = usersData[this.userName].indexOf(list);
		usersData[this.userName].splice(indexOfList, 1);
		updateUserData(JSON.stringify(usersData));
	};

};

class Todo {
	constructor(title, description, listItems = []) {
		this.title = title;
		this.description = description;
		this.listItems = listItems;
	};

	saveListItems(listItems) {
		this.listItems = listItems;
	};

	editor() {
		let todo = replaceContent(todoEditor, /##title##/g, this.title);
		todo = replaceContent(todo, '##description##', this.description);
		const listItemsHTML = generateListItemsHtml(this.listItems);
		return replaceContent(todo, '##listItems##', listItemsHTML);
	};

};

module.exports = {
	User,
	Todo,
	getAllUsersName,
	homePage,
	initialLoginPage,
	loginPageWithErr
}