const generateToDoListHtml = function (listData) {
	const listHtml = listData.map(
		list => {
			return `<div class="todo">
		<div class="todo-title-date">
		<div style="margin: 1% 1%; font-size: 20px;">${list.title}</div>
		<div style="margin-right: 1%">${new Date(list.date).toLocaleString()}</div>
        </div>
       <div style="margin: 0 5%">
          <div>${list.description.slice(0, 35) + "..."}</div>
          <div> <i class="far fa-hand-point-right"></i> ${list.pending} pending</div>
          <div> <i class="far fa-hand-point-right"></i> ${list.done} done</div>
        </div>
        <div class="todo-button">
        <i onclick="deleteList()" class="fas fa-trash" style="cursor: pointer; margin: 0 3%"></i>
          <a href="/todo/${list.title}"> <i style="color: rgb(16, 148, 165);" class="fas fa-edit"></i> </a>
        </div>
      </div>`
		});
	return listHtml.join("");
};

const getEditOption = function () {
	return `<i style="color: rgb(16, 148, 165); float: right; padding-left: 20px;" onclick="editElement()" class="fas fa-edit"></i>`
};

const getDeleteOption = function () {
	return `<i style="color: rgb(168, 85, 85); float: right;" onclick="deleteElement()" class="fas fa-eraser"></i>`;
};

const getItemStyle = function (itemsList, item) {
	let itemStyle = `style = "text-decoration: none; width: 85%; text-align: justify"`;
	const listItem = itemsList.filter(x => x.item == item);
	if (listItem[0].status == "done") {
		itemStyle = `style = "text-decoration: line-through; width: 85%; text-align: justify"`;
	};
	return itemStyle;
};

const generateListItemsHtml = function (listItems) {
	const divStyle = `style="width: 70%; font-size: 25px; margin: auto; padding: 5px;"`;
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