import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
export const arcjetProtection = async(req , res , next)=>{
    try{
        const decision  = await aj.protect(req);
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                  return res.status(429).json({message:"Ratelimit exceeded"});
            }
            else if(decision.reason.isBot()){
                   return res.status(403).json({message: "Bot access deneid"});
            }
            else{
                    return req.status(403).json({message:"Denied"});
            }
        }
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error:"Spoofed bot detected" , 
                message:"Malicious bot activity",
            });
        }
        next();
    }
    catch(error){
        console.log("Arcjet failure", error);
        next();
    }
     
}