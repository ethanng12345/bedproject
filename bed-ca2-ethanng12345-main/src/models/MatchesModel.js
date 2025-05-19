// Import the database connection pool
const pool = require('../services/db');

// Check if two boxers exist in the BoxerProfile table
module.exports.check = (data, callback) => {
    const SQLSTATMENT = `
        SELECT *
        FROM boxerprofile
        WHERE boxer_id IN (?, ?);
    `;
    const VALUES = [data.boxer1_id, data.boxer2_id];

    // Execute the query to check the existence of the two boxers
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Insert a match result into the Matches table
module.exports.results = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO Matches (boxer1_id, boxer2_id, winner_id, coins_earned)
        VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.boxer1_id, data.boxer2_id, data.winner_id, data.coins_earned];

    // Execute the query to insert the match result
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Update the coins for both the winner and loser in the BoxerProfile table
module.exports.updateBoxerCoins = (data, callback) => {
    const SQL = `
        UPDATE BoxerProfile
        SET coins = CASE
            WHEN boxer_id = ? THEN coins + ? -- Winner gains coins
            WHEN boxer_id = ? THEN coins + ? -- Loser loses coins
        END
        WHERE boxer_id IN (?, ?);
    `;
    const VALUES = [
        data.winner_id, data.coins_earned, // Winner
        data.loser_id, data.coins_lost,   // Loser
        data.winner_id, data.loser_id    // Both boxer IDs
    ];

    // Execute the query to update the coins for both boxers
    pool.query(SQL, VALUES, callback);
};

// Update the win and loss records for both the winner and loser in the BoxerProfile table
module.exports.updateBoxerProfile = (data, callback) => {
    const SQL = `
        UPDATE BoxerProfile
        SET wins = CASE 
            WHEN boxer_id = ? THEN wins + 1 -- Winner gains a win
            ELSE wins 
        END,
        losses = CASE 
            WHEN boxer_id = ? THEN losses + 1 -- Loser gains a loss
            ELSE losses 
        END
        WHERE boxer_id IN (?, ?);
    `;
    const VALUES = [
        data.winner_id, // Winner's ID for wins
        data.loser_id,  // Loser's ID for losses
        data.winner_id, data.loser_id // Both boxer IDs
    ];

    // Execute the query to update the win and loss records
    pool.query(SQL, VALUES, callback);
};

// Retrieve equipment multipliers (damage and health) for two boxers' weapons and armor
module.exports.getEquipmentMultipliers = (data, callback) => {
    const SQLSTATMENT = `
        SELECT damage_multiplier 
        FROM weapons
        WHERE weapon_id IN (?, ?);
        
        SELECT hp_multiplier 
        FROM armor
        WHERE armor_id IN (?, ?);
    `;
    const VALUES = [data.weapon1, data.weapon2, data.armor1, data.armor2];

    // Execute the query to retrieve the equipment multipliers
    pool.query(SQLSTATMENT, VALUES, callback);
};


module.exports.getMatchesByBoxerID = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Matches
    WHERE boxer1_id = ? OR boxer2_id = ?;
  `;
  const VALUES = [data.boxer_id, data.boxer_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Check if a boxer exist
module.exports.readboxer = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM boxerprofile
        WHERE boxer_id = ?;
    `;
    const VALUES = [data.boxer_id];

    
    pool.query(SQLSTATMENT, VALUES, callback);
};
