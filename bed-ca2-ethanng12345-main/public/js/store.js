// Define global variables to store selected armor and weapon IDs
let armor_id = null;
let weapon_id = null;

// -----------------------------------------------------------------------------
// Callback function for handling armor data from the API
// -----------------------------------------------------------------------------
function callbackArmor(responseStatus, responseData) {
  // Get the DOM element that will hold the list of armor items
  const armorList = document.getElementById("armorList");

  // Iterate over each armor object in the response data array
  responseData.forEach(armor => {
    // Create a new list item element for each armor
    const displayItem = document.createElement("li");
    // Set the list item's ID to a lowercase version of the armor name without spaces
    displayItem.id = armor.name.toLowerCase().replace(" ", "");
    // Set the text content to the armor's name
    displayItem.textContent = armor.name;
    // Set an onclick event to handle selection of the armor item
    displayItem.onclick = function () {
      // Update the global armor_id variable with the selected armor's ID
      armor_id = armor.armor_id || null;
      // Construct the image URL using the GitHub raw image URL pattern
      const imageUrl = `https://ethanng12345.github.io/image/${armor.name}.webp`;
      
      // Call the selectArmor function to update the UI with the selected armor's details
      selectArmor(armor.name, imageUrl, armor.hp_multiplier, armor.coins);
    };
    // Append the created list item to the armor list in the DOM
    armorList.appendChild(displayItem);
  });

  // Automatically select and display the first armor if the response data is not empty
  if (responseData.length > 0) {
    const firstArmor = responseData[0];
    const firstImageUrl = `https://ethanng12345.github.io/image/${firstArmor.name}.webp`;
    selectArmor(firstArmor.name, firstImageUrl, firstArmor.hp_multiplier, firstArmor.coins);
  }
}

// -----------------------------------------------------------------------------
// Function to update the UI with the selected armor details
// -----------------------------------------------------------------------------
function selectArmor(title, image, multiplier, coins) {
  // Update the armor title in the UI
  document.getElementById('armorTitle').textContent = title;
  // Update the armor image source in the UI
  document.getElementById('armorImage').src = image;
  // Update the armor multiplier text in the UI
  document.getElementById('armorMultiplier').textContent = "Armor Multiplier: " + multiplier;
  // Update the armor coins text in the UI
  document.getElementById('armorcoins').textContent = "Coins: " + coins;

  // Remove the 'active' class from all armor list items
  const items = document.querySelectorAll('.armor-list li');
  items.forEach(item => item.classList.remove('active'));
  // Add the 'active' class to the selected armor list item based on its ID
  document.getElementById(title.toLowerCase().replace(' ', '')).classList.add('active');
}

// Fetch armor data from the API and handle it with callbackArmor
fetchMethod(currentUrl + "/api/armor", callbackArmor);

  
// -----------------------------------------------------------------------------
// Callback function for handling weapon data from the API
// -----------------------------------------------------------------------------
function callbackWeapon(responseStatus, responseData) {
  // Get the DOM element that will hold the list of weapon items
  const weaponList = document.getElementById("weaponList");

  // Iterate over each weapon object in the response data array
  responseData.forEach(weapon => {
    // Create a new list item element for each weapon
    const displayItem = document.createElement("li");
    // Set the list item's ID to a lowercase version of the weapon name without spaces
    displayItem.id = weapon.name.toLowerCase().replace(" ", "");
    // Set the text content to the weapon's name
    displayItem.textContent = weapon.name;
    // Set an onclick event to handle selection of the weapon item
    displayItem.onclick = function () {
      // Update the global weapon_id variable with the selected weapon's ID
      weapon_id = weapon.weapon_id || null;
      // Construct the image URL using the GitHub raw image URL pattern
      const imageUrl = `https://ethanng12345.github.io/image/${weapon.name}.webp`;

      // Call the selectWeapon function to update the UI with the selected weapon's details
      selectWeapon(weapon.name, imageUrl, weapon.damage_multiplier, weapon.coins);
    };
    // Append the created list item to the weapon list in the DOM
    weaponList.appendChild(displayItem);
  });

  // Automatically select and display the first weapon if the response data is not empty
  if (responseData.length > 0) {
    const firstWeapon = responseData[0];
    const firstImageUrl = `https://ethanng12345.github.io/image/${firstWeapon.name}.webp`;
    selectWeapon(firstWeapon.name, firstImageUrl, firstWeapon.damage_multiplier, firstWeapon.coins);
  }
}

// -----------------------------------------------------------------------------
// Function to update the UI with the selected weapon details
// -----------------------------------------------------------------------------
function selectWeapon(title, image, attackPower, coins) {
  // Update the weapon title in the UI
  document.getElementById('weaponTitle').textContent = title;
  // Update the weapon image source in the UI
  document.getElementById('weaponImage').src = image;
  // Update the weapon attack power text in the UI
  document.getElementById('weaponAttack').textContent = "Attack Power: " + attackPower;
  // Update the weapon coins text in the UI
  document.getElementById('weaponcoins').textContent = "Coins: " + coins;
  
  // Remove the 'active' class from all weapon list items
  const items = document.querySelectorAll('.weapon-list li');
  items.forEach(item => item.classList.remove('active'));
  // Add the 'active' class to the selected weapon list item based on its ID
  document.getElementById(title.toLowerCase().replace(' ', '')).classList.add('active');
}

// Fetch weapon data from the API and handle it with callbackWeapon
fetchMethod(currentUrl + "/api/weapon", callbackWeapon);

  
// -----------------------------------------------------------------------------
// Callback function to handle the response from purchasing armor
// -----------------------------------------------------------------------------
function callbackArmorPurchase(responseStatus, responseData) {
  // If the purchase is successful, notify the user
  if (responseStatus === 200) {
    alert("Armor purchased successfully!");
    location.reload();
  } else {
    // If the purchase fails (e.g., not enough coins), notify the user
    alert("Not enough coins to purchase!");
  }
}

// Attach an event listener to the "Buy Armor" button for purchasing armor
document.getElementById('buyArmorButton').addEventListener('click', function (event) {
  // Prevent the default button behavior
  event.preventDefault();

  // Check if the boxer_id is available (assumed to be defined elsewhere)
  if (!boxer_id) {
    alert("Boxer ID is not available.");
    return;
  }

  // Prepare the data object with the selected armor's ID
  const data = {
    armor_id: armor_id, // The ID of the selected armor
  };

  // Send a PUT request to the API to purchase the selected armor
  fetchMethod(`${currentUrl}/api/armor/${boxer_id}`, callbackArmorPurchase, "PUT", data, token);
});

// -----------------------------------------------------------------------------
// Callback function to handle the response from purchasing a weapon
// -----------------------------------------------------------------------------
function callbackWeaponPurchase(responseStatus, responseData) {
  // If the purchase is successful, notify the user
  if (responseStatus === 200) {
    alert("Weapon purchased successfully!");
    location.reload();
  } else {
    // If the purchase fails (e.g., not enough coins), notify the user
    alert("Not enough coins to purchase!");
  }
}

// Attach an event listener to the "Buy Weapon" button for purchasing a weapon
document.getElementById('buyWeaponButton').addEventListener('click', function (event) {
  // Prevent the default button behavior
  event.preventDefault();

  // Check if the boxer_id is available (assumed to be defined elsewhere)
  if (!boxer_id) {
    alert("Boxer ID is not available!");
    return;
  }

  // Prepare the data object with the selected weapon's ID
  const data = {
    weapon_id: weapon_id, // The ID of the selected weapon
  };

  // Send a PUT request to the API to purchase the selected weapon
  fetchMethod(`${currentUrl}/api/weapon/${boxer_id}`, callbackWeaponPurchase, "PUT", data);
}
);
