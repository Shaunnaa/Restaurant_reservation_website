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

let searchword = "";
let RestaurantList = []
let restuarantdetail = ""
let Adv = ["", "", ""]

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


/*------------------------ API Link database ------------------------*/

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

router.get('/api/search', (req, res) => {
    let sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${searchword}%";`;
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
router.get('/api/adv-search', (req, res) => {
    let sql = ''
    if (Adv[0] == '') {
        sql = `select Restaurant_name,Province from Account_Restaurant where Province = "${Adv[1]}"; `;
    }
    else if (Adv[1] == '') {
        sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${Adv[0]}%";`;
    }
    else if (Adv[0] == '' && Adv[1] == '') {
        Adv = ["unknown", "unknown", "unknown"]
    }
    else {
        sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${Adv[0]}%" and Province = "${Adv[1]}"; `;
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

router.get('/api/adv-search', (req, res) => {
    let sql = ''
    if (Adv[0] == '') {
        sql = `select Restaurant_name,Province from Account_Restaurant where Province = "${Adv[1]}"; `;
    }
    else if (Adv[1] == '') {
        sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${Adv[0]}%";`;
    }
    else if (Adv[0] == '' && Adv[1] == '') {
        Adv = ["unknown", "unknown", "unknown"]
    }
    else {
        sql = `select Restaurant_name,Province from Account_Restaurant where Restaurant_name like "%${Adv[0]}%" and Province = "${Adv[1]}"; `;
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
router.get('/api/detail', (req, res) => {
    // console.log(data)
    // console.log("check")
    let sql = `select Restaurant_name,Descriptions, Province, District, Subdistrict from Account_Restaurant where Restaurant_name = "${restuarantdetail}";`;
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

router.post('/adv-search-summit', (req, res) => {
    // console.log(req.body.first_name)
    Adv[0] = req.body.last_name
    Adv[1] = req.body.company
    Adv[2] = req.body.datetime
    console.log(Adv)
    res.redirect(path.join(`http://localhost:3030/adv-search`));
})

router.get('/restaurants', (req, res) => {
    res.status(200).json(RestaurantList);
})

router.get('/api/:name', (req, res) => {
    console.log("check")
    restuarantdetail = req.params.name
    restuarantdetail = restuarantdetail.split('_').join(' ')
    if (RestaurantList.includes(req.params.name)) {
        res.redirect(path.join(`http://localhost:3030/${req.params.name}`));
    }
    else {
        res.redirect(path.join(`http://localhost:3030/Error}`));
    }
})

router.get('/api/:name', (req, res) => {
    console.log("check")
    restuarantdetail = req.params.name
    restuarantdetail = restuarantdetail.split('_').join(' ')
    if (RestaurantList.includes(req.params.name)) {
        res.redirect(path.join(`http://localhost:3030/${req.params.name}`));
    }
    else {
        res.redirect(path.join(`http://localhost:3030/Error}`));
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







router.get('/admin-accounts', (req, res) => {
    const sql = 'SELECT * FROM Account_Admin;';
    console.log('check')
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching admin accounts:', err);
        res.status(500).json({ error: 'Error fetching admin accounts' });
        return;
      }
      else{
        console.log(results)
        res.json(results);
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