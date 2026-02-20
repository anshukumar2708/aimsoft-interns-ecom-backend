const app = require("./app");
const ConnectDb = require("./config/db");

const PORT = process.env.PORT || 8000

const StartServer = async () => {
    try {
        await ConnectDb();
        await app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("Error starting server:", error);
    }
}


StartServer();