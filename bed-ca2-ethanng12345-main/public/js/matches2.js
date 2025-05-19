let boxer_id2 = null; // Variable to store the second boxer ID from local storage

let boxer_id1 = null; // Variable to store the first boxer ID retrieved from the profile API

// Callback function to verify and retrieve the boxer ID from the profile API response
const callbackverify = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    // Check if the response is successful (status 200) and contains a valid boxer_id in the first element
    if (responseStatus === 200 && responseData && responseData[0].boxer_id !== undefined) {
        boxer_id1 = responseData[0].boxer_id || null; // Update boxer_id1 with the retrieved value or null if undefined
    } else {
        console.log("error"); // Log an error if the response does not meet the expected criteria
    }
};

// First API call: Fetch the profile data to retrieve the boxer ID
fetchMethod(currentUrl + "/api/profile/", callbackverify, "GET", null, token);

// Event listener that runs when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the selected boxer ID and username from local storage
    const selectedBoxerId = localStorage.getItem('selectedBoxerId');
    const selectedUsername = localStorage.getItem('selectedBoxerusername');
    
    // If a boxer has been selected, update the UI accordingly
    if (selectedBoxerId) {
        boxer_id2 = selectedBoxerId; // Set boxer_id2 to the retrieved selected boxer ID
        boxer_id2user = selectedUsername; // Store the selected username in a variable
        
        // Update the text of UI elements to show the names of the boxers
        document.getElementById('boxer1').innerText = "You";
        document.getElementById('boxer2').innerText = boxer_id2user;
    } else {
        console.log("No boxer selected."); // Log if no boxer is selected
    }
});

// Function to start the fight simulation
function startFight() {
    // Display the loading spinner to indicate that the fight is in progress
    document.getElementById('loadingSpinner').style.display = 'block';

    // Simulate a delay for the fight (1 second)
    setTimeout(() => {
        // Prepare the data object with the IDs of both boxers for the fight request
        const data = {
            boxer1_id: boxer_id1,
            boxer2_id: boxer_id2
        };

        // Callback function to handle the match result response
        const callbackmatch = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            
            // Check if the response is successful (status 200) and contains match data
            if (responseStatus === 200 && responseData !== undefined) {
                // Hide the loading spinner and the boxing ring, then display the battle result
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('boxingRing').style.display = 'none';
                document.getElementById('battleResult').style.display = 'block';
                
                // Determine the winner based on the response data and update the UI accordingly
                if (responseData.winner.boxer_id == boxer_id1) {
                    document.getElementById('winner').innerText = ` You won!`;
                    document.getElementById('coinss').innerText = ` earned ${responseData.winner.coins_earned}`;
                } else {
                    document.getElementById('winner').innerText = ` ${responseData.winner.username} wins!`;
                    document.getElementById('coinss').innerText = ` lost ${responseData.loser.coins_lost}`;
                }
            } else {
                console.log("error"); // Log an error if the response is not as expected
            }
        };
  
        // Make the API call to simulate the match using a POST request with the provided data
        fetchMethod(currentUrl + "/api/matches/", callbackmatch, "POST", data);
        
    }, 1000); // Simulated delay of 1 second for the fight
}
