const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
const app = require('./app.js')

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
const mongoose = require('mongoose')
const DB = process.env.DATABASE
mongoose.connect(DB).then(() => {
    console.log('Connected to MongoDB')
})

port = 8000 || process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
    process.exit(1);
    });
});