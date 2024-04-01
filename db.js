const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST || 'viaduct.proxy.rlwy.net',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'dXSsVqFaBDFdKIYIqZVCEXfCwdegGjnH',
    database: process.env.DB_DATABASE || 'railway',
    port: process.env.DB_PORT || 36247
});

console.log(process.env.DB_PORT);

module.exports = db;
