const chai = require('chai');
const request = require('supertest');

const app = require('../../src/app.js');

const { readArgs } = require('../../src/serverUtil')

describe('readArgs', function () {
	it('should parse the given data in object form', function () {
		let data = "name=abc&age=20";
		let actual = readArgs(data);
		let expected = { name: "abc", age: '20' };
		chai.assert.deepEqual(actual, expected);
	});
});

describe('GET /login.html', function () {
	it('responds with loginpage', function (done) {
		request(app)
			.get('/login.html')
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