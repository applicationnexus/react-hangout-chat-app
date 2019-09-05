const mongoose = require('mongoose');
const config = require('./config');

class MongoDb {
   /**
    * @description Initializes the database connection
    * @returns void
    */
   connect() {
      mongoose.connect(`mongodb://${config.mongodb_url}/${config.mongo_dbname}`, {
         useNewUrlParser: true,
         useFindAndModify: false
      }).then(() => {}).catch(err => {
         console.error('Connection error : ' + err);
      });
   }
}

module.exports = MongoDb;