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

router.get('/Admin_management', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/Admin_Management_For_Admin.html`))
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

/* -------------------- Search page -------------------- */
router.get('/search', (req, res) => {
    res.status(200)
    res.sendFile(path.join(`${__dirname}/html/SearchResult.html`))
})

router.post('/sign-in-summit', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Form submitted by')
    console.log(req.body.email, 'at')
    console.log(Date.now())
    res.status(200)
    res.redirect(path.join(`/home`))

})
// router.get('/member', (req, res) => {
//     console.log('Requested at', req.url)
//     res.status(200)
//     res.sendFile(path.join(`${__dirname}/success.html`))
//     // console.log(`Server listening on port: ${port}`)
// })
router.post('/search-summit', (req, res) => {
    console.log(req.body.searchdropdown)
    searchword = req.body.searchdropdown
    res.redirect(path.join(`/search`));
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