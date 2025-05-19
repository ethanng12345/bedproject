// Import the database connection pool
const pool = require('../services/db');

// Function to select coins for a specific boxer from the BoxerProfile table
module.exports.selectcoins1 = (data, callback) => {
    const SQLSTATMENT = `
        SELECT coins FROM BoxerProfile WHERE boxer_id = ?;
    `;
    const VALUES = [data.boxer_id];

    // Execute the query with the provided boxer_id
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Function to select coins for a specific armor from the Armor table
module.exports.selectcoins2 = (data, callback) => {
    const SQLSTATMENT = `
        SELECT coins FROM Armor WHERE armor_id = ?;
    `;
    const VALUES = [data.armor_id];

    // Execute the query with the provided armor_id
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Function to update the coins and armor_id for a specific boxer in the BoxerProfile table
module.exports.updateBycoins = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE BoxerProfile SET coins = ?, armor_id = ? WHERE boxer_id = ?;
    `;
    const VALUES = [data.newCoins, data.armor_id, data.boxer_id];

    // Execute the update query with the provided data
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Function to retrieve all armors from the Armor table, ordered by armor_id
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
        SELECT * FROM Armor ORDER BY armor_id ASC;
    `;

    // Execute the query to fetch all armors
    pool.query(SQLSTATMENT, callback);
};

// Function to insert a new entry into the ArmorInventory table
module.exports.insert = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO ArmorInventory (boxer_id, armor_id)
        VALUES (?, ?);
    `;
    const VALUES = [data.boxer_id, data.armor_id];

    // Execute the insertion query with the provided data
    pool.query(SQLSTATMENT, VALUES, callback); 
};

// Function to update the armor_id for a specific boxer in the BoxerProfile table
module.exports.updatebyArmor = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE BoxerProfile SET armor_id = ? WHERE boxer_id = ?;
    `;
    const VALUES = [data.armor_id, data.boxer_id];

    // Execute the update query with the provided data
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Function to check if a specific boxer owns a specific armor in the ArmorInventory table
module.exports.check = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM ArmorInventory
        WHERE boxer_id = ? AND armor_id = ?;
    `;
    const VALUES = [data.boxer_id, data.armor_id];

    // Execute the query to check ownership
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Function to retrieve all armor_ids owned by a specific boxer from the ArmorInventory table
module.exports.selectById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT a.armor_id, a.name, a.hp_multiplier, a.coins FROM armorinventory ai
        INNER JOIN armor a ON ai.armor_id = a.armor_id
        WHERE ai.boxer_id = ?;
    `;
    const VALUES = [data.boxer_id];

    // Execute the query to fetch armor IDs for the boxer
    pool.query(SQLSTATMENT, VALUES, callback);  
};

