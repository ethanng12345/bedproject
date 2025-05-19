// Import the required model
const model = require("../models/ArmorModel.js");

// Middleware to check if a boxer exists and retrieve their coins
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

    // Check if boxer exists
    if (results.length === 0) {
      return res.status(404).send("boxer does not exist");
    }

    // Store boxer's coins in the request object for further processing
    req.boxerCoins = results[0].coins;

    // Proceed to the next middleware
    next();
  };

  model.selectcoins1(data, callback);
};

// Middleware to check if armor exists and retrieve its coin cost
module.exports.checkerarmor = (req, res, next) => {
  const data = {
    armor_id: req.body.armor_id,
  };

  // Validate armor_id
  if (!data.armor_id) {
    return res.status(400).json({ message: "Error: armor_id is undefined" });
  }

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error in checker:", error);
      return res.status(500).send(error);
    }

    // Check if armor exists
    if (results.length === 0) {
      return res.status(404).send("armor does not exist");
    }

    // Store armor's coin cost in the request object for further processing
    req.armorCoins = results[0].coins;

    // Proceed to the next middleware
    next();
  };

  model.selectcoins2(data, callback);
};

// Middleware to handle the creation of a new armor purchase
module.exports.createNew = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    armor_id: req.body.armor_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error createNew:", error);
      res.status(500).json(error);
    } else {
      res.status(200).json({
        message: "Armor purchased successfully.",
        newCoins: req.newCoins,
        boxer_id: data.boxer_id,
        armor_id: data.armor_id,
      });
    }
  };

  model.insert(data, callback);
};

// Middleware to update a boxer's coins and armor after a purchase
module.exports.updateCoinsAndArmor = (req, res, next) => {
  // Validate required data
  if (req.boxerCoins === undefined || req.armorCoins === undefined) {
    return res.status(400).json({ message: "Missing data: boxerCoins or armorCoins." });
  }

  // Check if boxer has enough coins
  if (req.boxerCoins < req.armorCoins) {
    return res.status(400).json({ message: "Not enough coins to buy this armor" });
  }

  // Calculate the new coin balance
  req.newCoins = req.boxerCoins - req.armorCoins;

  const data = {
    newCoins: req.newCoins,
    boxer_id: req.params.boxer_id,
    armor_id: req.body.armor_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updating BoxerProfile:", error);
      return res.status(500).json({ message: "Internal server error.", error });
    }

    // Check if the update affected any rows
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Boxer ID not found." });
    }

    // Proceed to the next middleware
    next();
  };

  model.updateBycoins(data, callback);
};

// Middleware to fetch all armor records
module.exports.readAll = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAll:", error);
      return res.status(500).json(error);
    } else {
      res.status(200).json(results);
    }
  };

  model.selectAll(callback);
};

// Middleware to check if a boxer owns a specific armor
module.exports.checkownership = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    armor_id: req.body.armor_id,
  };

  const callback = (error, results, fields) => {
    if (results.length === 0) {
      return res.status(409).send("Error: boxer does not own that armor");
    }
    next();
  };

  model.check(data, callback);
};

// Middleware to update a boxer's main armor
module.exports.updatearmor = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
    armor_id: req.body.armor_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error updating BoxerProfile:", error);
      return res.status(500).json({ message: "Internal server error.", error });
    }

    // Check if the update affected any rows
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Boxer ID not found." });
    }

    res.status(200).json({
      message: "Armor of choice updated",
      "new armor_id": data.armor_id,
    });
  };

  model.updatebyArmor(data, callback);
};

// Middleware to fetch all armor owned by a specific boxer
module.exports.armorinventorybyid = (req, res, next) => {
  const data = {
    boxer_id: req.params.boxer_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error armorinventorybyid:", error);
      res.status(500).json(error);
    } else {
      // Check if the boxer has any armor
      if (results.length === 0) {
        res.status(404).json({
          message: "Boxer has no armor",
        });
      } else {
        res.status(200).json(results);
      }
    }
  };

  model.selectById(data, callback);
};
