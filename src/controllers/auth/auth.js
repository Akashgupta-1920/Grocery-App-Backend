import {DeliveryPartner, Customer} from "../../models/user";
import jwt from 'jsonwebtoken';


const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {userId: user._id,role:user.role},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'1d'}
  )
  const refreshToken = jwt.sign(
    {userId: user._id,role:user.role},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'7d'}
  )
  
  return{accessToken,refreshToken}
}

export const loginCustomer = async(req,reply)=> {
  try {
    const {phone} = req.body;
    let customer = await Customer.findOne({phone});
    if(!customer){
      customer = new Customer ({
        phone,
        role:"customer",
        isActivated:true
      })
    }

    const {accessToken,refreshToken} = generateTokens(customer)
    return reply.send({
      message:"Login Successful",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
   return reply.status(500).send({ message: "An error occurred" , error})
  }
}

export const loginDeliveryPartner = async(req,reply)=> {
  try {
    const {email,password} = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({email});

    if(!deliveryPartner){
      return reply.status(404).send({message:"Delivery Partner Not Found"});
    }

    const isMatch = password == deliveryPartner.password;

    if(!isMatch){
      return reply.status(404).send({message:"Invalid Credentials"});
    }

    const {accessToken,refreshToken} = generateTokens(deliveryPartner);

    return reply.send({
      message:"Login Successful",
      accessToken,
      refreshToken,
      deliveryPartner,
    })
  } catch (error) {
    return reply.status(500).send({message: "An error occurred"})
  }
}