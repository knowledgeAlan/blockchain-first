const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');



class Block {


    constructor(data){
        this.hash = null;
        this.height = 0;
        this.body = Buffer.from(JSON.stringify(data).toString(), 'hex');
        this.time = 0;
        this.previousBlock = null;
    }


    validate(){
        let self = this;

        return new Promise((resolve, reject) => {
            try {
                const currentHash = self.hash;
                
            }catch(err){
                reject(err);
            }
        }); 
    }


    getBData(){

    }
}

module.exports.Block =Block;