// Global variable to store the selected challenge's ID
let challengeId = null; // Initialize challengeId as null to store the selected challenge's ID

// -----------------------------------------------------------------------------
// Function to fetch challenges from the server and render them in the challenge list
// -----------------------------------------------------------------------------
const callback = (responseStatus, responseData) => {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  // Get the element that will contain the list of challenges
  const challengeList = document.getElementById("challenge-list");
  if (!challengeList) {
    console.error("Element with ID 'challenge-list' not found.");
    return;
  }

  // Clear the challenge list content
  challengeList.innerHTML = "";

  // Validate responseData: it must exist and be an array
  if (!responseData || !Array.isArray(responseData)) {
    console.error("Invalid responseData:", responseData);
    challengeList.innerHTML = "<li>Error loading challenges.</li>";
    return;
  }

  // Iterate through each challenge in the responseData
  responseData.forEach((challenge) => {
    // Create a list item element for each challenge
    const listItem = document.createElement("li");
    listItem.className = "mb-3";
    listItem.style.listStyle = "none";

    // Set the inner HTML of the list item with challenge details
    listItem.innerHTML = `
      <div class="card shadow-sm w-100 challenge-card" data-challenge-id="${challenge.id}" data-user-id="${challenge.user_id}" data-skillpoints="${challenge.skillpoints}">
        <div class="card-body">
          <h5 class="card-title">${challenge.challenge}</h5>
          <p class="card-text">
            <strong>Skill Points:</strong> ${challenge.skillpoints}
          </p>
        </div>
      </div>
    `;
    
    // Add a click event listener to the challenge card
    listItem.querySelector(".challenge-card").addEventListener("click", () => {
      // Set the global challengeId variable using challenge.challenge_id
      challengeId = challenge.challenge_id;
      // Get the creator's user ID from the challenge data
      const userId = challenge.creator_id;
      

      // Update the skill points element with the challenge's skill points
      const skillPoints = challenge.skillpoints;
      const skillpointsElement = document.getElementById("skillpoints");
      if (skillpointsElement) skillpointsElement.textContent = skillPoints;

      // Fetch and display user data for the challenge creator
      getUserData(userId, challengeId);
    });

    // Append the list item to the challenge list
    challengeList.appendChild(listItem);
  });
  
  // Automatically select and click the first challenge card if available
  if (responseData.length > 0) {
    const firstChallengeCard = challengeList.querySelector(".challenge-card");
    if (firstChallengeCard) {
      firstChallengeCard.click();
    }
  }
};

// Fetch challenges using the fetchMethod function with the constructed URL and callback
fetchMethod(`${currentUrl}/api/challenges`, callback);

// -----------------------------------------------------------------------------
// Function to fetch user data for the creator of a challenge
// -----------------------------------------------------------------------------
function getUserData(userId, challengeId) {
  const callback = (status, userData) => {
    // Update the 'made-by' element with the username of the challenge creator
    const madeByElement = document.getElementById("made-by");
    if (madeByElement) {
      madeByElement.textContent = status === 200 && userData ? userData.username : "Unknown";
    }
    // After fetching user data, fetch the reviews for the selected challenge
    getReviews(challengeId);
  };

  // Fetch user data using the fetchMethod function
  fetchMethod(`${currentUrl}/api/users/${userId}`, callback);
}

// -----------------------------------------------------------------------------
// Helper function to generate star ratings based on review amount
// -----------------------------------------------------------------------------
function generateStars(reviewAmt) {
  return Array.from({ length: 5 })
    .map((_, i) => (i < reviewAmt ? "★" : "☆"))
    .join("");
}

// -----------------------------------------------------------------------------
// Helper function to fetch the username of a reviewer by userId
// Returns a Promise that resolves with the username or "Unknown"
// -----------------------------------------------------------------------------
function fetchUsername(userId) {
  return new Promise((resolve) => {
    fetchMethod(`${currentUrl}/api/users/${userId}`, (status, userData) => {
      if (status === 200 && userData) {
        resolve(userData.username);
      } else {
        resolve("Unknown");
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Function to check if the current user is authorized to edit or delete a review
// -----------------------------------------------------------------------------
function checkReviewPermissions(reviewItem, displayItem) {
  const verifyCallback = (responseStatus, responseData) => {
    console.log("verify responseStatus:", responseStatus);
    console.log("verify responseData:", responseData);

    // If authorization is successful, add edit and delete buttons to the review card
    if (responseStatus === 200) {
      addEditDeleteButtons(reviewItem, displayItem);
    } else {
      console.log("User not authorized to edit/delete review.");
    }
  };

  // Send a verification request using fetchMethod to check review permissions
  fetchMethod(`${currentUrl}/api/review/verify/${reviewItem.user_id}`, verifyCallback, "GET", null, token);
}

// -----------------------------------------------------------------------------
// Function to add edit and delete buttons to a review card if the user is authorized
// -----------------------------------------------------------------------------
function addEditDeleteButtons(reviewItem, displayItem) {
  // Create the Delete Review button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Review";
  deleteButton.className = "btn btn-danger mt-2";
  
  // Add event listener for the delete button click event
  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this review?")) {
      
      deleteFunction(reviewItem, displayItem); // Call delete function
    }
  });

  // Append the delete button to the card body
  displayItem.querySelector(".card-body").appendChild(deleteButton);

  // Create the Edit Review button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit Review";
  editButton.className = "btn btn-primary mt-2 ms-2";

  // Add event listener for the edit button click event
  editButton.addEventListener("click", () => {
    
    updateFunction(reviewItem, displayItem); // Call update function
  });

  // Append the edit button to the card body
  displayItem.querySelector(".card-body").appendChild(editButton);
}

// -----------------------------------------------------------------------------
// Function to render reviews on the page using review data with usernames
// -----------------------------------------------------------------------------
function renderReviews(reviewsWithUsernames) {
  const reviewList = document.getElementById("review-list");
  if (!reviewList) {
    console.error("Element with ID 'review-list' not found.");
    return;
  }

  // Clear any existing reviews
  reviewList.innerHTML = "";

  // For each review, create a display element and append it to the review list
  reviewsWithUsernames.forEach((reviewItem) => {
    const displayItem = document.createElement("div");
    displayItem.className = "col-xl-12 col-lg-12 col-md-4 col-sm-6 col-xs-12 p-3";
    displayItem.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">User: ${reviewItem.username}</h5>
          <p class="card-text">
            Rating: ${generateStars(reviewItem.review_amt)}
          </p>
        </div>
      </div>
    `;

    // Check if the user has permission to edit or delete the review
    checkReviewPermissions(reviewItem, displayItem);
    reviewList.appendChild(displayItem);
  });
}

// -----------------------------------------------------------------------------
// Main callback function to handle the reviews API response
// -----------------------------------------------------------------------------
function reviewsCallback(responseStatus, responseData) {
  console.log("responseStatus:", responseStatus);
  console.log("responseData:", responseData);

  const reviewList = document.getElementById("review-list");
  if (!reviewList) {
    console.error("Element with ID 'review-list' not found.");
    return;
  }

  // Validate the response data
  if (!responseData || (typeof responseData !== "object" && !Array.isArray(responseData))) {
    console.error("Invalid responseData:", responseData);
    return;
  }

  // Normalize responseData into an array of reviews
  const reviews = Array.isArray(responseData) ? responseData : [responseData];
  if (responseStatus === 404) {
   
    reviewList.innerHTML = "";
    return; // Exit if there are no reviews
  }

  // Fetch usernames for each review and add them to the review data
  Promise.all(
    reviews.map((reviewItem) =>
      fetchUsername(reviewItem.user_id).then((username) => ({ ...reviewItem, username }))
    )
  ).then((reviewsWithUsernames) => {
    renderReviews(reviewsWithUsernames);
  });
}

// -----------------------------------------------------------------------------
// Function to fetch reviews for the selected challenge
// -----------------------------------------------------------------------------
function getReviews(challengeId) {
  fetchMethod(`${currentUrl}/api/review/${challengeId}`, reviewsCallback);
}

// -----------------------------------------------------------------------------
// Function to delete a review
// -----------------------------------------------------------------------------
function deleteFunction(reviewItem, reviewElement) {


  // Callback function to handle the delete response
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData); // Log the entire response for debugging
  
    if (responseStatus === 204) {
      alert("Review deleted successfully!");
      console.log("Review deleted successfully");
      reviewElement.remove(); // Remove the review element from the DOM
    } else {
      console.error("Failed to delete review:", responseData); // Log error if delete fails
      alert("Failed to delete review. Please try again.");
    }
  };
  
  // Data to be sent in the DELETE request
  const data = {
    challenge_id: reviewItem.challenge_id,
    id: reviewItem.id,
  };
  
  // Perform DELETE request to delete the review
  fetchMethod(`${currentUrl}/api/review/`, callback, "DELETE", data, token);
}

// -----------------------------------------------------------------------------
// Event listener for saving a challenge form once the DOM content is loaded
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the user ID from local storage
  const user_id = localStorage.getItem("user_id");


  // Callback function to handle the challenge creation response
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    if (responseStatus === 201) {
      alert("Challenge created successfully!"); // Show success message
      // createForm.reset(); // Reset form on success (commented out in code)
      location.reload(); // Reload the page to update challenges
    } else {
      warningCard.classList.remove("d-none"); // Show warning card if error
      warningText.innerText = responseData.message || "An error occurred."; // Display error message
    }
  };

  // Handle Save Challenge form submission
  document.getElementById("challengeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values from the challenge form
    const completed = document.getElementById("completedChallenge").value; // Convert value to number (1 or 0)
    const notes = document.getElementById("challengeNotes").value;
   
    
    // Validate form inputs
    if (!completed || !notes) {
      warningCard2.classList.remove("d-none"); // Show warning if validation fails
      warningText2.innerText = "All fields are required.";
      return;
    }

    // Get today's date in ISO format (YYYY-MM-DD)
    const creationDate = new Date().toISOString().split('T')[0];

    // Create a data object for the new challenge
    const data = {
      completed: parseInt(completed, 10),
      notes: notes, // Notes provided by the user
      creation_date: creationDate
    };

    // Send POST request to create the challenge
    fetchMethod(`${currentUrl}/api/usercompletion/${challengeId}`, callback, "POST", data, token);
    event.reset()
  });
});

// -----------------------------------------------------------------------------
// Function to update (edit) a review
// -----------------------------------------------------------------------------
function updateFunction(reviewItem, displayItem) {
  // Check if an edit form already exists to avoid duplicates
  if (displayItem.querySelector(".edit-review-form")) {
    console.log("Edit form already exists.");
    return;
  }

  // Create and configure the edit review form
  const form = document.createElement("form");
  form.className = "edit-review-form mt-3";
  form.innerHTML = `
      <div class="mb-3">
          <label for="ratingInput" class="form-label">Update Rating</label>
          <select id="ratingInput" class="form-select">
              <option value="1" ${reviewItem.rating === 1 ? "selected" : ""}>1</option>
              <option value="2" ${reviewItem.rating === 2 ? "selected" : ""}>2</option>
              <option value="3" ${reviewItem.rating === 3 ? "selected" : ""}>3</option>
              <option value="4" ${reviewItem.rating === 4 ? "selected" : ""}>4</option>
              <option value="5" ${reviewItem.rating === 5 ? "selected" : ""}>5</option>
          </select>
      </div>
      <button type="submit" class="btn btn-success">Save</button>
      <button type="button" class="btn btn-secondary ms-2 cancel-edit">Cancel</button>
  `;
  // Append the edit form to the card body
  displayItem.querySelector(".card-body").appendChild(form);

  // Callback function to handle the update response
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData); // Log the entire response for debugging

    if (responseStatus === 204) {
      console.log("Review updated successfully");
      // Update the reviewItem object with the new rating value
      reviewItem.rating = parseInt(document.getElementById("ratingInput").value, 10);
      form.remove(); // Remove the edit form after submission
      alert("Rating updated successfully!"); // Notify the user
      location.reload(); 
    } else {
      console.error("Failed to update review:", responseData); // Log error if update fails
      alert("Failed to update review. Please try again.");
    }
  };

  // Handle the edit form submission for updating the review
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedRating = parseInt(document.getElementById("ratingInput").value, 10); // Get the updated rating
    const data = {
      id: reviewItem.id,
      challenge_id: reviewItem.challenge_id,
      user_id: reviewItem.user_id,
      review_amt: updatedRating, // Updated rating value
    };

    // Send PUT request to update the review
    fetchMethod(`${currentUrl}/api/review/`, callback, "PUT", data, token);
  });

  // Handle cancel button click: remove the edit form
  form.querySelector(".cancel-edit").addEventListener("click", () => {
    form.remove(); // Remove the form if cancel is clicked
  });
}

// -----------------------------------------------------------------------------
// Event listener for saving a review form once the DOM content is loaded
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
 

  // Callback function to handle the review creation response
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    if (responseStatus === 201) {
      alert("review successfully successfully!");
      reviewForm.reset(); // Reset the review form on success
      location.reload(); // Reload the page to update challenges
    } else {
      warningCardrev.classList.remove("d-none");
      warningTextrev.innerText = responseData.message || "An error occurred.";
      console.log("Warning Card:", warningCardrev);
      console.log("Warning Text:", warningTextrev);
    }
  };

  // Get references to the review form elements
  const reviewForm = document.getElementById("reviewForm");
  const warningCardrev = document.getElementById("warningCardrev"); // Warning card element for reviews
  const warningTextrev = document.getElementById("warningTextrev"); // Warning text element for reviews
  const submitReview = document.getElementById("submit-review");

  // Handle the Save Review button click event
  submitReview.addEventListener("click", function (event) {
    event.preventDefault();

    // Get the review rating input value
    const reviewRating = document.getElementById("reviewRating").value;

    // Validate the review input
    if (!reviewRating) {
      warningCardrev.classList.remove("d-none");
      warningTextrev.innerText = "All fields are required.";
      return;
    }
    
    // Create a data object for the new review
    const data = {
      review_amt: reviewRating,
      challenge_id: challengeId
    };

    // Send POST request to create the review
    fetchMethod(`${currentUrl}/api/review/`, callback, "POST", data, token);
  });

  // Reset the review form and hide warnings when the review modal is closed
  const reviewModal = document.getElementById("writeReviewModal");
  reviewModal.addEventListener("hide.bs.modal", function () {
    reviewForm.reset(); // Reset the form fields
    warningCardrev.classList.add("d-none"); // Hide the warning card
    warningTextrev.innerText = ""; // Clear warning text
  });
});
