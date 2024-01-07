 const mongoose = require('mongoose');

// Replace 'your_database_name' with the name of your MongoDB database
const databaseUrl = 'mongodb+srv://LukeObornik:r5OlVamFOkELDwuC@ecommercesite.n8mi41j.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(databaseUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;