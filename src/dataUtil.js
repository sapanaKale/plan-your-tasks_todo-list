const fs = require('fs');

const getContent = path => fs.readFileSync(path, 'utf8');

const replaceContent = function (page, replaceTo, replaceWith) {
	return page.replace(replaceTo, replaceWith);
};

const updateData = function (path, content) {
	fs.writeFile(path, content, () => { });
};

const updateUserDetails = updateData.bind(null, './private/usersDetails.json');
const updateUserData = updateData.bind(null, './private/usersData.json');

const initialize = function (path) {
	if (fs.existsSync(path)) {
		return JSON.parse(getContent(path));
	};
	fs.mkdirSync('private');
	fs.writeFileSync(path, JSON.stringify(new Object));
	return JSON.parse(getContent(path));
};

const initializeUsersDetails = initialize.bind(null, './private/usersDetails.json');
const initializeUsersData = initialize.bind(null, './private/usersData.json');

module.exports = {
	getContent,
	replaceContent,
	updateUserData,
	updateUserDetails,
	initializeUsersData,
	initializeUsersDetails
};