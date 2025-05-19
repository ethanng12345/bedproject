// Import the database connection pool
const pool = require('../services/db');

// Retrieve all users from the User table
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
        SELECT * FROM User;
    `;

    // Execute the query to fetch all users
    pool.query(SQLSTATMENT, callback);
};

// Retrieve a specific user by their ID from the User table
module.exports.selectById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    // Execute the query to fetch the user with the given ID
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Insert a new user into the User table and fetch the inserted record
module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO User (username, skillpoints)
        VALUES (?, 0);
        SELECT user_id, username, skillpoints FROM User
        WHERE user_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.username];

    // Execute the query to insert a new user and retrieve their details
    pool.query(SQLSTATMENT, VALUES, callback); 
};

// Update a specific user's information by their ID in the User table
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE User 
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.skillpoints, data.user_id];

    // Execute the query to update the user's information
    pool.query(SQLSTATMENT, VALUES, callback);  
};

// Check if a username exists in the User table
module.exports.check = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM User
        WHERE username = ?;
    `;
    const VALUES = [data.username];

    // Execute the query to check if the username exists
    pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.verify = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM User WHERE username = ? OR email = ?
        `;
    const VALUES = [data.username, data.email];
    
    pool.query(SQLSTATMENT, VALUES, callback);  
    }

    module.exports.insert = (data, callback) =>
        {
            const SQLSTATMENT = `
           INSERT INTO User (username, email, password)
            VALUES (?, ? ,?);
            SELECT * FROM USER WHERE user_id = LAST_INSERT_ID()
            `;
        const VALUES = [data.username, data.email,data.hash];
        
        pool.query(SQLSTATMENT, VALUES, callback);  
        }
    
        module.exports.verify2 = (data, callback) =>
            {
                const SQLSTATMENT = `
                SELECT * FROM User WHERE username = ?
                `;
            const VALUES = [data.username, data.password];
            
            pool.query(SQLSTATMENT, VALUES, callback);  
            }