import AdminJS from "adminjs";
import AdminJSFastify from '@adminjs/fastify';
import * as AdminJSMongoose from '@adminjs/mongoose';
import * as Models from '../models/index.js';
import { authenticate, COOKIE_PASSWORD , sessionStore} from './config.js';
import { dark, light, noSidebar } from '@adminjs/themes';

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources:[
    {
     resource:Models.Customer,
     options:{
      listProperties: ["phone","role","isActivated"],
      filterProperties: ["phone","role"],
     }
    },
    {
     resource:Models.DeliveryPartner,
     options:{
      listProperties: ["phone","role","isActivated"],
      filterProperties: ["phone","role"],
     }
    },
    {
     resource:Models.Admin,
     options:{
      listProperties: ["phone","role","isActivated"],
      filterProperties: ["phone","role"],
     }
    },
    {resource:Models.Branch},
    {resource:Models.Product},
    {resource:Models.Category},
    {resource:Models.Counter},
    {resource:Models.Order},
  ],
  branding:{
    companyName: "Grocery-app",
    withMadeWithLove:false,
  },
  defaultTheme:dark.id,
  availableThemes:[dark,light, noSidebar],
  rootPath:'/admin'
})

export const buildAdminRouter = async(app)=>{
await AdminJSFastify.buildAuthenticatedRouter(
  admin,{
authenticate,
cookiePassword:COOKIE_PASSWORD,
cookieName:'adminjs',
  },
  app,{
    store:sessionStore,
    saveUnintialized: true,
    secret: COOKIE_PASSWORD,
    cookie:{
      httpOnly: process.env.NODE_ENV == "production",
      secure: process.env.NODE_ENV == "production",
    }
  }
)
}