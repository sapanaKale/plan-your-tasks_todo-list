const http = require('http');
const { requestHandler } = require('./src/app.js');

const PORT = process.env.PORT || 8090;

let server = http.createServer(requestHandler);
server.listen(PORT, () => console.log('listening on ', PORT));