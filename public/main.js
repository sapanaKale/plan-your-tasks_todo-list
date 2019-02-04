const disableSubmit = function () {
	document.getElementById('submit').disabled = true;
};

const isPasswordInvalid = function () {
	const password = document.getElementById('password').value;
	const confirmedPassword = document.getElementById('confirmPassword').value;
	return password != confirmedPassword;
};

const removeErrMsg = function () {
	document.getElementById("unMsg").innerText = "";
};

const enableSubmit = function () {
	document.getElementById('submit').disabled = false;
};

const validateUserName = function () {
	const name = document.getElementById('userName').value;
	fetch('/validateUserName', {
		method: 'POST',
		body: `userName=${name}`
	})
		.then(res => res.json())
		.then(result => {
			document.getElementById("checkInfo").disabled = false;
			if (!result.validation) {
				document.getElementById("checkInfo").disabled = true;
				document.getElementById("unMsg").innerText = "UserName Already Exists";
			};
		});
};

const validatePassword = function () {
	if (isPasswordInvalid()) {
		document.getElementById("pwMsg").innerText = "password doesn't match"
		disableSubmit();
		return false;
	};
};

const deleteElement = () => event.target.parentNode.remove();

const editElement = function () {
	let textToEdit = event.target.parentNode.innerText;
	let inputBox = document.getElementById('myInput');
	inputBox.value = textToEdit;
	inputBox.focus();
	event.target.parentNode.remove();
};

const createDeleteOption = function () {
	let deleteItem = document.createElement("i");
	deleteItem.className = "fas fa-eraser";
	deleteItem.style.color = "red";
	deleteItem.style.float = "right";
	deleteItem.onclick = deleteElement;
	return deleteItem;
};

const createEditOption = function () {
	let editOption = document.createElement("i");
	editOption.className = "fas fa-edit";
	editOption.style.color = "blue";
	editOption.style.float = "right";
	editOption.style.paddingLeft = "20px";
	editOption.onclick = editElement;
	return editOption;
};

const createItemsDiv = function () {
	let itemDiv = document.createElement("div");
	itemDiv.style.width = "70%";
	itemDiv.style.fontSize = "25px";
	itemDiv.style.margin = 'auto';
	itemDiv.style.padding = '5px';
	itemDiv.appendChild(createEditOption());
	itemDiv.appendChild(createDeleteOption());
	return itemDiv;
};

const createListItem = function () {
	let item = document.createElement("li");
	item.innerText = document.getElementById("myInput").value;
	item.style.width = "85%";
	item.style.textAlign = "justify";
	item.onclick = changeStatus;
	return item;
};

const addItems = function () {
	let itemsList = document.getElementById("myLI");
	let itemDiv = createItemsDiv();
	itemDiv.appendChild(createListItem());
	itemsList.appendChild(itemDiv);
	document.getElementById('myInput').value = '';
};

const statusDone = function (item) {
	return item.style.textDecoration == "line-through";
};

const setStatus = function (item, status) {
	item.style.textDecoration = status;
};

const changeStatus = function () {
	if (statusDone(event.target)) {
		return setStatus(event.target, "none");
	};
	setStatus(event.target, "line-through");
};

const deleteList = function () {
	const listHolder = event.target.parentNode.parentNode;
	const listName = listHolder.firstChild.nextSibling.innerText;
	fetch('/deleteList', {
		method: 'POST',
		body: `title=${listName}`
	});
	listHolder.remove();
}


const saveList = function () {
	const title = document.getElementById("title").innerText;
	let items = new Array;
	const listItems = document.getElementsByTagName('li');
	for (let pos = 0; pos < listItems.length; pos++) {
		let status = "pending";
		if (statusDone(listItems[pos])) status = "done";
		let item = listItems[pos].innerText;
		items.push({ item, status });
	};
	fetch('/updateList', {
		method: 'POST',
		body: `title=${title}&listItems=${JSON.stringify(items)}`
	});
};