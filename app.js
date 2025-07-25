import 'dotenv/config';
import { connectDB } from './src/config/connect.js';
import fastify from 'fastify';
import { PORT } from './src/config/config.js';
import fastifySocketIO from 'fastify-socket.io';
import { registerRoutes } from './src/routes/index.js'
import { admin, buildAdminRouter } from './src/config/setup.js';

const start = async () => {
  await connectDB(process.env.MONGO_URL);

  const app = fastify();

  app.register(fastifySocketIO, {
    cors:{
      origin:"*"
    },
    pingInterval:10000,
    pingTimeout:5000,
    transports:['websocket']
  })
  await registerRoutes(app)

  await buildAdminRouter(app)

  app.listen({ port: PORT, host: '0.0.0.0' }, (err, addr) => {
    if (err) {
      console.error('Server failed to start:', err);
    } else {
      console.log(`🚀 Grocery App running at ${addr}${admin.options.rootPath}`);
    }
  });

  app.ready().then( () => {
    app.io.on('connection', (socket) => {
      console.log(" A User Connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`⛔️ User Joined Room ${orderId}`)
      })
      socket.on('Disconnect',()=> {
        console.log("User Disconnect ")
      })
    })
  })
};

start();
