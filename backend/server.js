const express = require("express")
const mongoose = require("mongoose")
const app = express();
const cors = require("cors")
const dotenv = require('dotenv')
dotenv.config();
const userRoutes = require("./routes/User")
const options = {
    origin: "http://localhost:3000",
    useSucessStatus: 200
}
app.use(express.json())
mongoose.connect(process.env.DATABASE_STRING, {
    useNewUrlParser: true
})
    .then(() => console.log("sucessfully connected"))
    .catch((err) => console.log("not connected", err))
const PORT = process.env.PORT || 8000
app.use(cors(options));
app.use('/', userRoutes)
app.listen(PORT, () => {
    console.log(`sever is running at ${PORT}....`)
})