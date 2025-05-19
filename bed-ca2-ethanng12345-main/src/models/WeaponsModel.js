// Import the database connection pool
const pool = require('../services/db');

// Retrieve the coins of a specific boxer from the BoxerProfile table
module.exports.selectcoins1 = (data, callback) => {
    const SQLSTATMENT = `
        SELECT coins FROM BoxerProfile WHERE boxer_id = ?;
    `;
    const VALUES = [data.boxer_id];

    // Execute the query to fetch the boxer's coins
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Retrieve the coin cost of a specific weapon from the Weapons table
module.exports.selectcoins2 = (data, callback) => {
    const SQLSTATMENT = `
        SELECT coins FROM Weapons WHERE weapon_id = ?;
    `;
    const VALUES = [data.weapon_id];

    // Execute the query to fetch the weapon's coins
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Update the coins and weapon_id of a specific boxer in the BoxerProfile table
module.exports.updateBycoins = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE BoxerProfile SET coins = ?, weapon_id = ? WHERE boxer_id = ?;
    `;
    const VALUES = [data.newCoins, data.weapon_id, data.boxer_id];

    // Execute the query to update the boxer's coins and weapon
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Retrieve all weapons from the Weapons table, ordered by weapon_id
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
        SELECT * FROM Weapons ORDER BY weapon_id ASC;
    `;

    // Execute the query to fetch all weapons
    pool.query(SQLSTATMENT, callback);
};

// Insert a new entry into the WeaponInventory table for a boxer
module.exports.insert = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO WeaponInventory (boxer_id, weapon_id)
        VALUES (?, ?);
    `;
    const VALUES = [data.boxer_id, data.weapon_id];

    // Execute the query to insert a new weapon inventory record
    pool.query(SQLSTATMENT, VALUES, callback); 
};

// Update the weapon_id of a specific boxer in the BoxerProfile table
module.exports.updatebyWeapon = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE BoxerProfile SET weapon_id = ? WHERE boxer_id = ?;
    `;
    const VALUES = [data.weapon_id, data.boxer_id];

    // Execute the query to update the boxer's weapon
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Check if a specific boxer owns a specific weapon in the WeaponInventory table
module.exports.check = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM WeaponInventory
        WHERE boxer_id = ? AND weapon_id = ?;
    `;
    const VALUES = [data.boxer_id, data.weapon_id];

    // Execute the query to check ownership of the weapon
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Retrieve all weapon IDs owned by a specific boxer from the WeaponInventory table
module.exports.selectById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT w.weapon_id, w.name, w.damage_multiplier, w.coins
        FROM weaponInventory wi
        INNER JOIN weapons w ON wi.weapon_id = w.weapon_id
        WHERE wi.boxer_id = ?;
    `;
    const VALUES = [data.boxer_id];

    // Execute the query to fetch weapon details for the boxer
    pool.query(SQLSTATMENT, VALUES, callback);  
};



// module.exports.selectById = (data, callback) => {
//     const SQLSTATMENT = `
//         SELECT weapon_id FROM weaponinventory
//         WHERE boxer_id = ?;
//     `;
//     const VALUES = [data.boxer_id];

//     // Execute the query to fetch weapon IDs for the boxer
//     pool.query(SQLSTATMENT, VALUES, callback);  
// };
