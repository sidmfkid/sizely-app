import express from "express";
import devBundle from "./devBundle.js"; // comment this line  when you are working in production mode
import dotenv from "dotenv";
import { resolve } from "path";
import path from "path";
dotenv.config();

import { Shopify } from "@shopify/shopify-api";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import StoreModel from "./models/storeModel";
import SessionModel from "./models/sessionModel";
import topLevelAuthRedirect from "./utils/topLevelAuthRedirect";
// import { storage } from "./cloudinary/index";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
// import webhookRegistrar from "./webhooks/webhookRegistrar";
import webhookRoutes from "./webhooks/_routes.js";
import sessionStorage from "./utils/sessionStorage";
import isActiveShop from "./middleware/isActiveShop.js";
import verifyRequest from "./middleware/verifyRequest.js";
import applyAuthMiddleware from "./middleware/auth";
import userRoutes from "./routes/index";
import { appUninstallHandler } from "./webhooks/app_uninstalled";
import csp from "./middleware/csp.js";
import {
  customerDataRequest,
  customerRedact,
  shopRedact,
} from "./webhooks/gdpr";
import multer from "multer";
const {
  SHOP_API_SECRET,
  SHOP_API_KEY,
  SHOP_API_SCOPES,
  HOST,
  DB_URL,
  SHOP,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} = process.env;

const app = express();

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sizely",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });
devBundle.compile(app); // comment this line when you are working in production mode

const CURRENT_WORKING_DIR = process.cwd();
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

import template from "./../template";

Shopify.Context.initialize({
  API_KEY: SHOP_API_KEY,
  API_SECRET_KEY: SHOP_API_SECRET,
  SCOPES: [SHOP_API_SCOPES],
  HOST_NAME: HOST,
  API_VERSION: "2022-04",
  IS_EMBEDDED_APP: false,
  SESSION_STORAGE: sessionStorage,
});

Shopify.Webhooks.Registry.addHandlers({
  APP_UNINSTALLED: {
    path: "/webhooks/app_uninstalled",
    webhookHandler: appUninstallHandler,
  },
  CUSTOMERS_DATA_REQUEST: {
    path: "/webhooks/gdpr/customers_data_request",
    webhookHandler: customerDataRequest,
  },
  CUSTOMERS_REDACT: {
    path: "/webhooks/gdpr/customers_redact",
    webhookHandler: customerRedact,
  },
  SHOP_REDACT: {
    path: "/webhooks/gdpr/shop_redact",
    webhookHandler: shopRedact,
  },
});

const dbUrl = "mongodb://localhost:27017/sizely" || DB_URL;
connectDB().catch((err) => console.log(err));

async function connectDB() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("open"));

app.set("top-level-oauth-cookie", "shopify_top_level_oauth");
app.set("use-online-tokens", true);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

//Verify user route requests

// const shops = {};

app.get("/home", async (req, res) => {
  try {
    const { shop } = req.query;
    const isShopAvaialble = await StoreModel.findOne({ shop });
    // console.log(isShopAvaialble);
    if (typeof isShopAvaialble !== "undefined") {
      res.redirect(`/auth?shop=${req.query.shop}`);
    } else {
      res.send(template());
    }
  } catch (error) {
    console.error(error, "ERror home ROUTE /");
  }
});

applyAuthMiddleware(app);
app.use("/webhooks", webhookRoutes);

app.post("/graphql", verifyRequest(app), async (req, res) => {
  try {
    const response = await Shopify.Utils.graphqlProxy(req, res);
    res.status(200).send(response.body);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.use(bodyParser.urlencoded({ extended: false, limit: "500mb" }));
app.use(bodyParser.json());
app.use(csp);
app.use(isActiveShop);
app.use("/apps", verifyRequest(app), userRoutes);

app.get("/upload", async (req, res) => {
  // do something with the returned data
  res.send(template());
});

app.get("/", async (req, res) => {
  // do something with the returned data

  //   console.log(files.edges);
  res.send(template());
});

app.post("/upload", upload.array("images"), async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    const { shop } = req.query;
    // console.log(req.query);

    let fileArr = { files: [] };

    for (let i = 0; i < req.files.length; i++) {
      fileArr.files.push({
        originalName: req.files[i].originalname,
        url: req.files[i].path,
        size: req.files[i].size,
      });
    }

    await StoreModel.findOneAndUpdate(
      { shop },
      {
        $push: {
          files: fileArr.files,
        },
      }
    );

    // const newupdate = await StoreModel.bulkSave();

    // store.insertMany({ files: fileArr.files });
    // console.log(await StoreModel.findOne({ shop: shop }));

    const imageInfoArray = fileArr.files.map((file) => {
      let images = {
        alt: "",
        contentType: "IMAGE",
        originalSource: file.url,
      };
      return images;
    });

    let data = await client.query({
      data: {
        query: `mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              alt
              createdAt
            }
          }
        }`,
        variables: {
          files: imageInfoArray,
        },
      },
    });

    res.json({ data: data.body });
  } catch (error) {
    console.log(error, "somethinbad happened");
  }
});

app.get("/images", async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    // GraphQLClient takes in the shop url and the accessToken for that shop.
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );
    // Use client.query and pass your query as `data`
    const files = await client.query({
      data: {
        query: `query GetFiles($first: Int!) {
        files (first: $first) {
          edges {
            node {
             createdAt
             alt
             ... on MediaImage{
                id
             originalSource{
                fileSize
             }
             image {
                id
                url
                width
                height
             }
             }
            }
          }
        }
      }`,
        variables: {
          first: 10,
        },
      },
    });
    // console.log("files.body.data.files", files.body.data.files);
    console.log("files.body.data.files.edges", files.body.data.files.edges);
    res.json({
      data: files.body.data.files.edges,
    });
  } catch (error) {
    console.log(error, "ERROR loasing");
  }
});

let port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", port);
});
