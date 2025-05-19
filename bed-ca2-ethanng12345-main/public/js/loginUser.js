document.addEventListener("DOMContentLoaded", function () {
  // Wait for the DOM to fully load before executing the following code

  // Define the callback function to handle the server response after attempting to log in
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData); // Log the entire response for debugging

    // Check if the response status indicates success (HTTP 200)
    if (responseStatus === 200) {
      // Check if the response data contains a token, indicating a successful login
      if (responseData.token) {
        // Store the token in local storage for future use (e.g., for authenticated requests)
        localStorage.setItem("token", responseData.token);

        // Redirect the user to the profile page after successful login
        window.location.href = "profile.html";
      }
    } else {
      // If the login was not successful, display the warning card with an error message
      warningCard.classList.remove("d-none");
      warningText.innerText = responseData.message || "An error occurred.";
    }
  };

  // Get references to the login form and warning message elements from the DOM
  const loginForm = document.getElementById("loginForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  // Add an event listener to handle form submission on the login form
  loginForm.addEventListener("submit", function (event) {
    console.log("Submitting login form...");
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve the username and password values from the form inputs
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Create a data object containing the login credentials
    const data = {
      username: username,
      password: password,
    };

    // Log the login data for debugging purposes
    console.log("Login data:", data);

    // Perform the login request using the fetchMethod function
    // The function sends a POST request to the API endpoint for login
    fetchMethod(currentUrl + "/api/login", callback, "POST", data);

    // Reset the form fields after submission
    loginForm.reset();
  });
});
