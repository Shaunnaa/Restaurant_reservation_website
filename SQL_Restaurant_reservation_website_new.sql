DROP DATABASE IF exists restaurant;
CREATE DATABASE IF not exists  restaurant;
USE restaurant;

-- Account Section--
CREATE TABLE IF not exists `Account` (
    Email VARCHAR(100) NOT NULL,
    Registed_date date NOT NULL,
    Phone_num VARCHAR(10) ,
	Passwords  VARCHAR(30) NOT NULL,
    ID INT NOT NULL,
    Constraint PK_ID PRIMARY KEY (ID)
);

INSERT INTO `Account` (Email, Registed_date, Phone_num, Passwords, ID) 
VALUES 
('thaidelight@example.com', CURDATE(), '0812345678', 'password123',9000),
('sushisensation@example.com', CURDATE(), '0987654321', 'sushi123',9001),
('pizzapalace@example.com', CURDATE(), '0555555555', 'pizza456',9002),
('burgerbistro@example.com', CURDATE(), '0777777777', 'burger789',9003),
('phofusion@example.com', CURDATE(), '0111111111', 'pho123',9004),
('mediterraneanmagic@example.com', CURDATE(), '0222222222', 'mediterranean456',9005),
('tacotime@example.com', CURDATE(), '0333333333', 'taco789',9006),
('cafeciao@example.com', CURDATE(), '0444444444', 'cafe123',9007),
('dinerdeluxe@example.com', CURDATE(), '0666666666', 'diner456',9008),
('sizzlingsteakhouse@example.com', CURDATE(), '0888888888', 'steak123',9009),
('pastaparadise@example.com', CURDATE(), '0999999999', 'pasta456',9010),
('veggiehaven@example.com', CURDATE(), '0000000000', 'veggie123',9011),

("Matthew.Horner@gmail.com", CURDATE(), 0812123345, "qwerr", 1000),
("James.Raynor@gmail.com", CURDATE(), 0812348172,"James", 1001),
("jidapa.kra@mahidol.ac.th", CURDATE(), 0812348172,"Aj.Pa", 1002),
("wudhichart.saw@mahidol.ac.th", CURDATE(), 0812348172,"Aj.Wud", 1003),
("emily.johnson@gmail.com", CURDATE(), "0812124567", "Emily", 1004),
("michael.brown@gmail.com", CURDATE(), "0812127890", "Mike", 1005),
("laura.garcia@gmail.com", CURDATE(), "0812234567", "Laura", 1006),
("daniel.martinez@gmail.com", CURDATE(), "0812345678", "Dan", 1007),
("olivia.davis@gmail.com", CURDATE(), "0812123456", "Liv", 1008),
("william.lopez@gmail.com", CURDATE(), "0812126789", "Will", 1009),
("sophia.perez@gmail.com", CURDATE(), "0812127890", "Sophie", 1010),
("robert.lee@gmail.com", CURDATE(), "0812341234", "Rob", 1011),
("natalie.harris@gmail.com", CURDATE(), "0812344567", "Nat", 1012),
("christopher.clark@gmail.com", CURDATE(), "0812125678", "Chris", 1013),
("sophia.morris@gmail.com", CURDATE(), "0812128765", "Sophia", 1014),
("samuel.roberts@gmail.com", CURDATE(), "0812345679", "Sam", 1015),

("Admin1@gmail.com", CURDATE(), 0123456789, "Admin1", 2001),
("Admin2@gmail.com", CURDATE(), 0123456789, "Admin2", 2002),
("Admin3@gmail.com", CURDATE(), 0123456789, "Admin3", 2003),
("Admin4@gmail.com", CURDATE(), 0123456789, "Admin4", 2004),
("Admin5@gmail.com", CURDATE(), 0123456789, "Admin5", 2005),
("Admin6@gmail.com", CURDATE(), 0123456789, "Admin6", 2006),
("Admin7@gmail.com", CURDATE(), 0123456789, "Admin7", 2007),
("Admin8@gmail.com", CURDATE(), 0123456789, "Admin8", 2008),
("Admin9@gmail.com", CURDATE(), 0123456789, "Admin9", 2009),
("Admin10@gmail.com", CURDATE(), 0123456789, "Admin10", 2010),
("Admin11@gmail.com", CURDATE(), 0123456789, "Admin11", 2011),
("Admin12@gmail.com", CURDATE(), 0123456789, "Admin12", 2012),
("Admin13@gmail.com", CURDATE(), 0123456789, "Admin13", 2013),
("Admin14@gmail.com", CURDATE(), 0123456789, "Admin14", 2014);

    
-- Account_Customer Section--
CREATE TABLE IF not exists `Account_Customer` (
	Firstname VARCHAR(100) NOT NULL,
    Middlename VARCHAR(100),
    Lastname VARCHAR(100) NOT NULL,
    Location VARCHAR(9) ,
    Points INT NOT NULL,
    Comments VARCHAR(20),
    CID INT NOT NULL,
    Constraint PK_CID PRIMARY KEY (CID),
    CONSTRAINT `ACC_CID` FOREIGN KEY (CID) REFERENCES `Account` (ID)
);

insert into `Account_Customer` (Firstname, Middlename, Lastname, Points, CID)
values
("MAT","D.","Horner", 100, 1000),
("James","R.","Raynor", 100, 1001),
("Jidapa","K.","Kraisangka", 30, 1002),
("Wudhichart","S.","Sawangphol", 45, 1003),
("Emily","K.","Johnson", 27, 1004),
("Michael","A.","Brown", 53, 1005),
("Laura","T.","Garcia", 39, 1006),
("Daniel","E.","Martinez", 37, 1007),
("Olivia","N.","Davis", 22, 1008),
("William","G.","Lopez", 48, 1009),
("Sophia","M.","Perez", 35, 1010),
("Robert","S.","Lee", 50, 1011),
("Natalie", "V.", "Harris", 29, 1012),
("Christopher", "J.", "Clark", 47, 1013),
("Sophia", "R.", "Morris", 34, 1014),
("Samuel", "W.", "Roberts", 52, 1015);
    

-- Account_Restaurant Section--
CREATE TABLE IF not exists `Account_Restaurant` (
    Restaurant_name VARCHAR(50),
    Restaurant_image VARCHAR(200), -- wait
    Category VARCHAR(50), -- add
    Reserve_count INT , -- wait
    Visited_count INT, -- wait
    Descriptions VARCHAR(200),
    Location VARCHAR(9),
    Province VARCHAR(30),
    District VARCHAR(30),
    Subdistrict VARCHAR(30),
    RID INT NOT NULL,
    Constraint PK_RID PRIMARY KEY (RID),
    CONSTRAINT `ACC_RID` FOREIGN KEY (RID) REFERENCES `Account` (ID)
);

INSERT INTO `Account_Restaurant` (Restaurant_name, Restaurant_image, Category, Reserve_count, Descriptions, Province, District, Subdistrict, RID) 
VALUES 
('Thai Delight', '1CQCVoRjd0od-LuCvw8cb0HGWOMchelwb', 'Thai food', 5, 'Authentic Thai cuisine served in a cozy atmosphere.', 'Bangkok', 'Bangkok', 'Bang Rak', 9000),
('Sushi Sensation', '1CyIH1wTPdF8SyJu_1OunbAS6sJpRAh9t', 'Japanese food', 0, 'Fresh and flavorful sushi creations made with the finest ingredients.', 'Bangkok', 'Bangkok', 'Pathum Wan', 9001),
('Pizza Palace', '1hj-pYszqElLGSZrfIEaQcBQJEXAJaXB7', 'Italian food', 0, 'Delicious pizzas with a variety of toppings, perfect for a casual meal.', 'Bangkok', 'Bangkok', 'Watthana', 9002),
('Burger Bistro', '1gLuWB6PA0ioigLU4Y8FMy3dTT53jvTiy', 'American food', 0, 'Juicy burgers and tasty sides in a relaxed setting.', 'Chiang Mai', 'Chiang Mai', 'Mueang Chiang Mai', 9003),
('Pho Fusion', '14PWy5AIzh9HTk2FTsSQq9v0Lu0gNXEVM', 'Vietnamese food', 1, 'A fusion of Vietnamese flavors in comforting bowls of pho.', 'Chang Wat Nakhon Pathom', 'Phutthamonthon', 'Salaya', 9004),
('Mediterranean Magic', '1YuvL0ZYjZGwK1cEU4nLUGYh-YJd23ydp', 'Mediterranean food', 2, 'Savor the flavors of the Mediterranean with our fresh and healthy dishes.', 'Phuket', 'Phuket', 'Mueang Phuket', 9005),
('Taco Time', '1X2XoeiD6Qb4b-kLo4aku2tNpSNaNzDvO', 'Mexican food', 7, 'Tantalize your taste buds with our authentic Mexican tacos.', 'Phuket', 'Phuket', 'Mueang Phuket', 9006),
('Café Ciao', '1WckDkxh7yWUgqRPAqHzKFZeqHVLBVqp_', 'Cafe', '10', 'Relax and unwind with our selection of coffee, pastries, and light bites.', 'Phuket', 'Phuket', 'Kathu', 9007),
('Diner Deluxe', '1twZenY01TB9A-zwomjymOl-BmSCmte5A', 'American food', 8, 'Classic diner fare served with a modern twist.', 'Phuket', 'Phuket', 'Thalang', 9008),
('Sizzling Steakhouse', '1CyIH1wTPdF8SyJu_1OunbAS6sJpRAh9t', 'Steakhouse', 4, 'Premium steaks grilled to perfection, accompanied by gourmet sides.', 'Krabi', 'Krabi', 'Mueang Krabi', 9009),
('Pasta Paradise', '1GvAAI1YYoHkn_u5FwZKPZG4kIPkrJnxf', 'Italian food', 3, 'Indulge in a variety of pasta dishes inspired by Italian tradition.', 'Krabi', 'Krabi', 'Ao Nang', 9010),
('Veggie Haven', '1fqnhSL_-Lt4H1guQlqKDmPQjOOlXQ3bH', 'Vegetarian food', '9', 'A haven for vegetarians, with a menu filled with flavorful plant-based options.', 'Krabi', 'Krabi', 'Nong Thale', 9011);


-- Account_Admin Section--
CREATE TABLE IF not exists `Account_Admin` (
    AID INT NOT NULL,
    fname varchar(200),
    lname varchar(200),
    mname varchar(200),
    username varchar(200),
    DOB datetime,
    Constraint PK_AID PRIMARY KEY (AID),
    CONSTRAINT `ACC_AID` FOREIGN KEY (AID) REFERENCES `Account` (ID)
);

insert into `Account_Admin` (AID, fname, lname, mname, username, DOB)
values
(2001, "Admin1", "Python", "Server1", "user_A", '2002-03-11'),
(2002, "Admin2", "JavaScript", "Workstation2", "user_B", '2002-03-11'),
(2003, "Admin3", "Ruby", "Desktop3", "user_C", '2002-03-11'),
(2004, "Admin4", "Java", "Laptop4", "user_D", '2002-03-11'),
(2005, "Admin5", "C++", "Server5", "user_E", '2002-03-11'),
(2006, "Admin6", "Go", "Workstation6", "user_F", '2002-03-11'),
(2007, "Admin7", "C#", "Desktop7", "user_G", '2002-03-11'),
(2008, "Admin8", "PHP", "Laptop8", "user_H", '2002-03-11'),
(2009, "Admin9", "Swift", "Server9", "user_I", '2002-03-11'),
(2010, "Admin10", "Kotlin", "Workstation10", "user_J", '2002-03-11'),
(2011, "Admin11", "Scala", "Server11", "user_K", '2002-03-11'),
(2012, "Admin12", "R", "Desktop12", "user_L", '2002-03-11'),
(2013, "Admin13", "Perl", "Laptop13", "user_M", '2002-03-11'),
(2014, "Admin14", "Haskell", "Workstation14", "user_N", '2002-03-11');

-- Manage_Admin_Customer Section--  
CREATE TABLE IF not exists `Manage_Admin_Customer` (
    Edit_Date_AC date not null,
    CID INT NOT NULL,
    AID INT NOT NULL,
    Constraint PK_AC PRIMARY KEY (CID,AID),
    CONSTRAINT `ACC_CID_AC` FOREIGN KEY (CID) REFERENCES `Account_Customer` (CID),
    CONSTRAINT `ACC_AID_AC` FOREIGN KEY (AID) REFERENCES `Account_Admin` (AID)
);

    CREATE TABLE IF not exists `Manage_Admin_Restaurant` (
    Edit_Date_AC date not null,
    RID INT NOT NULL,
    AID INT NOT NULL,
    Constraint PK_AR PRIMARY KEY (RID,AID),
    CONSTRAINT `ACC_RID_AR` FOREIGN KEY (RID) REFERENCES `Account_Restaurant` (RID),
    CONSTRAINT `ACC_AID_AR` FOREIGN KEY (AID) REFERENCES `Account_Admin` (AID)
);

CREATE TABLE IF not exists `Reserve` (
	reserve_name varchar(10),
    reserve_date date not null,
    reserve_time time,
    reserving_time datetime,
    people int,
    tel int,
    RID INT NOT NULL,
    CID INT NOT NULL,
    Constraint PK_RC PRIMARY KEY (RID,CID),
    CONSTRAINT `ACC_RID_RC` FOREIGN KEY (RID) REFERENCES `Account_Restaurant` (RID),
    CONSTRAINT `ACC_CID_RC` FOREIGN KEY (CID) REFERENCES `Account_Customer` (CID)
);

-- Restaurant_Category Section-- 
CREATE TABLE IF NOT EXISTS `Restaurant_Category` (
    Category VARCHAR(50),
    Restaurant_Count INT,
    CONSTRAINT PK_Category PRIMARY KEY (Category)
);

INSERT INTO `Restaurant_Category` (Category, Restaurant_Count)
SELECT Category, COUNT(*) AS Restaurant_Count
FROM `Account_Restaurant`
GROUP BY Category;

select Email from `Account` where Email = "Matthew.Horner@gmail.com" and Passwords = "as";
