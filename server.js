const app = require('./src/app.js');
const PORT = process.env.PORT || 8090;

app.listen(PORT, () => console.log('listening on ', PORT));