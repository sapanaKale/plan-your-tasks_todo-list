const chai = require('chai');
const request = require('supertest');
const express = require('express');

const app = express();
const {
	logRequest,
	readArgs,
	readBody,
	renderLogin,
	renderUserHomePage,
	renderUsersName,
	renderHomePage,
	signUp
} = require('../../src/app');

describe('readArgs', function () {
	it('should parse the given data in object form', function () {
		let data = "name=abc&age=20";
		let actual = readArgs(data);
		let expected = { name: "abc", age: '20' };
		chai.assert.deepEqual(actual, expected);
	});
});

app.use(readBody);
app.use(logRequest);
app.get('/', renderHomePage);
app.get('/usersName', renderUsersName);
app.post('/signUp', signUp);
app.get('/loginPage.html', renderLogin);
app.post('/login', renderUserHomePage);

describe('GET /usersName', function () {
	it('responds with array of names', function (done) {
		request(app)
			.get('/usersName')
			.expect(200, done);
	});
});

describe('GET /loginPage.html', function () {
	it('responds with loginpage', function (done) {
		request(app)
			.get('/loginPage.html')
			.expect(200, done);
	});
});

describe('GET /', function () {
	it('responds with homepage', function (done) {
		request(app)
			.get('/')
			.expect(200, done);
	});
});

describe('POST /signUp', function () {
	it('responds with loginpage html', function (done) {
		request(app)
			.post('/signUp')
			.send('username=sapana&email=123&password=abc')
			.expect(200, done)
	});
});

describe('POST /login', function () {
	it('responds with loginpage html', function (done) {
		request(app)
			.post('/login')
			.send('username=sapana&password=abc')
			.expect(200, done)
	});
});