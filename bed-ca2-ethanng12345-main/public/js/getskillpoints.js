// Global variable to store the boxer ID; initially set to null.
let boxer_id = null;

// Callback function to handle the response for fetching individual user skillpoints.
const callbackskillpoints = (responseStatus, responseData) => {
   

    // Get the element that displays skillpoints from the DOM.
    const madeByElement = document.getElementById("skillpoint");
    if (madeByElement) {
        // If the response is successful (status 200) and skillpoints data exists,
        // update the text content of the element with the retrieved skillpoints.
        if (responseStatus === 200 && responseData && responseData.skillpoints !== undefined) {
            madeByElement.textContent = `Skillpoints: ${responseData.skillpoints}`;
            console.log("responseData.skillpoints", responseData.skillpoints);
        } else {
            // Fallback text if skillpoints data is not available.
            madeByElement.textContent = "Skillpoints: ?";  // Fallback if no skillpoints are found
            console.log("No skillpoints in response data:", responseData);
        }
    }
};

// Retrieve token from localStorage (assumed to be defined elsewhere).

// Prepare the data (none needed for GET request).

// Make the API call with the GET method to fetch individual user data for skillpoints.
fetchMethod(currentUrl + "/api/users/indiv", callbackskillpoints, "GET", null, token);




// Callback function to handle the response for fetching profile data (level and coins).
const callbacklevel = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    
    // Get the element that displays the level from the DOM.
    const madeByElementlevel = document.getElementById("level");
    if (madeByElementlevel) {
        // If the response is successful (status 200) and contains level data,
        // update the text content with the retrieved level.
        if (responseStatus === 200 && responseData && responseData[0].level !== undefined) {
            madeByElementlevel.textContent = `Level: ${responseData[0].level}`;
            console.log("responseData.level", responseData[0].level);
            // Store the boxer_id from the response, or set it to null if not present.
            boxer_id = responseData[0].boxer_id || null;
            console.log("boxer_id:", boxer_id);
        } else {
            // Fallback text if level data is not available.
            madeByElementlevel.textContent = "level: ?";  // Fallback if no level is found in response data
            console.log("No level in response data:", responseData[0].level);
        }
    }
    // Get the element that displays coins from the DOM.
    const madeByElementcoins = document.getElementById("coins");
    if (madeByElementcoins) {
        // If the response is successful (status 200) and contains coins data,
        // update the text content with the retrieved coins.
        if (responseStatus === 200 && responseData && responseData[0].coins !== undefined) {
            madeByElementcoins.textContent = `Coins: ${responseData[0].coins}`;
            console.log("responseData.coins", responseData[0].coins);
        } else {
            // Fallback text if coins data is not available.
            madeByElementcoins.textContent = "coins: ?";  // Fallback if no coins are found in response data
            console.log("No coins in response data:", responseData[0].coins);
        }
    }
};

// Retrieve token from localStorage (assumed to be defined elsewhere).

// Prepare the data (none needed for GET request).

// Make the API call with the GET method to fetch profile data (level and coins).
fetchMethod(currentUrl + "/api/profile/", callbacklevel, "GET", null, token);



// Add an event listener for the "convert" element click event.
document.getElementById("convert").addEventListener("click", () => {
    // Ask the user for confirmation to convert skill points to level.
    const userConfirmed = confirm("Are you sure you want to convert skill points to level?");
    if (userConfirmed) {
        // Callback function to handle the response for the conversion request.
        const callback = (responseStatus, responseData, responseHeaders) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            
            // If the conversion is successful (status 200), alert the user and reload the page.
            if (responseStatus === 200) {
              alert("Converted successfully!");
                location.reload();
            } else if (responseStatus === 400) {
                // If there's a 400 error, log and display the error message.
                console.log("400 Error Detected", responseData);
                const errorMessage = responseData?.message || "Not enough Skill Points.";
                alert(errorMessage);
            } else {
                // Handle any unexpected response status.
              console.log("Unexpected response status:", responseStatus);
              alert(`Unexpected response: ${responseStatus}`);
            }
          };
  
      // Make the API call with the PUT method to perform the conversion,
      // using the stored boxer_id and token for authorization.
      fetchMethod(`${currentUrl}/api/profile/${boxer_id}`, callback, "PUT", null, token);
    } else {
        // If the user cancels, log the cancellation.
      console.log("User canceled conversion.");
    }
});
