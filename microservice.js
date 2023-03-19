const express = require("express");
const axios = require("axios");

const app = express();

// Define an API endpoint that retrieves data from an external API
app.get("/data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = response.data;
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
