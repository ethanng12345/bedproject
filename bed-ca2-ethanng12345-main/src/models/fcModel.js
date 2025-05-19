// Import the database connection pool
const pool = require('../services/db');

// Insert a single fitness challenge into the FitnessChallenge table
module.exports.insertSinglelol = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge, data.user_id, data.skillpoints];

    // Execute the query to insert the new fitness challenge
    pool.query(SQLSTATMENT, VALUES, callback); 
};

// Retrieve all fitness challenges from the FitnessChallenge table
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge;
    `;

    // Execute the query to fetch all fitness challenges
    pool.query(SQLSTATMENT, callback);
};

// Update a fitness challenge by its ID
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE FitnessChallenge 
        SET challenge = ?, creator_id = ?, skillpoints = ?
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge, data.user_id, data.skillpoints, data.challenge_id];

    // Execute the query to update the specified fitness challenge
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Delete a fitness challenge by its ID
module.exports.deleteById = (data, callback) => {
    const SQLSTATMENT = `
        DELETE FROM FitnessChallenge 
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    // Execute the query to delete the specified fitness challenge
    pool.query(SQLSTATMENT, VALUES, callback);   
};



// Retrieve a specific user by their ID from the User table
module.exports.getcreatorid = (data, callback) => {
    const SQLSTATMENT = `
        SELECT creator_id FROM fitnesschallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    // Execute the query to fetch the user with the given ID
    pool.query(SQLSTATMENT, VALUES, callback);  
};

