const dotenv = require('dotenv');
const express = require('express');
const methodoverride = require('method-override');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const indexRouter = require('./routes/indexRoutes');
const authorRouter = require('./routes/authorsRoutes');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');

dotenv.config({ path: './.env' });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(methodoverride('_method'));
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(compression());

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/api/user', userRouter);
app.use('/user', viewRoutes);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('mongo connected successfully ...'));

app.use(globalErrorHandler);
app.listen(process.env.PORT || 3000);
