import {getProductsByCategoryId} from '../controllers/product/product.js';
import {getAllCategory} from '../controllers/product/category.js';
import fastify from 'fastify';

export const categoryRoutes = async(fastify,option) => {
  fastify.get("/categories" , getAllCategory);
}

export const productRoutes = async(fastify,option) => {
  fastify.get("/products/:categoryId" , getAllCategory);
}