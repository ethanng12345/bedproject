const pool = require("../services/db");
const bcrypt = require("bcrypt")
const pepper = process.env.PEPPER 
bcrypt.hash('1234'+pepper, 10, (err, hashedPassword) => {
  if (err){
    console.error("Error hashing password:", err);
    return;
  }else{
    const SQLSTATEMENT = `
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS FitnessChallenge;
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS BoxerProfile;
DROP TABLE IF EXISTS Weapons;
DROP TABLE IF EXISTS Armor;
DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS WeaponInventory;
DROP TABLE IF EXISTS ArmorInventory;
DROP TABLE IF EXISTS Reviews;


CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username TEXT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  skillpoints INT DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FitnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  challenge TEXT NOT NULL,
  skillpoints INT NOT NULL
);

CREATE TABLE UserCompletion (
  complete_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  completed BOOL NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE TABLE BoxerProfile (
  boxer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username TEXT NOT NULL,
  strength INT DEFAULT 10,
  stamina INT DEFAULT 10,
  level INT DEFAULT 0,
  coins INT DEFAULT 0,
  weapon_id INT,
  armor_id INT,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0
);

CREATE TABLE Weapons (
  weapon_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  damage_multiplier DECIMAL(3,2) NOT NULL,
  coins INT NOT NULL
);

CREATE TABLE Armor (
  armor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  hp_multiplier DECIMAL(3,2) NOT NULL,
  coins INT NOT NULL
);

CREATE TABLE Matches (
  match_id INT AUTO_INCREMENT PRIMARY KEY,
  boxer1_id INT NOT NULL,
  boxer2_id INT NOT NULL,
  winner_id INT,
  coins_earned INT NOT NULL,
  match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE WeaponInventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  boxer_id INT NOT NULL,
  weapon_id INT NOT NULL

);
CREATE TABLE ArmorInventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  boxer_id INT NOT NULL,
  armor_id INT NOT NULL
  
);

CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_amt INT NOT NULL,
  user_id INT NOT NULL,
  challenge_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);





INSERT INTO FitnessChallenge (challenge_id, creator_id, challenge, skillpoints) VALUES
(1, '1', 'Complete 2.4km within 15 minutes ', '50'),
(2, '1', 'Cycle around the island for at least 50km', '100'),
(3, '2', 'Complete a full marathon (42.2km)', '200'),
(4, '2', 'Hold a plank for 5 minutes', '50'),
(5, '2', 'Perform 100 push-ups in one session', '75');

INSERT INTO Weapons (name, damage_multiplier, coins)
VALUES
('Basic Gloves', 1.10, 50),
('Advanced Gloves', 1.25, 100),
('Steel Knuckles', 1.50, 200),
('Iron Fists', 1.75, 300),
('Diamond Fists', 1.75, 400),
('Logan Paul Mighty Gloves', 2.00, 500),
('Iron Mike Gloves', 2.25, 750),
('Skibidi Strikers', 2.50, 1000),
('Legendary Gauntlets', 3.00, 1500);

INSERT INTO Armor (name, hp_multiplier, coins)
VALUES
('Leather Vest', 1.10, 50),
('Reinforced Vest', 1.25, 100),
('Steel Chestplate', 1.50, 200),
('Iron Armor', 1.75, 300),
('Logan Paul Vest', 2.00, 500),
('Mike''s Shield', 2.25, 750),  
('Rizz Protector', 2.50, 1000),
('Legendary Ohio Plate', 3.00, 1500);

INSERT INTO BoxerProfile (user_id, username, strength, stamina, level, coins, weapon_id, armor_id, wins, losses)
VALUES
(1, '123', 15, 12, 2, 100, NULL, NULL, 5, 2), -- Boxer 1
(2, 'lol', 18, 14, 3, 200, 1, 2, 10, 1);  -- Boxer 2 with a weapon and armor


INSERT INTO User (username, email, password, skillpoints, created_on, updated_on, last_login_on)
VALUES (
  '123', 
  '123@gmail.com',
  '${hashedPassword}', 
  350, 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP
),('lol', 
  'lol@yahoo.com', 
  '${hashedPassword}', 
  0,  
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP);
  
INSERT INTO Reviews (review_amt, user_id,challenge_id) VALUES
  (5, 1, 1),
  (4, 2, 1),  
  (3, 3, 2);


  INSERT INTO UserCompletion (challenge_id, user_id, completed, notes)
VALUES 
  (1, 1, FALSE, 'Attempted but not completed'),
  (2, 2, TRUE, 'Great performance'),
  (1, 2, FALSE, NULL),
  (2, 3, FALSE, NULL);

`;


pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully:", results);
  }
  process.exit();
});
  }
})
