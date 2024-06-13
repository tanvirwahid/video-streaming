const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require('./routes/index');
app.use(bodyParser.json());
app.use(express.static('public'));
const cors = require('cors');

app.use(cors());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Listening to port :${port}`);
});