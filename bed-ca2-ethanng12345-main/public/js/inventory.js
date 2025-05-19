// Global variable to store the boxer ID (note: boxer_id1 is declared but not used, while boxer_id is used later)
let boxer_id1 = null;

// -----------------------------------------------------------------------------
// Callback function to get the boxer_id from the profile API response
// -----------------------------------------------------------------------------
const callbacklevel1 = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // Check if the response is successful (status 200) and contains a valid boxer_id in the first element of the response array
    if (responseStatus === 200 && responseData && responseData[0].boxer_id !== undefined) {
        // Assign the boxer_id from the response; if undefined, default to null
        boxer_id = responseData[0].boxer_id || null;
        console.log("boxer_id:", boxer_id);
        
        // With the boxer_id obtained, call functions to fetch armor and weapons data
        fetchArmor(boxer_id);
        fetchWeapons(boxer_id); // Fetch weapons data
    } else {
        console.log("error");
    }
};

// -----------------------------------------------------------------------------
// First fetch call to get the profile data which includes boxer_id
// -----------------------------------------------------------------------------
fetchMethod(currentUrl + "/api/profile/", callbacklevel1, "GET", null, token);

// -----------------------------------------------------------------------------
// Callback function to handle the armor data API response
// -----------------------------------------------------------------------------
const callbackArmor = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  // Get the DOM element with the ID 'armor' where armor items will be displayed
  const armorList = document.getElementById("armor");

  // Iterate over each armor item in the response data array
  responseData.forEach((armor) => {
    // Create a new div element for each armor item
    const displayItem = document.createElement("div");
    displayItem.className = "col-md-4"; // Use Bootstrap grid class for layout


    // Set the innerHTML of the displayItem using a template literal, including the armor image, name, shield multiplier, and a button to select as main
    displayItem.innerHTML = `
      <div class="card inventory-card">
        <img src="https://ethanng12345.github.io/image/${armor.name}.webp">
        <div class="card-body">
          <h5 class="card-title">${armor.name}</h5>
          <p class="card-text">Shield Multiplier: ${armor.hp_multiplier}</p>
          <button class="btn btn-main" onclick="selectAsMain('armor', ${armor.armor_id})">Select as Main</button>
        </div>
      </div>
    `;

    // Append the constructed displayItem to the armorList element in the DOM
    armorList.appendChild(displayItem);
  });
};

// -----------------------------------------------------------------------------
// Function to fetch armor data for a given boxer_id using the API
// -----------------------------------------------------------------------------
function fetchArmor(boxer_id) {
  fetchMethod(`${currentUrl}/api/armor/${boxer_id}`, callbackArmor, "GET");
}

// -----------------------------------------------------------------------------
// Callback function to handle the weapon data API response
// -----------------------------------------------------------------------------
const callbackweapon = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  // Get the DOM element with the ID 'weapon' where weapon items will be displayed
  const weaponList = document.getElementById("weapon");
  
  // Iterate over each weapon in the response data array
  responseData.forEach((weapon) => {
    // Create a new div element for each weapon item
    const displayItem = document.createElement("div");
    displayItem.className = "col-md-4";
    
    // Set the innerHTML of the displayItem with weapon details including image, name, damage multiplier, and a button to select as main
    displayItem.innerHTML = `
      <div class="card inventory-card">
        <img src="https://ethanng12345.github.io/image/${weapon.name}.webp">
        <div class="card-body">
          <h5 class="card-title">${weapon.name}</h5>
          <p class="card-text">Damage Multiplier: ${weapon.damage_multiplier}</p>
          <button class="btn btn-main" onclick="selectAsMain('weapon', ${weapon.weapon_id})">Select as Main</button>
        </div>
      </div>
    `;

    // Append the weapon display item to the weaponList element in the DOM
    weaponList.appendChild(displayItem);
  });
};

// -----------------------------------------------------------------------------
// Function to fetch weapon data for a given boxer_id using the API
// -----------------------------------------------------------------------------
function fetchWeapons(boxer_id) {
  fetchMethod(`${currentUrl}/api/weapon/${boxer_id}`, callbackweapon, "GET");
}

// -----------------------------------------------------------------------------
// Function to handle the selection of an item (armor or weapon) as the main item
// -----------------------------------------------------------------------------
function selectAsMain(type, itemId) {
  // Prepare the data object dynamically based on the type parameter (armor or weapon)
  const data = {
    [`${type}_id`]: itemId, // This will create a property like 'armor_id' or 'weapon_id'
  };

  // Send a PUT request to update the main item for the profile using the boxer_id
  fetchMethod(`${currentUrl}/api/${type}/updateprofile/${boxer_id}`, (responseStatus, responseData) => {
    if (responseStatus === 200) {
      alert(`${type} has been updated!`);
    } else {
      alert(`Error selecting ${type} as main.`);
    }
  }, "PUT", data);
}
