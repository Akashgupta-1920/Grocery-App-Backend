 import Branch from '../../models/branch.js'
 import Order from '../../models/order.js';
import { Customer, DeliveryPartner } from '../../models/user.js';

 export const createOrder = async(req , reply) => {
  try {
    const {userId} = req.user;
    const { items, branch, totalPrice} = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);
    
    if(!customerData){
          return reply.status(404).send({message:"Customer Not Found", error})
    }

    const newOrder = new Order({
      customer:userId,
      items:items.map((item)=> ({
        id:item.id,
        item:item.item,
        count:item.count
      })),
      branch,
      totalPrice,
      deliveryLocation:{
        longitude: customerData.liveLocation.longitude,
        latitude: customerData.liveLocation.latitude,
        address: customerData.address || "No Address is given"
      },
      pickupLocation:{
        longitude: branchData.liveLocation.longitude,
        latitude: branchData.liveLocation.latitude,
        address: branchData.address || "No Address is given"
      },
    });

    const savedOrder = await newOrder.save()
    return reply.status(201).send(savedOrder)

  } catch (error) {

          return reply.status(500).send({message:"Failed to create order", error})
    
  }
 }

 export const confirmOrder = async(req , reply) => {
  try {
    const {orderId}= req.params;
    const {userId }= req.user;
    const {deliveryPersonLocation} = req.body;
    
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if(!deliveryPerson){
          return reply.status(404).send({message:"DeliveryPerson not found", error})
    }
    const order = await Order.findById(userId);
    if(!order){
          return reply.status(404).send({message:"Orderx not found", error})
    }
    if(order.status != "available"){
          return reply.status(404).send({message:"DeliveryPerson not found", error})
    }

    order.status = "available";
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude:deliveryPersonLocation?.latitude,
      longitude:deliveryPersonLocation?.longitude,
      address:deliveryPersonLocation.address || "",
    }
    req.server.io.to(orderId).emit('orderConfirmed',order);
    await order.save()

    return reply.send(order)

  } catch (error) {

    return reply.status(500).send({message:"Faild to confirm the order", error})    
  }
 }

 export const updateOrderStatus = async(req , reply) => {
  try {
     const {orderId}= req.params;
     const {deliveryPersonLocation, status} = req.body;
    const { userIdf }= req.user;
    
    const deliveryPerson = await DeliveryPartner.findById(userId)
    if(!deliveryPerson){
      return reply.status(404).send({message:"delivery person not found", error})
    }

    const order = await Order.findById(userId);
    if(!order){
      return reply.status(404).send({message :"order Not fund"})
    }

    if(["cancelled", "delivered"].includes(order.status)){
      return reply.status(400).send({message:"Order connot be updated"})
    }
    if(order.deliveryPartner.toString() !== userId){
      return reply.status(403).send({message:"Unautherized"})
    }
    
    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();

    req.server.io.to(orderId).emit("liveTrackingUpdates", order)
    return reply.send(order)

  } catch (error) {
    return reply.status(500).send({message:"Failed to update order", error})
  }
 }

 export const getOrders = async(req, reply)=> {
  try {
    const {status, customerId, deliveryPartnerId, branchId} = req.body;
    let query = {};

    if(status){
      query.status= status;
    }
    if(customerId){
      query.customer= customerId;
    }
    if(deliveryPartnerId){
      query.deliveryPartner= deliveryPartnerId;
      query.branch= branchId;
    }
    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );
    return reply.send(orders);

  } catch (error) {
    return reply.status(500).send({message:"Failed to retrieve order", error})
  }
 }

 export const getOrderById = async(req,reply)=> {
  try {
    const {orderId} = req.params;
      const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );

    if(!order){
      return reply.status(404).send({message:"Order NOt found"})
    }
    return reply.send(orders);

  } catch (error) {
    return reply.status(500).send({message:"Failed to retrieve order", error})
  }
 }