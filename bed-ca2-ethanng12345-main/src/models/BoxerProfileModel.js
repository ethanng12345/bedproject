// Import the database connection pool
const pool = require('../services/db');

// Fetch skill points for a specific user
module.exports.getSkillPoints = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT skillpoints, username FROM User WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  // Execute the query with the provided user_id
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Deduct skill points for a specific user
module.exports.deductSkillPoints = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User SET skillpoints = ? WHERE user_id = ?;
  `;
  const VALUES = [data.remainder, data.user_id];

  // Execute the query to update the user's skill points
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Create a new boxer profile for a user
module.exports.create = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO BoxerProfile (user_id, strength, stamina, level, username)
    VALUES (?, ?, ?, ?,?);
  `;
  const VALUES = [data.user_id, data.strength, data.stamina, data.level, data.username];

  // Execute the query to insert a new boxer profile
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Fetch the leaderboard of boxers ordered by wins in descending order
module.exports.leaderboard = (callback) => {
  const SQLSTATMENT = `
      SELECT username, wins FROM BoxerProfile ORDER BY wins DESC;
  `;

  // Execute the query to retrieve the leaderboard
  pool.query(SQLSTATMENT, callback);
};

// Update the level, strength, and stamina of a specific boxer
module.exports.updatelevel = (data, callback) => {
  const SQLSTATMENT = `
      UPDATE BoxerProfile 
      SET 
        level = level + ?, 
        strength = strength + ?, 
        stamina = stamina + ?
      WHERE boxer_id = ?;
      SELECT boxer_id, level, strength, stamina
      FROM BoxerProfile
      WHERE boxer_id = ?;
  `;
  const VALUES = [
    data.level, data.strength, data.stamina, data.boxer_id, // For UPDATE
    data.boxer_id, // For SELECT
  ];

  // Execute the query to update and retrieve the updated boxer profile
  pool.query(SQLSTATMENT, VALUES, callback);
};

// Check if a specific user owns a specific boxer
module.exports.check = (data, callback) => {
  const SQLSTATMENT = `
        SELECT *
        FROM BoxerProfile
        WHERE user_id = ? AND boxer_id= ?;
  `;
  const VALUES = [data.user_id, data.boxer_id];

  // Execute the query to check the user's ownership of the boxer
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.deleteboxerId = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM WeaponInventory
    WHERE boxer_id = ?;

    DELETE FROM ArmorInventory
    WHERE boxer_id = ?;

    DELETE FROM BoxerProfile
    WHERE boxer_id = ?;
  `;
  const VALUES = [data.boxer_id, data.boxer_id, data.boxer_id];

  // Execute the query to delete the boxer and associated data
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

// Check if a boxer exist
module.exports.readuser = (data, callback) => {
  const SQLSTATMENT = `
      SELECT * FROM user
      WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  
  pool.query(SQLSTATMENT, VALUES, callback);
};



module.exports.readuserid = (data, callback) => {
  const SQLSTATMENT = `
      SELECT * FROM boxerprofile
      WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  
  pool.query(SQLSTATMENT, VALUES, callback);
};




module.exports.getboxerinfo = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM boxerprofile WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  // Execute the query with the provided user_id
  pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectAllExcept = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM boxerprofile WHERE boxer_id != ?;
  `;
  const VALUES = [data.boxer_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};