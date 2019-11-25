const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}

module.exports =  connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost/merngraphql', options);
        console.log(">>> DB is connected! <<<");
    } catch (err) {
        console.log("Error connecting DB: ", err);
    }
}