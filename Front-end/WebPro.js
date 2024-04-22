const express = require('express');
const path = require('path')
const app = express();
const dotenv = require("dotenv")
const cors = require('cors'); //(Cross-Origin Resource Sharing)

const port = 3030

dotenv.config();
app.use(express.static(path.join(__dirname, '/public')));
app.use('/image', express.static(path.join(__dirname, '/image')));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/js')));
// app.use('/images', express.static(path.join(__dirname, '/images')));
// app.use('/reference', express.static(path.join(__dirname, '/reference')));

/* 1. Create a router object and register the router */
app.use(cors());

const router = express.Router();
app.use(router)

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// async function fetchData() {
//     try {
//         const response = await fetch('http://localhost:3040/restaurants');
//         const data = await response.json();
//         // console.log('Data received:', data);
//         test = data;
//         return data;
//         // Use the fetched data here
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         // Handle the error here
//     }
// const response = await fetch(`http://localhost:3040/test`);
// const data = await response.json(); // Change to .text() if data is plain text
// }
/* Login and sign in*/
router.get('/login', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/login.html`))
})

router.get('/Login-Error', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/LoginError.html`))
})

router.get('/Admin_management', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/Admin_Management_For_Admin.html`))
})



router.get('/modify_admin/:id', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/modify_admin.html`))
})

router.get('/restaurant_management', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/Restaurnt_Management_For_Admin.html`))
})

// router.get('/sign-up', (req, res) => {
//     res.status(200)
//     res.sendFile(path.join(`${__dirname}/sign-in.html`))
// })

router.get('/forget-password', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/ForgetPassword.html`))
})


/* 2. Add routes */
/* -------------------- Home page -------------------- */
router.get('/', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a search page')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/index.html'))
})

/* -------------------- Toppick page -------------------- */
router.get('/Toppick', (req, res) => {
    console.log('Requested at', req.url)
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/TopPick.html'))
})

/* -------------------- Close to you' page -------------------- */
router.get('/Close-to-you', (req, res) => {
    console.log('Requested at', req.url)
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/CLoseToYou.html'))
})

/* -------------------- Category page -------------------- */
router.get('/Category', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/Category.html'))
})

/* -------------------- About page -------------------- */
router.get('/About', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/About.html'))
})
/* -------------------- Restaurant pages -------------------- */
router.get('/:name/Profile', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/RestaurantProfile.html'))
})
router.get('/:name/schedule', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '/html/RestaurantSchedule.html'))
})
/* -------------------- Search page -------------------- */
router.get('/search', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/SearchResult.html`))
})

router.get('/adv-search', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/Adv_Search.html`))
})

router.get('/:name', (req, res) => {
    console.log(req.params.name)
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/RestaurantDetailPage.html`))
})

router.get('/:name/reservation', (req, res) => {
    console.log(req.params.name)
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/Reservationpage.html`))
})
router.get('/:name/reserve-success', (req, res) => {
    console.log(req.params.name)
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/ReservationSuccessfulPage.html`))
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