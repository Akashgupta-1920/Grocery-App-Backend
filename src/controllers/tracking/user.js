import { Customer, DeliveryPartner } from "../../models/user.js";

export const updateUser = async (req ,reply)=> {
  try {
    const {userId} = req.user;
    const updateUser = req.body;

    let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

    if(!user){
      return reply.status(403).send({message:"User not Found"})
    }

    let UserModel;

    if(user.role == "Customer"){
      UserModel = Customer;
    }else if(user.role == "DeliveryPartner"){
      UserModel = DeliveryPartner;
    }else {
      return reply.status(400).send({message: "Invaild user role"})
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
     userId,
     { $set: updateData },
     { new: true,runVaildators : true }
    );

    if(!updatedUser){
      return reply.status(403).send({message: "User not found"})
    }

    return reply.send({
      message:"User Updated Successfully",
      user: updatedUser
    })
  } catch (error) {
    return reply.status(500).send({message:"An error occurred", error})
  }
}