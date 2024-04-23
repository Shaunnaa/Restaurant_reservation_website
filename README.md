*** This project need to use internet connection because we use " Tailwind CSS CDN " ***

1) Download "SQL_Restaurant_reservation_website.sql" file and run

        1.1 Open file in MySQL WorkBench
        1.2 Click Server > Users and Privileges
        1.3 Add Account (If have already make sure this are correct)
        1.4 Create Login Name
        1.5 Change Limit to Hosts Matching: From % to localhost
        1.6 Set the password
        1.7 Go to Schema Privileges > Add Entry > Selected schema: restaurant > Click "OK" >  Click "Select *ALL*" > Apply
        1.8 From 1.4 - 1.7 add the same data to the Back-end > .env file

3) cd Back-end

        Download
        1) npm init
        2) npm install express
        3) npm install nodemon
        4) npm install dotenv
        5) npm install mysql2
        6) npm install cors
        7) npm install @google/maps

        After that
        >>> npm start <<<

    --------------------------------------------

    cd Front-end

        Download
        1) npm init
        2) npm install express
        3) npm install nodemon
        4) npm install dotenv
        5) npm install cors

        After that
        >>> npm start <<<


