const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block');

class Blockchain {

    constructor(){
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    async initializeChain(){
        if(this.height === -1){
            let block = new BlockClass.Block({data:"Gensis Block"});
            await this._addBlock(block);
        }
    }

    getChainHeight(){
        return new Promise((resolve, reject) =>{
            resolve(this.height);
        });
    }

    _addBlock(block) {
        let self = this;
        return new Promise(async(resolve, reject) =>{

            block.height = self.chain.length;
            block.time = new Date().getTime().toString().slice(0,-3);
            if(self.chain.length > 0){
                block.previousBlockHash = self.chain[self.chain.length -1].hash;
            }

            block.hash = SHA256(JSON.stringify(block)).toString();
            console.log("validation of chain starts here");


            let errors = await self.validateChain();
            
            console.log("errors: " + errors);

            console.log("validation of chain ends");


            if(errors.length === 0){

                self.chain.push(block);
                self.height++;
                resolve(block);
            }else{
                reject(errors);
            }

        });
    }

    requestMessageOwnnershipVerification(address){
        return new Promise((resolve)=>{

            let date = new Date().getTime().toString().slice(0,-3);
            const ownerShipMessage = `${address}:${date}:starRegistry`;
            resolve(ownerShipMessage);
        });
    }

    submitStart(address,message,signature,star){
        let self = this;
        return new Promise(async (resolve, reject)=>{
            
            let temps = parseInt(message.split(":")[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0,-3));

            if(currentTime - temps < (5*60)){
                if(bitcoinMessge.verify(message,address,signature)){
                    let block = new BlockClass.Block({"owner":address,"star":star});
                    self._addBlock(block);
                }else{
                    reject(Error("Message is not verified"))
                }
            }else{
                reject(Error("too much time has passed ,stay below 5 minutes"));
            }
        });
    }


    getBlockByHash(hash){
        let self = this;
        return new Promise((resolve,reject)=>{

            const block = self.chain.filter(block => block.hash === hash);

            if(typeof block != "undefined"){
                resolve(block);
            }else{
                reject(Error("No block with hash"));
            }
        })
    }


    getBlockByHeight(height){
        let self = this;

        return new Promise((resolve,reject)=>{
            let block = self.chain.filter(p=> p.height=== height)[0];

            if(block){
                resolve(block);
            }else{
                resolve(null);
            }
        });
    }


    getStarsByWalletAddress(address){
        let self = this;
        let stars = [];
        return new Promise((resolve,reject)=>{

            self.chain.forEach(async(b) =>{
                let data = await b.getData();

                if(data){
                    if(data.owner === address){
                        stars.push(data);
                    }
                }
            })

            resolve(stars);
        });
    }


    validateChain(){
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve,reject)=>{


            let validatePromoises = [];

            self.chain.forEach((block,index) =>{
                if(block.height > 0){
                    const previousBlock = self.chain[indiex - 1];
                    if(block.previousBlockHash !== previousBlock.hash){
                        const errorMessage = `Block ${index} previousBlockHash set to ${block.previousBlcokHash},but actual previous block hash was ${previousBlock.hash}`;
                        errorLog.push(errorMessage);
                    }
                }

                validatePromises.push(block.validate());
            });

            Promises.all(validatePromoises)
                    .then(validatedBlocks =>{
                        validatedBlocks.forEach((valid,index) =>{

                            if(!valid){
                                const invalidBlock = self.chain[index];
                                const errorMessage = `Block ${index} hash (${invalidBlock.hash}) is invalid`;
                                errorLog.push(errorMessage);
                            }
                        })

                        resolve(errorLog);
                    });
        });

    }
}

module.exports.Blockchain = Blockchain;