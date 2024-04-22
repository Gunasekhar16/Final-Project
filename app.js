const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const booksRoutes = require('./routes/books.js');
const path = require('path');
const bodyParser = require('body-parser');
const session= require('express-session')
// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family:4
});

const app = express();
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: false
  }));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// Routes
// app.use('/auth', authRoutes);
app.use("/", require("./routes/auth.js"));
app.use('/books-list',  require("./routes/books.js"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
