const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const blogRoutes = require('./routes/blogRoutes');
const connectDB = require('./config/db'); // Import the DB connection
const userRoutes =require('./routes/userRoutes')
const commentRoutes =require('./routes/commentRoutes')


const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;

// Connect to your database
connectDB(); // Call the connectDB function

const app = express();

app.use(cors({
    origin: 'https://blog-frontend-azure-five.vercel.app', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow credentials
  }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

app.get('/', (req, res) => {
  res.send('API is running....');
});

// Use blog routes
app.use('/api', blogRoutes);  
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes );  

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);


















// const path = require('path');
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const blogRoutes = require('../routes/blogRoutes'); // Adjust the path
// const userRoutes = require('../routes/userRoutes'); // Adjust the path
// const commentRoutes = require('../routes/commentRoutes'); // Adjust the path
// const connectDB = require('../config/db'); // Adjust the path
// const serverless = require('serverless-http');

// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();

// // Connect to your database
// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// app.get('/', (req, res) => {
//   res.send('API is running....');
// });

// // Use routes
// app.use('/api', blogRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api', commentRoutes);

// module.exports = app; // Export the app
// module.exports.handler = serverless(app); // Export the serverless handler
