import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";


export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession)

export const sessionStore = new MongoDBStore({
  uri:process.env.MONGO_URL,
  collection:"sessions"
});

sessionStore.on('error',(error)=> {
  console.log("Session Store error");
})

export const authenticate = async(email,password)=> {
  if(email == 'guptaakash1511@gmail.com' && password == 12121212){
    return Promise.resolve({email:email, password: password});

  } else {
    return null
  }

  //UNCOMMENT THIS WHEN CREATED ADMIN MANUALLY
  //  if(email && password){
  //   const user = await Admin.findOne({email});
  //   if(!user){
  //     return null
  //   }
  //   if(user.password==password){
  //     return Promise.resolve({email:email, password:password});

  //   }else{
  //     return null;
  //   }
  //  }
}