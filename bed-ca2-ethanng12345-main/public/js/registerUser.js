// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the signup form and warning message elements in the DOM
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  // Add an event listener for the signup form submission
  signupForm.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Retrieve input values from the signup form fields
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Perform signup logic: Check if the password and confirmation match
    if (password === confirmPassword) {
      // Passwords match; proceed with the signup process
      console.log("Signup successful");
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      // Hide the warning card if it was previously shown
      warningCard.classList.add("d-none");

      // Prepare the data object with user credentials for the signup API request
      const data = {
        username: username,
        email: email,
        password: password,
      };

      // Define a callback function to handle the response from the signup API
      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          // Check if the response includes a token indicating successful signup
          if (responseData.token) {
            // Store the received token in local storage for future authentication
            localStorage.setItem("token", responseData.token);
            // After signup, create a boxer profile for the user
            createBoxerProfile();
          }
        } else {
          // If signup fails, show the warning card with the error message from the response
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };

      // Make the signup API request using the fetchMethod function (assumed to be defined elsewhere)
      fetchMethod(currentUrl + "/api/register", callback, "POST", data);

      // Reset the form fields after submission
      signupForm.reset();
    } else {
      // If passwords do not match, show an error message
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});

// Function to create a boxer profile after successful signup
function createBoxerProfile() {
  // Define a callback function to handle the response from the boxer profile API
  const boxerProfileCallback = (responseStatus, responseData) => {
    console.log("Boxer Profile Response:", responseStatus, responseData);
    if (responseStatus === 200) {
      // If the profile creation is successful, log a message and redirect to the profile page
      console.log("Boxer profile successfully created!");
      window.location.href = "profile.html";  // Redirect user
    } else {
      // If profile creation fails, log the error message
      console.error("Failed to create boxer profile:", responseData.message);
    }
  };
  
  // Retrieve the stored token from local storage for authorization
  const token = localStorage.getItem("token");

  // Make the API request to create the boxer profile using the fetchMethod function
  fetchMethod(currentUrl + "/api/profile", boxerProfileCallback, "POST", null, token);
}
