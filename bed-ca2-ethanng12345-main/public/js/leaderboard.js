const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // Access the 'Leaderboard' array from responseData.
    // It is assumed that the API response includes an object with a property 'Leaderboard' containing the data.
    const leaderboard = responseData.Leaderboard;

    // Target the leaderboard body (table body element) for inserting rows.
    const leaderboardBody = document.getElementById("leaderboardBody");

    // Clear previous table rows (optional, useful for reloading data).
    leaderboardBody.innerHTML = '';

    // Loop through the 'Leaderboard' array (assuming it's an array of boxer objects).
    leaderboard.forEach((boxer, index) => {
        // Create a new table row element.
        const row = document.createElement('tr');

        // Insert the boxer data into the row.
        // 'index + 1' is used for ranking since array indexes start at 0.
        row.innerHTML = `
            <td>${index + 1}</td> <!-- Ranking -->
            <td>${boxer.username}</td> <!-- Boxer ID (Player Name) -->
            <td>${boxer.wins}</td> <!-- Wins -->
        `;

        // Append the row to the leaderboard body.
        leaderboardBody.appendChild(row);
    });
};


// The fetchMethod function is used to perform the API call to retrieve the leaderboard data.
fetchMethod(currentUrl + "/api/profile/leaderboard", callback);
