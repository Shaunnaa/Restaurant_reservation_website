const express = require('express');
const path = require('path')
const app = express();
const dotenv = require("dotenv")
const cors = require('cors'); //(Cross-Origin Resource Sharing)
const googleMapsClient = require('@google/maps').createClient({ key: process.env.GOOGLE_MAPS_API_KEY });

const port = 3040

dotenv.config();
app.use(express.static(path.join(__dirname, '../Front-end', 'public')));
app.use('/image', express.static(path.join(__dirname, '../Front-end', 'image')));
app.use('/css', express.static(path.join(__dirname, '../Front-end', 'css')));
app.use('/js', express.static(path.join(__dirname, '../Front-end', 'js')));
app.use('/images', express.static(path.join(__dirname, '../Front-end', 'images')));
app.use('/reference', express.static(path.join(__dirname, '../Front-end', 'reference')));

app.use(cors());
let status = 0; //status 0 = log out status 1 = loged in
let searchword = "";
let RestaurantList = []
let restuarantdetail = ""
let Adv = ["", "", "", ""]
let province = '"'
let currentAdmin = ""
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

// Initialize restaurantList
let sql = `select Restaurant_name from Account_Restaurant;`;
connection.query(sql, function (error, results) {
    if (error) {
        console.error('Error fetching data:', error);
        console.log("Error!!!!!!")
        res.status(500).json({ error: 'Error fetching data' });
    } else {

        for (let i = 0; i < results.length; i++) {
            let str = results[i].Restaurant_name;
            let newStr = str.replace(/\s+/g, '_');
            RestaurantList.push(newStr);
        }
    }
});

// app.use(express.static('public'))
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Add_admin.html');
});


/*------------------------ API Link database ------------------------*/

/* -------------------- Toppick -------------------- */
router.get('/api/toppicks', (req, res) => {
    let sql = `SELECT Restaurant_name, Province, Restaurant_image
               FROM Account_Restaurant
               ORDER BY Reserve_count DESC`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error from Toppick');
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
        }
    });
});

/* -------------------- Category -------------------- */
router.get('/api/Category', (req, res) => {
    let sql = `SELECT *
               FROM Restaurant_Category
               ORDER BY Category`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error from Category');
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
        }
    });
});

/* -------------------- search -------------------- */
router.get('/api/search', (req, res) => {
    let sql = `SELECT Restaurant_name, Restaurant_image,Province 
               FROM Account_Restaurant 
               WHERE Restaurant_name like "%${searchword}%";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error from search');
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
})

router.post('/search-summit', (req, res) => {
    console.log(req.body.searchdropdown)
    searchword = req.body.searchdropdown
    res.redirect(`http://localhost:3030/search`);
})
router.get('/place/:province', (req, res) => {
    // console.log(req.params.province)
    // searchword = req.body.searchdropdown
    province = req.params.province
    console.log(province)
    res.redirect(`http://localhost:3030/Close-to-you`);
})

/* -------------------- adv search -------------------- */
router.get('/api/adv-search', (req, res) => {
    let sql = `SELECT Restaurant_name, Restaurant_image, Province 
               FROM Account_Restaurant`;

    // Initialize an array to hold conditions
    const conditions = [];

     // Add conditions based on non-empty Adv array elements
    if (Adv[0]) { //non-empty string , non-zero number, non-null, non-undefined value, non-empty object or array.
        conditions.push(`Category = "${Adv[0]}"`);
    }
    if (Adv[1]) {
        conditions.push(`Restaurant_name LIKE "%${Adv[1]}%"`);
    }
    if (Adv[2]) {
        conditions.push(`Province = "${Adv[2]}"`);
    }
    if (Adv[3]) {
        conditions.push(`Time = "${Adv[3]}"`);
    }

    // If there are conditions, join them with AND and add them to the SQL query
    if (conditions.length > 0) {
        sql = sql + ` WHERE ${conditions.join(' AND ')}`;
    }

    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error from search');
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
})
/* -------------------- summit zone -------------------- */
router.post('/adv-search-summit', (req, res) => {
    // console.log(req.body.first_name)
    Adv[0] = req.body.Category
    Adv[1] = req.body.RestaurantName
    Adv[2] = req.body.Location
    Adv[3] = req.body.datetime
    console.log(Adv)
    // res.redirect(path.join(`http://localhost:3030/adv-search`));
    res.redirect(`http://localhost:3030/adv-search`);
})

router.post('/sign-in-summit', (req, res) => {
    let sql = `select * from Account where Email = "${req.body.email}" AND Passwords = "${req.body.password}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error from signin');
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        }
        else {
            // console.log(results)
            // console.log(results[0].ID)
            if (results.length > 0) {
                status = 1
                if (results[0].ID >= 1000 && results[0].ID < 2000)
                    res.redirect(`http://localhost:3030`);
                else if (results[0].ID >= 9000 && results[0].ID < 10000) {
                    let sql2 = `select Restaurant_name from Account_Restaurant where RID = "${results[0].ID}";`;
                    connection.query(sql2, function (error, result2) {
                        if (error) {
                            res.status(500).json({ error: 'Error fetching data' });
                        }
                        else {
                            console.log("Complete!!!!!!")
                            restuarantdetail = result2[0].Restaurant_name
                            console.log(restuarantdetail)
                            res.redirect(`http://localhost:3030/${result2[0].Restaurant_name.split(' ').join('_')}/Profile`);
                        }
                    })
                }
            }
            else {
                res.redirect(`http://localhost:3030/Login-Error`);
            }
            console.log("Complete!!!!!!")
        }
    });
})
router.post('/:name/reserve-summit', (req, res) => {
    console.log()
    res.redirect(`http://localhost:3030/${restuarantdetail.split(' ').join('_')}/reserve-success`);
})
/* -------------------- detail -------------------- */
router.get('/api/detail', (req, res) => {
    // console.log(data)
    // console.log("check")
    let sql = `select Restaurant_image,Restaurant_name,Descriptions, Province, District, Subdistrict from Account_Restaurant where Restaurant_name = "${restuarantdetail}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            console.log(results)
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
});

router.get('/reservation-status', (req, res) => {
    if (status == 1) {
        res.redirect(`http://localhost:3030/${restuarantdetail.split(' ').join('_')}/reservation`);
    }
    else {
        res.redirect(`http://localhost:3030/login`);
    }
    res.status(200).json(RestaurantList);
});

router.post('/adv-search-summit', (req, res) => {
    // console.log(req.body.first_name)
    Adv[0] = req.body.last_name
    Adv[1] = req.body.company
    Adv[2] = req.body.datetime
    console.log(Adv)

    res.redirect(`http://localhost:3030/adv-search`);
})


router.get('/restaurants', (req, res) => {
    res.status(200).json(RestaurantList);
})


/*------------------------ API location ------------------------*/

// Endpoint to handle the request
router.get('/api/closetoyou', (req, res) => {
    // router.get('/api/toppicks', (req, res) => {
        let sql = `SELECT Restaurant_name, Province, Restaurant_image
                   FROM Account_Restaurant
                   WHERE Province = "${province}"`;
        connection.query(sql, function (error, results) {
            if (error) {
                console.error('Error from Toppick');
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Error fetching data' });
            } else {
                console.log(results)
                res.status(200).json(results);
            }
        });
    // });

});



router.get('/status-check', (req, res) => {
    res.status(200).json(status)
});

router.get('/admin-accounts', (req, res) => {
    const sql = 'SELECT Account_Admin.AID, Account_Admin.username ,Account.Email, Account.Passwords FROM Account JOIN Account_Admin ON Account.ID = Account_Admin.AID;';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching admin accounts:', err);
            res.status(500).json({ error: 'Error fetching admin accounts' });
            return;
        }
        else {
            res.json(results);
        }
    });
});

router.get('/modify-admin/:id', (req, res) => {
    currentAdmin = req.params.id
    res.redirect(`http://localhost:3030/modify_admin/${currentAdmin}`)
});

router.get('/Apo/modify-admin', (req, res) => {
    // console.log(currentAdmin)
    res.status(200).json(currentAdmin)
});

router.put('/modify-admin', (req, res) => {
    const { fname, lname, mname, username, DOB, Email, Phone_num, Passwords } = req.body;
    console.log(fname, lname, mname, username, DOB, Email, Phone_num, Passwords)
    // console.log(lname)
    if (!fname && !lname && !mname && !username && !DOB && !Email && !Phone_num && !Passwords) {
        console.log("No input from the user");
    } else {
        console.log("Input from the user detected");
        if (fname) {

        }
        if (lname) {

        }
    }
})



router.post('/add-admin', (req, res) => {
    const { Email, Phone_num, Passwords, ID } = req.body;
    const registedDate = new Date().toISOString().split('T')[0];

    const sql_account = 'INSERT INTO Account (Email, Registed_date, Phone_num, Passwords, ID) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql_account, [Email, registedDate, Phone_num, Passwords, ID], (error, results) => {
        if (error) {
            console.error('Error adding Account:', error);
            res.status(500).send('Error adding Account');
            return;
        }
        console.log('Account added successfully');

        // Now, execute the second query for Account_Admin
        const sql_admin = 'INSERT INTO Account_Admin (AID) VALUES (?)';
        connection.query(sql_admin, [ID], (error, results) => {
            if (error) {
                console.error('Error adding admin:', error);
                res.status(500).send('Error adding admin');
                return;
            }
            console.log('Admin added successfully');
            // res.sendStatus(200);
        });
    });
});

router.get('/api/about_location', (req, res) => {
    console.log("about_location work");
    // Define the configuration data
    const configurationData = {
        locations: [
            {
                title: "Faculty of Information and Communication Technology (ICT)",
                address1: "อาคาร ICT",
                address2: "มหาวิทยาลัยมหิดล, 999 ถ. พุทธมณฑลสาย 4 ตำบล ศาลายา อำเภอพุทธมณฑล นครปฐม 73170, Thailand",
                coords: {
                    lat: 13.7945,
                    lng: 100.3247
                },
                placeId: "ChIJj03KfYuT4jAROhBUGBxOyxg",
                actions: [
                    {
                        label: "Book appointment",
                        defaultUrl: "http://www.facebook.com/ict.mahidol.university"
                    }
                ]
            }
        ],
        mapOptions: {
            center: {
                lat: 38.0,
                lng: -100.0
            },
            fullscreenControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            zoom: 4,
            zoomControl: true,
            maxZoom: 17,
            mapId: ""
        },
        mapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Use environment variable for the API key
        capabilities: {
            input: false,
            autocomplete: false,
            directions: false,
            distanceMatrix: false,
            details: false,
            actions: true
        }
    };

    // Send the JSON response
    res.status(200).json(configurationData);
});


router.get('/api/:name', (req, res) => {
    //console.log("check")
    restuarantdetail = req.params.name
    restuarantdetail = restuarantdetail.split('_').join(' ')
    if (RestaurantList.includes(req.params.name)) {
        res.redirect(`http://localhost:3030/${req.params.name}`);
    }
    else {
        res.redirect(`http://localhost:3030/Error}`);
    }
})




router.use((req, res, next) => {
    console.log(req.url)
    console.log(__dirname)
    console.log('404: Invalid accessed!!!!!')
    console.log(req.url)
    res.status(404)
    res.sendFile(path.join(`${__dirname}/reference/error.html`));
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})