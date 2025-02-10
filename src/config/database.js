const mysql = require("mysql2/promise");

async function connectDB() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root"
    });

    try {
        await connection.query("CREATE DATABASE IF NOT EXISTS IRCTC");

        await connection.changeUser({ database: "IRCTC" });

        

        await connection.query(`
            CREATE TABLE IF NOT EXISTS USERS (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                emailId VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ADMINS (
                adminId INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                emailId VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS TRAINS (
                trainId INT PRIMARY KEY,
                source VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                seats INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS BOOKINGS (
                bookingId INT AUTO_INCREMENT PRIMARY KEY,
                trainId INT NOT NULL,
                source VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                seats INT NOT NULL,
                userId INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trainId) REFERENCES TRAINS(trainId) ON DELETE CASCADE,
                FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE
            );
        `);


    } catch (err) {
        console.error("Error initializing database:", err);
        throw err;
    } finally {
        await connection.end();
    }
}


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "IRCTC",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { connectDB, pool };
