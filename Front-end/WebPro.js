const express = require('express');
const path = require('path')
const port = 3030
const app = express();

app.use(express.static(path.join(__dirname, '../Front-end',  'public')));
app.use('/image', express.static(path.join(__dirname, '../Front-end',  'image')));
app.use('/css', express.static(path.join(__dirname, '../Front-end',  'css')));
app.use('/js', express.static(path.join(__dirname, '../Front-end', 'js')));
app.use('/images', express.static(path.join(__dirname, '../Front-end',  'images')));
app.use('/reference', express.static(path.join(__dirname, '../Front-end',  'reference')));

/* 1. Create a router object and register the router */
const router = express.Router();
app.use(router)

// app.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

/* 2. A/dd routes */
router.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'login.html'))
})

/* -------------------- Home page -------------------- */
router.get('/home', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a search page')
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'index.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Toppick page -------------------- */
router.get('/Toppick', (req, res) => {
    console.log('Requested at', req.url)
    // console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'TopPick.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Close to you' page -------------------- */
router.get('/Close-to-you', (req, res) => {
    console.log('Requested at', req.url)
    // console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'CLoseToYou.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- Category page -------------------- */
router.get('/Category', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'Category.html'))
    // console.log(`Server listening on port: ${port}`)
})

/* -------------------- About page -------------------- */
router.get('/About', (req, res) => {
    console.log('Requested at', req.url)
    console.log('Retrieve a form')
    res.status(200)
    res.sendFile(path.join(__dirname, '../Front-end', 'About.html'))
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
router.use((req, res, next) => {
    console.log(req.url)
    console.log(__dirname)
    console.log('404: Invalid accessed!!!!!')
    res.status(404)
    res.sendFile(path.join(`${__dirname}/reference/error.html`));
})
app.listen(port, () => {
})