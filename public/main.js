const disableSubmit = function () {
	document.getElementById('submit').disabled = true;
};

const validateUserName = function (userName) {
	fetch('/usersName')
		.then(function (res) {
			return res.json();
		})
		.then(function (names) {
			checkUserName(userName, names);
		})
};

const checkUserName = function (userName, names) {
	document.getElementById('unMsg').innerText = "";
	if (names.includes(userName)) {
		document.getElementById('unMsg').innerText = "userName already exists!!";
		disableSubmit();
	};
};

const isPasswordInvalid = function () {
	const password = document.getElementById('password').value;
	const confirmedPassword = document.getElementById('confirmPassword').value;
	return password != confirmedPassword;
};

const checkPassword = function () {
	document.getElementById('pwMsg').innerText = "";
	if (isPasswordInvalid()) {
		document.getElementById("pwMsg").innerText = "password doesn't match"
		disableSubmit();
	};
};

const validateInfo = function () {
	document.getElementById('submit').disabled = false;
	checkPassword();
	const name = document.getElementById('userName').value;
	validateUserName(name);
};

const newToDo = `<form action="/createToDo.html" method="POST">
Title:
<input type="text" name="title" required>
<br><br>
Description:
<textarea name="description" cols="30" rows="3"></textarea>
<br><br>
<input type="submit" value="Add List">
</form>
`

const createNewToDo = function () {
	document.getElementById("newToDo").innerHTML = newToDo;
};

const deleteElement = () => event.target.parentNode.remove();

const createDeleteOption = function () {
	let deleteItem = document.createElement("span");
	deleteItem.innerText = " x ";
	deleteItem.style.color = "red";
	deleteItem.style.float = "right";
	deleteItem.onclick = deleteElement;
	return deleteItem;
};

const createItemsDiv = function () {
	let itemDiv = document.createElement("div");
	itemDiv.style.width = "50%";
	itemDiv.style.fontSize = "30px";
	itemDiv.appendChild(createDeleteOption());
	return itemDiv;
};

const createListItem = function () {
	let item = document.createElement("li");
	item.innerText = document.getElementById("myInput").value;
	item.onclick = changeStatus;
	return item;
};

const addItems = function () {
	let itemsList = document.getElementById("myLI");
	let itemDiv = createItemsDiv();
	itemDiv.appendChild(createListItem());
	itemsList.appendChild(itemDiv);
};

const changeStatus = function () {
	if (event.target.style.textDecoration == "line-through") {
		return event.target.style.textDecoration = "none";
	}
	event.target.style.textDecoration = "line-through"
};

const saveList = function () {
	let title = document.getElementById("title").innerText;
	let list = { title, "listItems": {} };
	let listItems = document.getElementsByTagName('li');
	for (let pos = 0; pos < listItems.length; pos++) {
		list.listItems[listItems[pos].innerText] = "pending";
		if (listItems[pos].style.textDecoration == "line-through") {
			list.listItems[listItems[pos].innerText] = "done";
		};
	}
	fetch('/updateList', {
		method: 'POST',
		body: `title=${list.title}&listItems=${JSON.stringify(list.listItems)}`
	})
};