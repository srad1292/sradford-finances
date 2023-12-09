const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let db;
const isTest = true;

async function initDb() {
    if(db === undefined) { 
        let fileName = isTest ? "./database/test/finances.db" : "./database/prod/finances.db";
        db = await open({
            filename: fileName,
            driver: sqlite3.cached.Database
        });
    }
}

async function getDb() {
    // console.log("In get db");
    if(db == undefined) {
        // console.log("Need to initialize db");
        await initDb();
    }
    return db;
}

module.exports = {initDb, getDb};
