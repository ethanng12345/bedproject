const model = require("../models/reviewModel.js");
const pool = require("../services/db.js");

module.exports.createReview = (req, res, next) => {
    if(req.body.review_amt == undefined)
    {
        res.status(400).send("Error: review_amt is undefined");
        return;
    }
    else if(req.body.review_amt > 5 || req.body.review_amt < 1)
    {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    }
    else if( res.locals.userId == undefined)
    {
        res.status(400).send("Error: user_id is undefined");
        return;
    }

    const data = {
        user_id:  res.locals.userId,
        review_amt: req.body.review_amt,
        challenge_id: req.body.challenge_id
        
    }

  

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createMessage:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);
        }
    }

    model.insertSingle(data, callback);
}

module.exports.readReviewById = (req, res, next) => {
    const data = {
        challenge_id:req.params.challenge_id,
        userIdlol:res.locals.userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else res.status(200).json(results);
        }
    }

    model.selectById(data, callback);
}

module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

module.exports.updateReviewById = (req, res, next) => {
    if(req.body.id == undefined)
    {
        res.status(400).send("Error: id is undefined");
        return;
    }
    else if(req.body.review_amt == undefined)
    {
        res.status(400).send("Error: review_amt is undefined");
        return;
    }
    else if(req.body.review_amt > 5 || req.body.review_amt < 1)
    {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    }
    else if(req.body.user_id == undefined)
    {
        res.status(400).send("Error: userId is undefined");
        return;
    }

    const data = {
        id:req.body.id,
        challenge_id: req.body.challenge_id,
        user_id: req.body.user_id,
        review_amt: req.body.review_amt
    }
    

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            return res.status(500).json({ error: "Internal server error", details: error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }
        res.status(204).send(); // No content
    };

    model.updateById(data, callback);
}

module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.body.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Review not found"
                });
            }
            else
            {
                res.status(204).send();
            }
        }
    }

    model.deleteById(data, callback);
}



// Middleware to check if a challenge record exists
module.exports.checkchallenge = (req, res, next) => {
    const data = {
        challenge_id: req.body.challenge_id
        
    };

    // Callback function to handle database response
    const callback = (error, results, fields) => {
        // If no record is found, send 404 response
        if (results.length == 0) {
            res.status(404).send({message: "challenge does not exist"});
        } else {
            next(); // Proceed to the next middleware or route handler
        }
    };

    // Call model to check the existence of the record
    model.checkchallenge(data, callback);
};



// Middleware to check if a challenge record exists
module.exports.checkreviews = (req, res, next) => {
    const data = {
        challenge_id: req.body.challenge_id,
        user_id: res.locals.userId
        
        
    };
  
    // Callback function to handle database response
    const callback = (error, results, fields) => {
        // If no record is found, send 404 response
        if (results.length == 0) {
            res.status(404).send({message: "user did not attempt this challenge"});
        } else {
            next(); // Proceed to the next middleware or route handler
        }
    };

    // Call model to check the existence of the record
    model.checkreviews(data, callback);
};




module.exports.readUserReviews = (req, res, next) => {
    if (req.params.userid == undefined){
      
        return
    }
    const data = {
        reviewuser_id: req.params.userid,
        user_id: res.locals.userId
    };
 


    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in readUserReviews:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No matching reviews found for this user" });
        }

        res.status(200).json(results);
    };

    // Fetch reviews for the user
    model.verifyUserAndFetchReviews(data, callback);
};

