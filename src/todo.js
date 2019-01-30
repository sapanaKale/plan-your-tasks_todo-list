const { todoEditor } = require('./constants');
const { generateListItemsHtml } = require('./partialHtml');
const { replaceContent } = require('./dataUtil');

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

module.exports = Todo;