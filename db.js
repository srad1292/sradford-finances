const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let db;
let DB_PATH = '';

async function initDb(path = '') {
    if(db === undefined) { 
        DB_PATH = DB_PATH === '' ? path : '';
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.cached.Database
        });
    }
}

async function getDb() {
    console.log("In get db");
    if(db == undefined) {
        // console.log("Need to initialize db");
        await initDb();
    }
    return db;
}

module.exports = {initDb, getDb};
