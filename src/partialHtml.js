const generateToDoListHtml = function (titleList) {
	const listHtml = titleList.map(title =>
		`<div>
		<a href="/todo/${title}" style="text-decoration:none;">${title}</a>
		<button onclick="deleteList()"> delete </button>
		</div>`
	);
	return listHtml.join('');
};

const getEditOption = function () {
	return `<span style="color: blue; float: right; padding-left: 20px;" onclick="editElement()">edit</span>`
};

const getDeleteOption = function () {
	return `<span style="color: red; float: right;" onclick="deleteElement()"> x </span>`;
};

const getItemStyle = function (itemsList, item) {
	let itemStyle = `style = "text-decoration: none"`;
	const listItem = itemsList.filter(x => x.item == item);
	if (listItem[0].status == "done") {
		itemStyle = `style = "text-decoration: line-through"`;
	};
	return itemStyle;
};

const generateListItemsHtml = function (listItems) {
	const divStyle = `style="width: 50%; font-size: 30px;"`;
	const items = listItems.map(x => x.item);
	const listItemsHTML = items.map(item => {
		const itemStyle = getItemStyle(listItems, item);
		return `<div ${divStyle}>
		${getEditOption()} ${getDeleteOption()} 
		<li onclick="changeStatus()" ${itemStyle}>${item}</li>
		</div>`
	});
	return listItemsHTML.join('');
};

module.exports = {
	generateListItemsHtml,
	generateToDoListHtml
};