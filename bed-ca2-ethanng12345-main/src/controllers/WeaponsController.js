// Import the required weapons model
const model = require("../models/WeaponsModel.js");

// Middleware to check if a boxer exists and retrieve their coin balance
module.exports.checkerboxer = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
  };

  // Validate boxer_id
  if (!data.boxer_id) {
    return res.status(400).json({ message: "Error: boxer_id is undefined" });
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Check if the boxer exists
    if (results.length === 0) {
      return res.status(404).send("boxer does not exist");
    }

    // Store the boxer's coin balance in the request object
    req.boxerCoins = results[0].coins;

    // Proceed to the next middleware
    next();
  };

  // Call the model to retrieve the boxer's coin balance
  model.selectcoins1(data, callback);
};

// Middleware to check if a weapon exists and retrieve its coin cost
module.exports.checkerweapon = (req, res, next) => {
  const data = {
    weapon_id: req.body.weapon_id,
  };

  // Validate weapon_id
  if (!data.weapon_id) {
    return res.status(400).json({ message: "Error: weapon_id is undefined" });
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Check if the weapon exists
    if (results.length === 0) {
      return res.status(404).send("weapon does not exist");
    }

    // Store the weapon's coin cost in the request object
    req.weaponCoins = results[0].coins;

    // Proceed to the next middleware
    next();
  };

  // Call the model to retrieve the weapon's coin cost
  model.selectcoins2(data, callback);
};

// Middleware to create a new weapon purchase
module.exports.createNew = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    weapon_id: req.body.weapon_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNew:", error);
      return res.status(500).json(error);
    } else {
      // Respond with success message and details of the purchase
      res.status(200).json({
        message: "Weapon purchased successfully.",
        newCoins: req.newCoins,
        boxer_id: data.boxer_id,
        weapon_id: data.weapon_id,
      });
    }
  };

  // Call the model to insert the new weapon purchase
  model.insert(data, callback);
};

// Middleware to update a boxer's coins and weapon after a purchase
module.exports.updateCoinsAndWeapon = (req, res, next) => {
  // Ensure that the boxer's coins and weapon cost are defined
  if (req.boxerCoins === undefined || req.weaponCoins === undefined) {
    return res.status(400).json({ message: "Missing data: boxerCoins or weaponCoins." });
  }

  // Check if the boxer has enough coins to purchase the weapon
  if (req.boxerCoins < req.weaponCoins) {
    return res.status(400).json({ message: "Not enough coins to buy this weapon." });
  }

  // Calculate the new coin balance
  req.newCoins = req.boxerCoins - req.weaponCoins;

  const data = {
    newCoins: req.newCoins,
    boxer_id: req.params.boxer_id,
    weapon_id: req.body.weapon_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updating BoxerProfile:", error);
      return res.status(500).json({ message: "Internal server error.", error });
    }

    // Check if the update was successful
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Boxer ID not found." });
    }

    // Proceed to the next middleware
    next();
  };

  // Perform the update in the database
  model.updateBycoins(data, callback);
};

// Middleware to fetch all available weapons
module.exports.readAll = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAll:", error);
      res.status(500).json(error);
    } else {
      // Respond with the list of weapons
      
      res.status(200).json(results);
    }
  };

  // Call the model to retrieve all weapons
  model.selectAll(callback);
};

// Middleware to check if a boxer owns a specific weapon
module.exports.checkownership = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    weapon_id: req.body.weapon_id,
  };

  const callback = (error, results, fields) => {
    if (results.length === 0) {
      return res.status(409).send("Error: boxer does not own that weapon");
    }

    // Proceed to the next middleware
    next();
  };

  // Call the model to check weapon ownership
  model.check(data, callback);
};

// Middleware to update a boxer's main weapon
module.exports.updateweapon = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    weapon_id: req.body.weapon_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updating BoxerProfile:", error);
      return res.status(500).json({ message: "Internal server error.", error });
    }

    // Check if the update was successful
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Boxer ID not found." });
    }

    // Respond with success message and the updated weapon ID
    res.status(200).json({
      message: "Weapon of choice updated",
      "new weapon_id": data.weapon_id,
    });
  };

  // Perform the update in the database
  model.updatebyWeapon(data, callback);
};

// Middleware to fetch all weapons owned by a boxer
module.exports.weaponinventorybyid = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error weaponinventorybyid :", error);
      res.status(500).json(error);
    } else {
      // Check if the boxer owns any weapons
      if (results.length === 0) {
        res.status(404).json({
          message: "Boxer has no weapon",
        });
      } else {
        // Respond with the list of weapons owned by the boxer
        res.status(200).json(results);
      }
    }
  };

  // Call the model to retrieve the boxer's weapons
  model.selectById(data, callback);
};
