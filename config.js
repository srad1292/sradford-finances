
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    DB_PATH : process.env.DB_PATH || '',
    HOST : process.env.HOST || 'localhost',
    PORT : process.env.PORT || '3001',
}