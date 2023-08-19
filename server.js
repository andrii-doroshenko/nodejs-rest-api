const mongoose = require("mongoose");
const app = require("./app");

const DB_HOST =
  "mongodb+srv://doroshenkoandrey:mGHrrk6PBq2pt2cs@cluster0.j1kmsez.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err.message);
    process.exit(1);
  });
