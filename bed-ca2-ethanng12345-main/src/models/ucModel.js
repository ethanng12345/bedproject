// Import the database connection pool
const pool = require('../services/db');

// Insert a new record into the UserCompletion table
module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO UserCompletion (user_id, completed, creation_date, notes, challenge_id)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.user_id, data.completed, data.creation_date, data.notes, data.challenge_id];

    // Execute the query to insert the new completion record
    pool.query(SQLSTATMENT, VALUES, callback); 
};

// Retrieve user completion records by challenge_id from the UserCompletion table
module.exports.selectById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT user_id, completed, DATE(creation_date) AS creation_date, notes 
        FROM UserCompletion
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    // Execute the query to fetch user completion records for the given challenge
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Check if a specific user is the creator of a specific challenge in the FitnessChallenge table
module.exports.check = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge
        WHERE creator_id = ? AND challenge_id = ?;
    `;
    const VALUES = [data.user_id, data.challenge_id];

    // Execute the query to check if the user is the creator of the challenge
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Retrieve the skillpoints for a specific challenge from the FitnessChallenge table
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT skillpoints FROM FitnessChallenge WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    // Execute the query to fetch skillpoints for the given challenge
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Update the skillpoints for a specific user in the User table
module.exports.points = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.points, data.user_id];

    // Execute the query to update the user's skillpoints
    pool.query(SQLSTATMENT, VALUES, callback);  
};
