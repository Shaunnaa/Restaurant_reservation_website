const express = require('express');
const path = require('path')
const app = express();
const dotenv = require("dotenv")

const port = 3030

dotenv.config();
app.use(express.static(path.join(__dirname, '/public')));
app.use('/image', express.static(path.join(__dirname, '/image')));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/reference', express.static(path.join(__dirname, '/reference')));

/* 1. Create a router object and register the router */
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

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

/* Login and sign in*/
router.get('/login', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/login.html`))
})

router.get('/Login-Error', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/LoginError.html`))
})

// router.get('/sign-up', (req, res) => {
//     res.status(200)
//     res.sendFile(path.join(`${__dirname}/sign-in.html`))
// })

router.get('/forget-password', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/ForgetPassword.html`))
})

router.post('/sign-in-summit', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Form submitted by')
    console.log(req.body.email, 'at')
    let sql = `select Email from Account where Email = "${req.body.email}" and Passwords = "${req.body.password}";`
    connection.query(sql, function (error, results) {
        if (error) throw error;
        else if (results.length == 0) {
            return res.redirect(path.join(`/Login-Error`));
        }
        else {
            console.log(req.body.email)
            return res.redirect(path.join(`/`));
        };
    })
})

/* 2. Add routes */
/* -------------------- Home page -------------------- */
router.get('/', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a search page')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/index.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Toppick page -------------------- */
router.get('/Toppick', (req, res) => {
    console.log('Requested at', req.url)
    // console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/TopPick.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Close to you' page -------------------- */
router.get('/Close-to-you', (req, res) => {
    console.log('Requested at', req.url)
    // console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/CLoseToYou.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Category page -------------------- */
router.get('/Category', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/Category.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- About page -------------------- */
router.get('/About', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/About.html'))
    // console.log(`Server listening on port: ${port}`)
})

router.post('/sign-in-summit', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Form submitted by')
    console.log(req.body.email, 'at')
    // console.log(req.body.email, 'at')
    console.log(Date.now())
    res.status(200)
    res.redirect(path.join(`/home`))
    // console.log(`Server listening on port: ${port}`)
})
// router.get('/member', (req, res) => {
//     console.log('Requested at', req.url)
//     res.status(200)
//     res.sendFile(path.join(`${__dirname}/success.html`))
//     // console.log(`Server listening on port: ${port}`)
// })







// Example API endpoint to fetch data from the database
router.get('/api/toppicks', (req, res) => {
    let sql = `SELECT Restaurant_name, Province
               FROM Account_R
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






router.use((req, res, next) => {
    console.log(req.url)
    console.log(__dirname)
    console.log('404: Invalid accessed!!!!!')
    res.status(404)
    res.sendFile(path.join(`${__dirname}/reference/error.html`));
})
app.listen(port, () => {
})