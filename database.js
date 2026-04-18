const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
    //database: process.env.DB_NAME
})
async function validshema() {
    try {
        await db.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME);
        await db.changeUser({ database: process.env.DB_NAME });
    } catch (error) {
        console.log(error)
    }
}
async function validtable(tablename) {
    try {
        const tableisexist = await db.query(`SELECT 1
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = ?
AND TABLE_NAME = ?`, [process.env.DB_NAME, tablename]);
        if (tableisexist == null && tablename == 'notes') {
            await db.query(`CREATE TABLE 'notes'(
    'note_id' INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    'title' VARCHAR(255) NOT NULL,
    'conten' VARCHAR(255) NOT NULL,
    'user_id' BIGINT NOT NULL)`);
            await db.query(`ALTER TABLE
    'notes' ADD UNIQUE 'notes_user_id_unique'('user_id');`)
        } else if (tableisexist == null && tablename == 'users') {
            await db.query(`CREATE TABLE 'users'(
    'id' INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    'username' VARCHAR(255) NOT NULL,
    'email' VARCHAR(255) NOT NULL,
    'password' VARCHAR(255) NOT NULL,
    'admin' BOOLEAN NOT NULL)`)
            await db.query(`ALTER TABLE
    'users' ADD UNIQUE 'users_username_unique'('username')`)
            await db.query(`ALTER TABLE
    'users' ADD UNIQUE 'users_email_unique'('email')`)
            await db.query(`ALTER TABLE
    'notes' ADD CONSTRAINT 'notes_user_id_foreign' FOREIGN KEY('user_id') REFERENCES 'users'('id');`)
        }
    } catch (error) {
        console.log(error)
    }
}

function validdb() {
    console.log('start database validation')
    validshema();
    validtable('notes');
    validtable('users');
    console.log('done')
}

module.exports = { validdb, db }