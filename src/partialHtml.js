const generateToDoListHtml = function (titleList) {
	const listHtml = titleList.map(title =>
		`<div>
		<a href="/todo/${title}" style="text-decoration:none;"><i class="far fa-hand-point-right"></i>
		${title}</a>
		<i onclick="deleteList()" class="fas fa-trash"></i>
		</div>`
	);
	return listHtml.join('');
};

const getEditOption = function () {
	return `<i style="color: blue; float: right; padding-left: 20px;" onclick="editElement()" class="fas fa-edit"></i>`
};

const getDeleteOption = function () {
	return `<i style="color: red; float: right;" onclick="deleteElement()" class="fas fa-eraser"></i>`;
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