import fastify from 'fastify';
import {
confirmOrder,
createOrder,
getOrderById,
getOrders,
updateOrderStatus,
} from '../controllers/order/order.js';
import {verifyToken} from "../middleware/auth.js";

export const orderRoutes = async(fastify,option) => {
  fastify.addHook("preHandler",async (request,reply) => {
    const isAuthenticated = await verifyToken(request,reply);
    if(!isAuthenticated){
      return reply.status(403).sen({message:"UnAuthorized"})
    };
  });

  fastify.post("/order", confirmOrder);
  fastify.get("order", getOrders);
  fastify.patch("/order/:orderId/status", updateOrderStatus);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.get("/order/:orderId/", getOrderById)
}