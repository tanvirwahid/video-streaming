const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./app/config/keys');

const frontendController = require('./app/controllers/frontendController');

mongoose.connect(keys.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static('public'));
const cors = require('cors');


app.use(cors());

app.get('/video/upload', frontendController.upload);
app.get('/', frontendController.play);
app.get('/login', frontendController.login);
app.get('/register', frontendController.register);

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Listening to port :${port}`);
});