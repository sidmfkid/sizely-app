import express from "express";
import { appUninstallRoute } from "./app_uninstalled";
import { gdprRoutes } from "./gdpr";
const webhookRoutes = express.Router();
// const webhookRoutes = require("express").Router();

// const { appUninstallRoute } = require("./app_uninstalled");
// const { gdprRoutes } = require("./gdpr");

//Combine all routes here.
webhookRoutes.use("/", gdprRoutes);
webhookRoutes.use("/", appUninstallRoute);

export default webhookRoutes;
