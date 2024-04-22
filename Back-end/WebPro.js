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

/* -------------------- adv search -------------------- */
router.get('/api/adv-search', (req, res) => {
    let sql = `SELECT Restaurant_name, Restaurant_image, Province 
               FROM Account_Restaurant`;
    if (Adv[1] == '' && Adv[2] == '' && Adv[3] == '') {
        sql = sql + ` WHERE Category = "${Adv[0]}";`;
    }
    else if (Adv[0] == '' && Adv[2] == '' && Adv[3] == '') {
        sql = sql + ` WHERE Restaurant_name like "%${Adv[1]}%";`;
    }
    else if (Adv[0] == '' && Adv[1] == '' && Adv[3] == '') {
        sql = sql + ` WHERE Province = "${Adv[2]}";`;
    }
    else if (Adv[0] == '' && Adv[1] == '' && Adv[2] == '') {
        sql = `select Restaurant_name,Province from Account_Restaurant where Province = "${Adv[3]}"; `;
    }
    else if (Adv[2] == '' && Adv[3] == '') {
        sql = sql + ` WHERE Category = "%${Adv[0]}%" and Restaurant_name like "%${Adv[1]}%";`;
    }
    else if (Adv[0] == '' && Adv[3] == '') {
        sql = sql + ` WHERE Restaurant_name like "%${Adv[1]}%" and Province = "${Adv[2]}";`;
    }
    else if (Adv[0] == '' && Adv[1] == '') {
        sql = sql + ` WHERE Province = "${Adv[2]}" and Province = "${Adv[3]}";`;
    }
    else if (Adv[1] == '' && Adv[3] == '') {
        sql = sql + ` WHERE  Category = "%${Adv[0]}%"" and Province = "${Adv[2]}";`;
    }
    else if (Adv[3] == '') {
        sql = sql + ` WHERE Category = "%${Adv[0]}%" and Restaurant_name like "%${Adv[1]}%" and Province = "${Adv[2]}"; `;
    }
    else {
        Adv = ["unknown", "unknown", "unknown", "unknown"]
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

router.post('/sign-in-summit', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Use parameterized queries to prevent SQL injection
    const sql = `SELECT * FROM Account WHERE Email = ? AND Passwords = ?;`;
    connection.query(sql, [email, password], function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Error fetching data' });
        }
        else {
            console.log(results)
            if (results.length > 0) {
                status = 1
                res.redirect(`http://localhost:3030`);
            }
            else {
                res.redirect(`http://localhost:3030/Login-Error`);
            }
            console.log("Complete!!!!!!")
        }
    });

})


router.get('/restaurants', (req, res) => {
    res.status(200).json(RestaurantList);
})

router.get('/api/:name', (req, res) => {
    console.log("check")
    restuarantdetail = req.params.name
    restuarantdetail = restuarantdetail.split('_').join(' ')
    if (RestaurantList.includes(req.params.name)) {
        res.redirect(`http://localhost:3030/${req.params.name}`);
    }
    else {
        res.redirect(`http://localhost:3030/Error}`);
    }
})



/*------------------------ API location ------------------------*/

router.get('/api/closetoyou', (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    // Use geocodeLatLng function to find the province from lat and lng
    geocodeLatLng(lat, lng, (error, province) => {
        if (error) {
            console.error('Error geocoding location:', error);
            res.status(500).json({ error: 'Error geocoding location' });
        } else {
            // Query the database to get restaurants in the specified province
            const sql = `SELECT Restaurant_name, Province, Restaurant_image
                         FROM Account_Restaurant
                         WHERE Province = ?`;

            connection.query(sql, [province], (error, results) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    res.status(500).json({ error: 'Error fetching data' });
                } else {
                    res.status(200).json(results);
                }
            });
        }
    });
});

// Function to get province from latitude and longitude
function geocodeLatLng(lat, lng, callback) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                // Find the province (administrative area level 1) from the results
                let province;
                results[0].address_components.forEach(component => {
                    if (component.types.includes('administrative_area_level_1')) {
                        province = component.long_name;
                    }
                });
                callback(null, province);
            } else {
                callback(new Error('No results found'), null);
            }
        } else {
            callback(new Error('Geocoder failed due to: ' + status), null);
        }
    });
}

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
            console.log(results)
            res.json(results);
        }

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





router.use((req, res, next) => {
    console.log(req.url)
    console.log(__dirname)
    console.log('404: Invalid accessed!!!!!')
    res.status(404)
    res.sendFile(path.join(`${__dirname}/reference/error.html`));
})







app.listen(port, () => {
})