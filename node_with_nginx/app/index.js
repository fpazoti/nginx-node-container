const express = require("express")
const mysql = require('mysql2')
var crypto = require("crypto");

const app = express();
const port = 3000
const db_config = {
    host: 'mysql_db',
    user: 'root',
    password: 'root',
    database: 'nodedb',
    multipleStatements: true
}

function getName(callback) {
    const connection = mysql.createConnection(db_config)

    const id = crypto.randomBytes(20).toString('hex');
    const sqlCommand = `
        create table if not exists people (id int primary key auto_increment, name varchar(255));
        INSERT INTO people(name) VALUES (?);
        SELECT name FROM people LIMIT 1;
    `

    connection.query(sqlCommand, [id], (err, result) => {
        if (err) {
            callback(err, null)
        }
        else {
            callback(null, result[2][0].name)
        }
    });
}

app.get('/', (req, res) => {

    var randomValue;
    getName(function (err, content) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            randomValue = content;
            console.log(randomValue);
            res.send(
                `<h1>Full Cycle Rocks!</h1>
                <ul><li>${randomValue}</li></ul>
                `)
        }
    });
})

app.listen(port, () => console.log('Node is running'))