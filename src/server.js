require("dotenv").config();

const app = require("./app");

const connectDatabase = require("./config/connectDatabase");
const validateEnv = require("./config/validateEnv");

validateEnv();

connectDatabase();

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});