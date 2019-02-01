const {
	replaceContent,
	updateUserData,
	updateUserDetails,
	initializeUsersData,
	initializeUsersDetails } = require('./dataUtil');

let usersData = initializeUsersData();
let usersDetails = initializeUsersDetails();

const { generateToDoListHtml } = require('./partialHtml');

const { userHomePage } = require('./constants');

class User {
	constructor(userName) {
		this.userName = userName;
	}

	isValidUserName() {
		return Object.keys(usersDetails).includes(this.userName);
	};

	isNameAvailable(){
		return !this.isValidUserName();
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

module.exports = User;