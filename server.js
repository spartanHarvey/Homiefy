const config = require('./config')
const db = require('./db/index')
const app = require('./app')







    return new Promise((resolve, reject) =>{
        

            db.connect()
            .then((result,err) =>{
                
                if(err) return reject(err);
                // console.log(result.connection)
                app.listen(config.port, () => {
                    console.log(`listening on port ${config.port}`)
                })
                        
              
            
                resolve(result);
            })

        
    });
    
  