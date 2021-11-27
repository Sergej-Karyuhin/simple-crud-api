const app = require('./src/app');
const PORT = process.env.PORT || 8080;
console.log(`Server listening on port ${PORT}`);
app.listen(PORT);
