document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("token");

  // Callback function to handle server responses after attempting to create a challenge
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // If the challenge creation is successful (HTTP status 201)
    if (responseStatus === 201) {
      alert("Challenge created successfully!");
      createForm.reset(); // Reset the form inputs on success
      location.reload(); // Reload the page to update the challenge list
    } else {
      // If there's an error, display the warning message
      warningCard.classList.remove("d-none");
      warningText.innerText = responseData.message || "An error occurred.";
    }
  };

  // Get references to the form elements for creating a challenge
  const createForm = document.getElementById("create-challenge-form");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");
  const saveChallengeButton = document.getElementById("save-challenge-button");

  // Add an event listener for when the Save Challenge button is clicked
  saveChallengeButton.addEventListener("click", function (event) {
    console.log("Save Challenge Button Clicked");
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve the input values from the form fields
    const challenge = document.getElementById("challenge-name").value;
    const skillpoints = document.getElementById("skill-points").value;
    
    // Validate that both the challenge name and skill points are provided
    if (!challenge || !skillpoints) {
      warningCard.classList.remove("d-none");
      warningText.innerText = "All fields are required.";
      return;
    }
    
    // Create a data object with the input values to send in the POST request
    const data = {
      challenge: challenge,
      skillpoints: skillpoints,
    };

    // Send a POST request to create the challenge using the fetchMethod function
    fetchMethod(`${currentUrl}/api/challenges`, callback, "POST", data, token);
  });
});
