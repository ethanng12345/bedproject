const token = localStorage.getItem("token");

// Wait for the DOM content to fully load before executing the following code
document.addEventListener("DOMContentLoaded", function () {
  // Define a callback function to handle the response from the verify API request
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData); // Log the entire response for debugging

    // Check if the response status indicates that the user is not authorized (HTTP 401)
    if (responseStatus === 401) {
      // Retrieve the authentication block element from the DOM
      const authBlock = document.getElementById("auth-block");
      // Remove the 'd-none' class to display the authentication block
      authBlock.classList.remove("d-none");
    }
  };

  // Perform the verification request using the fetchMethod function
  // Sends a POST request to the /api/verify endpoint with the token for authorization
  fetchMethod(currentUrl + "/api/verify", callback, "POST", null, token);
});
