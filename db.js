// const dotenv = require("dotenv")
// dotenv.config()
// const mongodb = require("mongodb")

// mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
//   if (err) {
//     console.log(err)
//   }
//   module.exports = client
//   const app = require("./app")
//   app.listen(process.env.PORT)
// })

const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");

mongodb.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    if (err) {
      console.error("Failed to connect to the database. Error:", err);
      process.exit(1); // Exit the process with an error code
    }
    console.log("Connected to MongoDB successfully");

    module.exports = client;

    const app = require("./app");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  }
);
