const dotenv = require('dotenv');
const express = require('express');
const methodoverride = require('method-override');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/indexRoutes');
const authorRouter = require('./routes/authorsRoutes');
const bookRouter = require('./routes/bookRoutes');

dotenv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(methodoverride('_method'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('mongo connected successfully ...'));

app.listen(process.env.PORT || 3000);
