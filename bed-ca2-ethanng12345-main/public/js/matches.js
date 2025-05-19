// Define a variable to hold the boxer ID (note: boxer_id1 is declared but not used later)
let boxer_id1 = null; // Define the variable

// Callback function to verify and retrieve the boxer_id from the profile API response
const callbackverify1 = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // Check if the response is successful, responseData is an array, and it contains a valid boxer_id
    if (responseStatus === 200 && Array.isArray(responseData) && responseData.length > 0 && responseData[0].boxer_id !== undefined) {
        // Update the boxer_id variable with the retrieved boxer_id from the response data
        boxer_id = responseData[0].boxer_id; // Update the variable
        console.log("Retrieved boxer_id:", boxer_id1);

        // Now that boxer_id is updated, make the second API call to fetch additional boxer data
        fetchBoxers();
    } else {
        console.log("Error: Unable to fetch boxer_id");
    }
};

// First API call: Get boxer_id from the profile endpoint
fetchMethod(currentUrl + "/api/profile/", callbackverify1, "GET", null, token);

// Function to fetch detailed boxer data using the retrieved boxer_id
const fetchBoxers = () => {
    // If boxer_id is not null, ensure it's converted to a number
    if (boxer_id !== null) {
        boxer_id = Number(boxer_id); // Convert to number
    }

    // Define a callback function to handle the response for fetching boxers
    const callbackboxer = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        
        // Populate the UI with the boxer data received from the API
        populateBoxers(responseData);
    };

    // Now that boxer_id is a number, fetch all boxers associated with this boxer_id
    fetchMethod(`${currentUrl}/api/profile/all/${boxer_id}`, callbackboxer, "GET");
};

// Function to populate the UI with boxer data
const populateBoxers = (responseData) => {
    // Get the DOM element where the list of boxers will be displayed
    const boxerList = document.getElementById('boxer-list');
    
    // Iterate over each boxer in the response data array
    responseData.forEach(boxer => {
      // Create a new div element to represent an individual boxer card
      const boxerCard = document.createElement('div');
      // Add Bootstrap classes and a custom class for styling the boxer card
      boxerCard.classList.add('list-group-item', 'boxer-card');
      // Set data attributes with boxer details for later use
      boxerCard.dataset.id = boxer.boxer_id;
      boxerCard.dataset.username = boxer.username;
      boxerCard.dataset.level = boxer.level;
      boxerCard.dataset.strength = boxer.strength;
      boxerCard.dataset.stamina = boxer.stamina;
      boxerCard.dataset.wins = boxer.wins;
      boxerCard.dataset.losses = boxer.losses;
      // Set the text content of the card to display the boxer's name
      boxerCard.textContent = `boxer Name: ${boxer.username}`;
  
      // Add an event listener for click events on the boxer card
      boxerCard.addEventListener('click', () => {
        // Retrieve the boxer ID from the card's data attributes
        const boxerId = boxerCard.dataset.id;
        // Store the selected boxer ID and username in local storage for future use
        localStorage.setItem('selectedBoxerId', boxerId);
        localStorage.setItem('selectedBoxerusername', boxer.username);
        // Update the UI to display the selected boxer's name
        document.getElementById('boxer-name').textContent = `Boxer Name: ${boxer.username}`;
        document.getElementById('boxer-level').textContent = boxer.level;
        document.getElementById('boxer-strength').textContent = boxer.strength;
        document.getElementById('boxer-stamina').textContent = boxer.stamina;
        // Update the UI with wins and losses (if they exist in the response)
        document.getElementById('boxer-wins').textContent = boxer.wins;
        document.getElementById('boxer-losses').textContent = boxer.losses;
  
        // Enable the "Next" button to proceed after selecting a boxer
        document.getElementById('next-btn').disabled = false;
      });
  
      // Append the boxer card to the boxer list element in the DOM
      boxerList.appendChild(boxerCard);
    });
};

// Event listener for the "Next" button click event
document.getElementById('next-btn').addEventListener('click', () => {
    // Alert the user that the next step (battle) is starting
    alert("Next step: Battle starts!");
    // Redirect the user to the boxing match page
    window.location.href = 'boxingmatch.html';
});
