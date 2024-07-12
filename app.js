const express = require("express");
const mysql = require('mysql2');
const port = 3000;
const app = express();

app.use(express.json()); 

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "chatbottests", 
    password: "",
    charset: "UTF8_GENERAL_CI"
});

connection.connect(function(err) {
    if (err) {
        return console.error("Error: " + err.message);
    } else {
        console.log("Подключение установлено");
    }
});

app.get('/getAllItems', (req, res) => {
    connection.query('SELECT * FROM Items', (err, results) => { 
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/addItem', (req, res) => {
    const { name, desc } = req.body; 
    if (!name || !desc) {
        return res.json(null); 
    }
    const query = 'INSERT INTO Items (name, `desc`) VALUES (?, ?)'; 
    connection.query(query, [name, desc], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: results.insertId, name, desc });
    });
});

app.post('/deleteItem', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json(null); 
    }
    const query = 'DELETE FROM Items WHERE id = ?'; 
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.affectedRows === 0) {
            return res.json({}); 
        }
        res.json({ message: `Item with ID ${id} deleted` });
    });
});

app.post('/updateItem', (req, res) => {
    const { id, name, desc } = req.body;
    if (!id || !name || !desc) {
        return res.json(null); 
    }
    const query = 'UPDATE Items SET name = ?, `desc` = ? WHERE id = ?'; 
    connection.query(query, [name, desc, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.affectedRows === 0) {
            return res.json({}); 
        }
        res.json({ id, name, desc });
    });
});

app.listen(port, () => {
    console.log(`Сервер начал прослушивание запросов на http://localhost:${port}`);
});
