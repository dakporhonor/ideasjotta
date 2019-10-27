const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const mongoose = require('mongoose');


// Init Express
const app = express();

// Load Routes
const ideas = require("./routes/ideas");
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport)
 
// DB Config
const db = require('./config/database')


mongoose.Promise = global.Promise

// Connect Mongoose
mongoose.connect(db.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`MongoDB connected from ${db.mongoURL}`))
.catch(err => console.log(err))

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());
// use path middleware
app.use(express.static(path.join(__dirname, 'public')))
// Method Override middleware
app.use(methodOverride('_method'));

// Express Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  // Global variables
  app.use(function(req, res, next) {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     res.locals.user = req.user || null
    next()
  })

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  })

})

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})

// Contact Route
app.get('/contact', (req, res) => {
  res.render('contact')
})


// Use routes
app.use('/ideas', ideas) 
app.use('/users', users)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));