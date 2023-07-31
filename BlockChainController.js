
class BlockChainController{



    constructor(app,blockchainObj){
        this.app = app;
        this.blockChain = blockchainObj;
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
    }


    getBlockByHeight(){
        this.app.get("/block/height/:height",async (req,res) => {
            

            if(req.params.height){
                const height = parseInt(req.params.height);
                let block = await this.blockChain.getBlockByHeight(height);
                if(block){
                    return res.status(200).json(block);
                }else{
                    return res.status(400).send({message:"Block not found"});
                }
                
            }else{
                return res.status(404).send({message:"Block not found ! Review the parameters !!!"});
            }
        });
    }

    requestOwnership(){
        this.app.post("/requestValidation",async (req,res)=>{

            if(req.body.address){
                const address = req.body.address;
                const message = await this.blockChain.requestMessageOwnershipVerification(address);
                if(message){
                    return res.status(200).json(message);
                }else{
                    return res.status(500).send("Ann eeor happened!");
                }
            }else{
                return res.status(500).send("Check the body Parameter !");
            }

        });
    }

    submitStar(){
        this.app.post("/submitStar",async (req,res)=>{

            if(req.body.address&&req.body.message && req.body.signature && req.body.star){
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
    
                const star = req.body.start;
    
                try{
    
                    let block = await this.blockChain.submitStar(address, message, signature,star);
                    if(block){
                        return res.status(200).json(block);
                    }else{
                        return res.status(500).send("An error happened !");
                    }
                }catch(error){
                    return res.status(500).send(error);
                }
            }else{
                return res.status(500).send("Check the body parameter !!");
            }

           
        });
    }


    getBlockByHash(){
        this.app.get("/block/hash/:hash",async (req,res)=>{

            const hash = req.params.hash;
            if(hash){
                let block = await this.blockChain.getBlockByHash(hash);

                if(block){
                    return res.status(200).json(block);
                }else{
                    return res.status(404).send("Block not found!!");
                }
            }else{
                return res.status(400).send("Block nont found ! Review the parameters !");
            }

           
        });
    }


    getStarsByOwner() {
        this.app.get("/block/:address",async (req,res)=>{
            if(req.params.address){
                const address = req.params.address;
                try{

                    let stars = await this.blockChain.getStarsByWalletAddress(address);

                    if(stars){
                        return res.status(200).json(stars);
                    }else{
                        return res.status(404).send("Block not found!!");
                    }
                }catch(error){
                    return res.status(500).send("An error happened !");
                }
                
            }else{
                return res.status(500).send("Block not found ! Review the parameters !!");
            }
        });
    }
}


module.exports = (app,blockchainObj) => {return new BlockChainController(app,blockchainObj);};