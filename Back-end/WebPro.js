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
let currentRestaurant = 0
// let currentrestaurant = 9007
let currentcustomer = 0
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
                {currentcustomer = results[0].ID
                    res.redirect(`http://localhost:3030`);
                }
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
    // console.log(req.body)
    reserve_data = req.body
    const { Reserve_name, date, datetime, num, tel, menu, other } = req.body;
    // let reserve_date = new Date()
    // reserve_date = reserve_date.toISOString().slice(0, 19).replace('T', ' ');
    // console.log(date)
    let sql = `INSERT INTO Reserve (reserve_name, reserve_date, reserve_time, reserving_time, people, tel, RID, CID) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)`;
    connection.query(sql, [Reserve_name, date, datetime, num, tel, currentrestaurant, currentcustomer], (error, results) => {
        if (error) {
            console.error('Error adding Account:', error);
            res.status(500).send('Error adding Account');
            return;
        }
        console.log('Account added successfully');

    });
    res.redirect(`http://localhost:3030/${restuarantdetail.split(' ').join('_')}/reserve-success`);
})

router.get('/logout', (req, res) => {
    status = 0;
    res.redirect(`http://localhost:3030`);
});

/* -------------------- detail -------------------- */
router.get('/api/detail', (req, res) => {
    // console.log(data)
    // console.log("check")
    let sql = `select RID, Restaurant_image,Restaurant_name,Descriptions, Province, District, Subdistrict from Account_Restaurant where Restaurant_name = "${restuarantdetail}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            if (results.length > 0) {
                console.log(results)
                currentrestaurant = results[0].RID
                console.log(currentrestaurant)
                res.status(200).json(results);
                console.log("Complete!!!!!!")
            }
            else {
                res.status(200).json(results);
            }
        }
    });
});

router.get('/api/all-detail', (req, res) => {
    // console.log(data)
    // console.log("check")
    let sql = `select RID, Restaurant_name, Phone_num, Email, Descriptions from Account_Restaurant inner join Account on RID = ID where Restaurant_name = "${restuarantdetail}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            // console.log(results)
            currentrestaurant = results[0].RID
            res.status(200).json(results);
            console.log("Complete!!!!!!")
        }
    });
});

router.get('/api/schedule', (req, res) => {
    // console.log(data)
    // console.log("check")
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

router.get('/api/reservation', (req, res) => {
    let sql = `select reserve_name, DATE_FORMAT(reserve_date, '%Y-%m-%d') AS formatted_date, reserve_time, people from Reserve where CID = "${currentcustomer}";`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error('Error fetching data:', error);
            console.log("Error!!!!!!")
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            // console.log("reservation API")
            // console.log(results[results.length - 1])
            res.status(200).json(results[results.length - 1]);
            console.log("Complete!!!!!! from Reservation")
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

// router.post('/sign-in-summit', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     // Use parameterized queries to prevent SQL injection
//     const sql = `SELECT * FROM Account WHERE Email = ? AND Passwords = ?;`;
//     connection.query(sql, [email, password], function (error, results) {
//         if (error) {
//             console.error('Error fetching data:', error);
//             return res.status(500).json({ error: 'Error fetching data' });
//         }

//         if (results.length === 0) {
//             // Handle the case where no account is found
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Redirect user if authentication is successful
//         const searchword = req.body.searchdropdown;
//         // Pass `searchword` as a query parameter in the redirect URL
//         res.redirect(`http://localhost:3030/search?query=${encodeURIComponent(searchword)}`);
//     });
// });

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


// Endpoint to handle the request
router.get('/api/closetoyou', (req, res) => {
        if (province === "Krung Thep Maha Nakhon"){
            province = "Bangkok";
        }
    
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
    const sql = 'SELECT Account_Admin.AID, Account_Admin.username ,Account.Email, Account.Passwords, Account.Phone_num FROM Account JOIN Account_Admin ON Account.ID = Account_Admin.AID;';
    console.log('check')
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
    let checkUpdate = 0;
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
            if(fname || lname || mname || username || DOB){
                console.log('ppppppppp')
                connection.query(updateAdminQuery, adminValues, (error, adminResults) => {
                    if (error) {
                        console.error('Error updating admin:', error);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'An error occurred while updating admin' });
                        });
    
    
                    }
                    else{
                        checkUpdate = 1
                        console.log('Admin updated successfully');
                    }
                });
            }
            if(Email || Phone_num || Passwords){
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
                        checkUpdate = 1
                        console.log('Account updated successfully');
                    });
                });
            }
        });
    }
});

router.put('/modify-restaurant-restaurant', (req, res) => {
    const { RID, Restaurant_name, Phone_num, Email, Password, Descriptions, Location, Province, District, Subdistrict, Passwords } = req.body;
    console.log(RID, Restaurant_name, Phone_num, Email, Password, Descriptions, Location, Province, District, Subdistrict, Passwords)
    console.log(req.body)
    if (!Restaurant_name && !Descriptions && !Location && !Province && !District && !Subdistrict && !Email && !Phone_num && !Passwords) {
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
            if(Restaurant_name  || Descriptions || Location || Province || District || Subdistrict){
                console.log(Restaurant_name, Descriptions, Location, Province, District, Subdistrict)
                connection.query(updateAdminQuery, adminValues, (error, adminResults) => {
                    if (error) {
                        console.error('Error updating admin:', error);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'An error occurred while updating admin' });
                        });
    
    
                    }
                    else{
                        checkUpdate = 1
                        console.log('Restaurant updated successfully');
                    }
                });
            }

            if(Email || Phone_num || Passwords){
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
                        checkUpdate = 1
                        console.log('Account Restaurant updated successfully');
                    });
                });
            }
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
            // res.sendStatus(200);
            res.redirect('http://localhost:3030/Admin_management');
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


//Restaurant management
//Get Restaurant Info
router.get('/restaurant-accounts', (req, res) => {
    const sql = 'SELECT Account_Restaurant.RID, Account_Restaurant.Restaurant_name ,Account.Email, Account.Passwords, Account.Phone_num FROM Account JOIN Account_Restaurant ON Account.ID = Account_Restaurant.RID;';

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
    const { ID, Email, Phone_num, Passwords, Restaurant_name} = req.body;
    const registedDate = new Date().toISOString().split('T')[0];

    const sql_account = 'INSERT INTO Account (Email, Registed_date, Phone_num, Passwords, ID) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql_account, [Email, registedDate, Phone_num, Passwords, ID], (error, accountResults) => {
        if (error) {
            console.error('Error adding Account:', error);
            res.status(500).send('Error adding Account');
            return;
        }
        console.log('Account added successfully');

        const sql_admin = 'INSERT INTO Account_Restaurant (RID, Restaurant_name) VALUES (?, ?)';
        connection.query(sql_admin, [ID, Restaurant_name], (error, results) => {
            if (error) {
                console.error('Error adding admin:', error);
                res.status(500).send('Error adding admin');
                return;
            }
            console.log('Restaurant added successfully');

            res.redirect('http://localhost:3030/restaurant_management');
        });

    });
});

router.get('/:name/Profile', (req, res) =>{
    restuarantdetail = req.params.name.split('_').join(' ')
    res.redirect(`http://localhost:3030/${req.params.name}/Profile`)
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
            if(Restaurant_name || Category || Descriptions || Location || Province || District || Subdistrict){
                console.log( Restaurant_name, Category, Descriptions, Location, Province, District, Subdistrict)
                connection.query(updateAdminQuery, adminValues, (error, adminResults) => {
                    if (error) {
                        console.error('Error updating admin:', error);
                        return connection.rollback(() => {
                            res.status(500).json({ error: 'An error occurred while updating admin' });
                        });
    
    
                    }
                    else{
                        checkUpdate = 1
                        console.log('Restaurant updated successfully');
                    }
                });
            }

            if(Email || Phone_num || Passwords){
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
                        checkUpdate = 1
                        console.log('Account Restaurant updated successfully');
                    });
                });
            }
        });
    }
});

router.delete('/delete-restaurant/:RID', (req, res) => {
    const RID = req.params.RID;
    connection.query('DELETE FROM Account_Restaurant WHERE RID = ?', [RID], (error, adminResults) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while deleting restaurant' });
        }
        connection.query('DELETE FROM Account WHERE ID = ?', [RID], (error, accountResults) => {
            if (error) {
                console.error('Error deleting admin:', error);
                return res.status(500).json({ error: 'An error occurred while deleting restaurant' });
            }
            console.log('restaurant deleted successfully');
            return res.status(200).json({ message: 'Admin deleted successfully' });
        });
    });
});


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