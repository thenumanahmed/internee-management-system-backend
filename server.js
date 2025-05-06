const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const progressRoutes = require('./routes/progressRoutes')
const techStackRoutes = require('./routes/techStackRoutes')
const moduleRoutes = require('./routes/moduleRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(fileUpload({
    useTempFiles: true, // This saves the file temporarily to disk
    tempFileDir: '/tmp/'
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/module', moduleRoutes);

// unknown route handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));