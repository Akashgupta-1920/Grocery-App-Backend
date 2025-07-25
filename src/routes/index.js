import fastify from "fastify";
import { authRoutes } from "./auth.js";
import { orderRoutes } from "./order.js";
import { categoryRoutes, productRoutes } from "./products.js";

const prefix = "/api";

export const registerRoutes = async(fastify,option)=> {
  fastify.register(authRoutes, {prefix: prefix});
  fastify.register(productRoutes, {prefix: prefix});
  fastify.register(categoryRoutes, {prefix: prefix});
  fastify.register(orderRoutes, {prefix: prefix});
}