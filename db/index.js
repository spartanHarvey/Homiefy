
const mongoose = require('mongoose');
const config = require('../config')
const database_url = config.database_url;
const test_database_url = config.test_database_url;


function connect(){
    
    return new Promise((resolve, reject) =>{
        

        if(process.env.NODE_ENV === 'test'){

            
            mongoose.connect(test_database_url, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,poolSize:10})
            .then((result,err) =>{
                
                if(err) return reject(err);
                resolve(result);
                console.log("connected to test database")
            })

            

        }else{
            mongoose.connect(database_url, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
            .then((result,err) =>{
                
                if(err) return reject(err);
                console.log("connected to database")
                resolve(result);
            })
        }
    });
    
}
function close(){
    
    return mongoose.disconnect();
}

async function dropDB(){

    const collections = await mongoose.connection.db.collections()
      
    for (let collection of collections) {
      await collection.deleteOne()
    }
}

module.exports = {connect, close, dropDB};

