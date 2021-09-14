require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL_LOCAL, {
    useNewUrlParser: true,
})
.then(()=> console.log("Connected to MongoDB!"))
.catch(err => console.error("MongoDB connection Failed!!"));

const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`App running on poprt ${port}!`);
})