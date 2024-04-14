const express = require('express');
const path = require('path')
const app = express();
const dotenv = require("dotenv")
const cors = require('cors'); //(Cross-Origin Resource Sharing)

const port = 3040

dotenv.config();
app.use(express.static(path.join(__dirname, '../Front-end',  'public')));
app.use('/image', express.static(path.join(__dirname, '../Front-end',  'image')));
app.use('/css', express.static(path.join(__dirname, '../Front-end',  'css')));
app.use('/js', express.static(path.join(__dirname, '../Front-end', 'js')));
app.use('/images', express.static(path.join(__dirname, '../Front-end',  'images')));
app.use('/reference', express.static(path.join(__dirname, '../Front-end',  'reference')));

app.use(cors());

let searchword = "";

/*------------------------ Connect to database ------------------------*/
const mysql = require('mysql2');
var connection = mysql.createConnection
    ({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

const router = express.Router();
app.use(router)

// app.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({ extended: true }))


/*------------------------ API Link database ------------------------*/

router.get('/api/toppicks', (req, res) => {
    let sql = `SELECT Restaurant_name, Province, Restaurant_image
               FROM Account_Restaurant
               ORDER BY Reserve_count DESC`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get('/api/Category', (req, res) => {
    let sql = `SELECT *
               FROM Restaurant_Category
               ORDER BY Category`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get('/api/search', (req, res) => {
    let sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${searchword}%";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
})




router.use((req, res, next) => {
    console.log(req.url)
    console.log(__dirname)
    console.log('404: Invalid accessed!!!!!')
    res.status(404)
    res.sendFile(path.join(`${__dirname}/reference/error.html`));
})

app.listen(port, () => {
})