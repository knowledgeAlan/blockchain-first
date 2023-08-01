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
                const newHash = SHA256(JSON.stringify(self)).toString();
                self.hash = currentHash;
                resolve(currentHash === newHash);
            }catch(err){
                reject(err);
            }
        }); 
    }


    getBData(){
        let self = this;
        return new Promise((resolve, reject) =>{
            let encData = this.body;
            let decData = hex2ascii(encData);
            let decdataInJson = JSON.parse(decData);
            
            if(this.height == 0){
                resolve("This is the genesis block dude");
            }else{
                resolve(decdataInJson);
            }
        });
    }
}

module.exports.Block =Block;