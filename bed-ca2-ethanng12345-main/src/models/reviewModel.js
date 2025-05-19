const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Reviews;
    `;

    pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Reviews
    WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Reviews (review_amt, user_id,challenge_id)
    VALUES (?, ?,?);
    `;
    const VALUES = [data.review_amt, data.user_id, data.challenge_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Reviews 
    SET review_amt = ?, user_id = ?
    WHERE id = ?;
    `;
    const VALUES = [data.review_amt, data.user_id,data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM Reviews 
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATMENT, VALUES, callback);
}



// see if challenge exist
module.exports.checkchallenge = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    // Execute the query to check if the user is the creator of the challenge
    pool.query(SQLSTATMENT, VALUES, callback);
};


// see if challenge exist
module.exports.checkreviews = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM usercompletion
        WHERE user_id = ? AND challenge_id = ?;
    `;
    const VALUES = [data.user_id,data.challenge_id];

    // Execute the query to check if the user is the creator of the challenge
    pool.query(SQLSTATMENT, VALUES, callback);
};

// Verify if the user_id in the reviews table matches the user_id in the user table
module.exports.verifyUserAndFetchReviews = (data, callback) => {
    const SQLSTATMENT = `
      SELECT r.*
      FROM reviews r
      INNER JOIN User u ON r.user_id = u.user_id
      WHERE r.user_id = ? AND u.user_id = ?;
    `;
    const VALUES = [data.reviewuser_id, data.user_id];
  
    // Execute the query to fetch reviews if user IDs match
    pool.query(SQLSTATMENT, VALUES, callback);
  };
  