import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();


const port = process.env.PORT || 5020;
app.listen(port, function(){
    console.log("Server started on port " + port);
})