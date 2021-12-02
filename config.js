const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();


const{
    PORT,
    HOST,
    HOST_URL,
    DATABASE_URL,
    TEST_DATABASE_URL

} = process.env;

assert(PORT, 'PORT is required');

module.exports = {

    port: PORT,
    host: HOST,
    url: HOST_URL,
    database_url: DATABASE_URL,
    test_database_url: TEST_DATABASE_URL
    
}