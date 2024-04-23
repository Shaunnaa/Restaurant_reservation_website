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
let currentRestaurant = ""
let currentrestaurant = 9007
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
            if (str == null) {
                continue;
            }
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
                else if (results[0].ID >= 2000 && results[0].ID < 3000) {
                    let sql2 = `select * from Account_Admin where AID = "${results[0].ID}";`;
                    connection.query(sql2, function (error, result3) {
                        if (error) {
                            res.status(500).json({ error: 'Error fetching data' });
                        }
                        else {
                            console.log("Complete!!!!!!")
                            currentAdmin = result3[0].AID
                            console.log(currentAdmin)
                            res.redirect(`http://localhost:3030/AdminProfile/${currentAdmin}`);
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
            currentrestaurant = results[0].RID
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

        if (results.length === 0) {
            // Handle the case where no account is found
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Redirect user if authentication is successful
        const searchword = req.body.searchdropdown;
        // Pass `searchword` as a query parameter in the redirect URL
        res.redirect(`http://localhost:3030/search?query=${encodeURIComponent(searchword)}`);
    });
});



router.get('/api/schedule', (req, res) => {
    // console.log(data)
    console.log("check")
    let sql = `select reserve_name, DATE_FORMAT(reserve_date, '%Y-%m-%d') AS formatted_date, reserve_time,DATE_FORMAT(reserving_time, '%Y-%m-%d %H:%i') AS formatted_reserve_date, people,tel from Reserve where RID = "${currentrestaurant}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            console.log(currentrestaurant)
            console.log(results)
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
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



//Admin Management---------------------------------------------------------------------
//Get Admin info
router.get('/admin-accounts', (req, res) => {
    const sql = 'SELECT Account_Admin.AID, Account_Admin.username ,Account.Email, Account.Passwords, Account.Phone_num FROM Account JOIN Account_Admin ON Account.ID = Account_Admin.AID;';
    console.log('check')
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


router.get('/modify-admin/:id', (req, res) => {//Retreive ADMIN ID
    currentAdmin = req.params.id
    res.redirect(`http://localhost:3030/modify-admin/${currentAdmin}`)
});

router.get('/Apo/modify-admin', (req, res) => {
    res.status(200).json(currentAdmin)
});

router.get('/AdminProfile/:id', (req, res) => {//Retreive ADMIN ID
    currentAdmin = req.params.id
    res.redirect(`http://localhost:3030/AdminProfile/${currentAdmin}`)
});

router.get('/Apo/AdminProfile', (req, res) => {
    console.log('/Apo/AdminProfile');
    console.log('Current Admin:', currentAdmin);

    const sql = `SELECT Account_Admin.fname, Account_Admin.lname, Account_Admin.mname, Account_Admin.DOB, Account_Admin.AID, Account_Admin.username, Account.Email, Account.Passwords, Account.Phone_num FROM Account JOIN Account_Admin ON Account.ID = Account_Admin.AID WHERE Account_Admin.AID = ${currentAdmin};`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching admin profile:', err);
            res.status(500).json({ error: 'Error fetching admin profile' });
            return;
        } else {
            console.log('Admin profile retrieved successfully:', results);
            res.json(results);
        }
    });
});


//Modify Admin
router.put('/modify-admin', (req, res) => {
    const { AID, fname, lname, mname, username, DOB, Email, Phone_num, Passwords } = req.body;
    if (!fname && !lname && !mname && !username && !DOB && !Email && !Phone_num && !Passwords) {
        console.log('No input from user')
    } else {
        if (!AID) {
            return res.status(400).json({ error: 'AID is required' });
        }
        let updateAdminQuery = 'UPDATE Account_Admin SET ';
        let adminValues = [];
        let isFirstAdminSet = true;

        if (fname) {
            updateAdminQuery += `fname = ?, `;
            adminValues.push(fname);
            isFirstAdminSet = false;
        }
        if (lname) {
            updateAdminQuery += `lname = ?, `;
            adminValues.push(lname);
            isFirstAdminSet = false;
        }
        if (mname) {
            updateAdminQuery += `mname = ?, `;
            adminValues.push(mname);
            isFirstAdminSet = false;
        }
        if (username) {
            updateAdminQuery += `username = ?, `;
            adminValues.push(username);
            isFirstAdminSet = false;
        }
        if (DOB) {
            updateAdminQuery += `DOB = ?, `;
            adminValues.push(DOB);
            isFirstAdminSet = false;
        }
        updateAdminQuery = updateAdminQuery.slice(0, -2);
        updateAdminQuery += ` WHERE AID = ?`;
        adminValues.push(AID);

        let updateAccountQuery = 'UPDATE Account SET ';
        let accountValues = [];
        let isFirstAccountSet = true;

        if (Email) {
            updateAccountQuery += `Email = ?, `;
            accountValues.push(Email);
            isFirstAccountSet = false;
        }
        if (Phone_num) {
            updateAccountQuery += `Phone_num = ?, `;
            accountValues.push(Phone_num);
            isFirstAccountSet = false;
        }
        if (Passwords) {
            updateAccountQuery += `Passwords = ?, `;
            accountValues.push(Passwords);
            isFirstAccountSet = false;
        }
        updateAccountQuery = updateAccountQuery.slice(0, -2);
        updateAccountQuery += ` WHERE ID = ?`;
        accountValues.push(AID);

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                return res.status(500).json({ error: 'An error occurred while updating admin and account' });
            }

            connection.query(updateAdminQuery, adminValues, (error, adminResults) => {
                if (error) {
                    console.error('Error updating admin:', error);
                    return connection.rollback(() => {
                        res.status(500).json({ error: 'An error occurred while updating admin' });
                    });


                }

                connection.query(updateAccountQuery, accountValues, (error, accountResults) => {
                    if (error) {
                        console.error('Error updating account:', error);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'An error occurred while updating account' });
                        });
                    }

                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return connection.rollback(() => {
                                res.status(500).json({ error: 'An error occurred while committing transaction' });
                            });
                        }
                        console.log('Admin and Account updated successfully');
                        return res.status(200).json({ message: 'Admin and Account updated successfully' });
                    });
                });
            });
        });
    }
});

//Add Admin
router.post('/add-admin', (req, res) => {
    const { Email, Phone_num, Passwords, ID } = req.body;
    const registedDate = new Date().toISOString().split('T')[0];

    console.log(Email, Phone_num, Passwords, ID)

    const sql_account = 'INSERT INTO Account (Email, Registed_date, Phone_num, Passwords, ID) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql_account, [Email, registedDate, Phone_num, Passwords, ID], (error, results) => {
        if (error) {
            console.error('Error adding Account:', error);
            res.status(500).send('Error adding Account');
            return;
        }
        console.log('Account added successfully');

        const sql_admin = 'INSERT INTO Account_Admin (AID) VALUES (?)';
        connection.query(sql_admin, [ID], (error, results) => {
            if (error) {
                console.error('Error adding admin:', error);
                res.status(500).send('Error adding admin');
                return;
            }
            console.log('Admin added successfully');
            res.sendStatus(200);
        });
    });
});

//Delete Admin
router.delete('/delete-admin/:AID', (req, res) => {
    const AID = req.params.AID;

    connection.query('DELETE FROM Account_Admin WHERE AID = ?', [AID], (error, adminResults) => {
        if (error) {
            console.error('Error deleting admin:', error);
            return res.status(500).json({ error: 'An error occurred while deleting admin' });
        }

        connection.query('DELETE FROM Account WHERE ID = ?', [AID], (error, accountResults) => {
            if (error) {
                console.error('Error deleting admin:', error);
                return res.status(500).json({ error: 'An error occurred while deleting admin' });
            }
            console.log('Admin deleted successfully');
            return res.status(200).json({ message: 'Admin deleted successfully' });
        });
    });
});



//Restaurant management
//Get Restaurant Info
router.get('/restaurant-accounts', (req, res) => {
    const sql = 'SELECT Account_Restaurant.RID, Account_Restaurant.Restaurant_name ,Account.Email, Account.Passwords FROM Account JOIN Account_Restaurant ON Account.ID = Account_Restaurant.RID;';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching restaurant accounts:', err);
            res.status(500).json({ error: 'Error fetching restaurant accounts' });
            return;
        }
        else {
            res.json(results);
        }
    });
});

router.get('/modify-restaurant/:id', (req, res) => {//Retreive RESTAURANT ID
    currentRestaurant = req.params.id
    res.redirect(`http://localhost:3030/modify-restaurant/${currentRestaurant}`)
});

router.get('/Apo/modify-restaurant', (req, res) => {
    res.status(200).json(currentRestaurant)
});

//Add Restaurant
router.post('/add-restaurant', (req, res) => {
    const { Email, Phone_num, Passwords, ID } = req.body;
    const registedDate = new Date().toISOString().split('T')[0];

    console.log(Email, Phone_num, Passwords, ID)

    const sql_account = 'INSERT INTO Account (Email, Registed_date, Phone_num, Passwords, ID) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql_account, [Email, registedDate, Phone_num, Passwords, ID], (error, results) => {
        if (error) {
            console.error('Error adding Account:', error);
            res.status(500).send('Error adding Account');
            return;
        }
        console.log('Account added successfully');

        const sql_admin = 'INSERT INTO Account_Restaurant (RID) VALUES (?)';
        connection.query(sql_admin, [ID], (error, results) => {
            if (error) {
                console.error('Error adding admin:', error);
                res.status(500).send('Error adding admin');
                return;
            }
            console.log('Restaurant added successfully');
            // res.sendStatus(200);
            res.redirect('http://localhost:3030/restaurant_management');
        });
    });
});

//Modify Restaurant
router.put('/modify-restaurant', (req, res) => {
    const { RID, Restaurant_name, Category, Descriptions, Location, Province, District, Subdistrict, Email, Passwords, Phone_num } = req.body;
    console.log(RID, Restaurant_name, Category, Descriptions, Location, Province, District, Subdistrict, Email, Phone_num, Passwords)
    if (!Restaurant_name && !Category && !Descriptions && !Location && !Province && !District && !Subdistrict && !Email && !Phone_num && !Passwords) {
        console.log('No input from user')
    } else {
        if (!RID) {
            return res.status(400).json({ error: 'RID is required' });
        }
        let updateAdminQuery = 'UPDATE Account_Restaurant SET ';
        let adminValues = [];
        let isFirstAdminSet = true;

        if (Restaurant_name) {
            updateAdminQuery += `Restaurant_name = ?, `;
            adminValues.push(Restaurant_name);
            isFirstAdminSet = false;
        }
        if (Category) {
            updateAdminQuery += `Category = ?, `;
            adminValues.push(Category);
            isFirstAdminSet = false;
        }
        if (Descriptions) {
            updateAdminQuery += `Descriptions = ?, `;
            adminValues.push(Descriptions);
            isFirstAdminSet = false;
        }
        if (Location) {
            updateAdminQuery += `Location = ?, `;
            adminValues.push(Location);
            isFirstAdminSet = false;
        }
        if (Province) {
            updateAdminQuery += `Province = ?, `;
            adminValues.push(Province);
            isFirstAdminSet = false;
        }
        if (District) {
            updateAdminQuery += `District = ?, `;
            adminValues.push(District);
            isFirstAdminSet = false;
        }
        if (Subdistrict) {
            updateAdminQuery += `Subdistrict = ?, `;
            adminValues.push(Subdistrict);
            isFirstAdminSet = false;
        }
        updateAdminQuery = updateAdminQuery.slice(0, -2);
        updateAdminQuery += ` WHERE RID = ?`;
        adminValues.push(RID);

        let updateAccountQuery = 'UPDATE Account SET ';
        let accountValues = [];
        let isFirstAccountSet = true;

        if (Email) {
            updateAccountQuery += `Email = ?, `;
            accountValues.push(Email);
            isFirstAccountSet = false;
        }
        if (Phone_num) {
            updateAccountQuery += `Phone_num = ?, `;
            accountValues.push(Phone_num);
            isFirstAccountSet = false;
        }
        if (Passwords) {
            updateAccountQuery += `Passwords = ?, `;
            accountValues.push(Passwords);
            isFirstAccountSet = false;
        }
        updateAccountQuery = updateAccountQuery.slice(0, -2);
        updateAccountQuery += ` WHERE ID = ?`;
        accountValues.push(RID);

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                return res.status(500).json({ error: 'An error occurred while updating admin and account' });
            }

            connection.query(updateAdminQuery, adminValues, (error, adminResults) => {
                if (error) {
                    console.error('Error updating admin:', error);
                    return connection.rollback(() => {
                        res.status(500).json({ error: 'An error occurred while updating admin' });
                    });

                }

                connection.query(updateAccountQuery, accountValues, (error, accountResults) => {
                    if (error) {
                        console.error('Error updating account:', error);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'An error occurred while updating account' });
                        });
                    }

                    connection.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return connection.rollback(() => {
                                res.status(500).json({ error: 'An error occurred while committing transaction' });
                            });
                        }
                        console.log('Restaurant and Account updated successfully');
                        return res.status(200).json({ message: 'Restaurant and Account updated successfully' });
                    });
                });
            });
        });
    }
});

//Delete Restaurant
router.delete('/delete-restaurant/:RID', (req, res) => {
    const AID = req.params.AID;

    connection.query('DELETE FROM Account_Admin WHERE RID = ?', [RID], (error, adminResults) => {
        if (error) {
            console.error('Error deleting admin:', error);
            return res.status(500).json({ error: 'An error occurred while deleting admin' });
        }

        connection.query('DELETE FROM Account WHERE ID = ?', [RID], (error, accountResults) => {
            if (error) {
                console.error('Error deleting admin:', error);
                return res.status(500).json({ error: 'An error occurred while deleting admin' });
            }
            console.log('Admin deleted successfully');
            return res.status(200).json({ message: 'Admin deleted successfully' });
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