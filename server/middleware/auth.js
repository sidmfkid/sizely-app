import { Shopify } from "@shopify/shopify-api";

import StoreModel from "../models/storeModel";
import SessionModel from "../models/sessionModel";
import topLevelAuthRedirect from "../utils/topLevelAuthRedirect";
import { webhookRegistrar } from "../webhooks/webhookRegistrar";

const applyAuthMiddleware = (app) => {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      console.log(req.signedCookies);
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/tokens",
      false
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/tokens", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop,
        host: req.query.host,
      })
    );
  });

  app.get("/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const host = req.query.host;
      const { shop } = session;

      await webhookRegistrar(session); //Register all webhooks
      await StoreModel.findOneAndUpdate({ shop }, { isActive: true }); //Update store to true after auth has happened, or it'll cause reinstall issues.

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          // Delete sessions and restart installation
          await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
          await SessionModel.deleteMany({ shop });
          res.redirect(`/auth?shop=${req.query.shop}&host=${req.query.host}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
};

// const applyAuthMiddleware = (app) => {
//   app.get("/auth", async (req, res) => {
//     if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
//       return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
//     }

//     const redirectUrl = await Shopify.Auth.beginAuth(
//       req,
//       res,
//       req.query.shop,
//       "/auth/tokens",
//       false
//     );
//     console.log("auth", req.query);
//     res.redirect(redirectUrl);
//   });

//   app.get("/auth/tokens", async (req, res) => {
//     if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
//       return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
//     }
//     console.log("auth/tokens", req.query);

//     const redirectUrl = await Shopify.Auth.beginAuth(
//       req,
//       res,
//       req.query.shop,
//       "/auth/callback",
//       app.get("use-online-tokens")
//     );

//     res.redirect(redirectUrl);
//   });

//   app.get("/auth/toplevel", (req, res) => {
//     res.cookie(app.get("top-level-oauth-cookie"), "1", {
//       signed: true,
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     res.set("Content-Type", "text/html");

//     res.send(
//       topLevelAuthRedirect({
//         apiKey: Shopify.Context.API_KEY,
//         hostName: Shopify.Context.HOST_NAME,
//         shop: req.query.shop,
//         host: req.query.host,
//       })
//     );
//   });

//   app.get("/auth/callback", async (req, res) => {
//     console.log("auth/callback");
//     try {
//       const session = await Shopify.Auth.validateAuthCallback(
//         req,
//         res,
//         req.query
//       );
//       console.log("auth/callback", session, req.query);
//       const host = req.query.host;
//       const { shop } = session;

//       await webhookRegistrar(session);
//       //Register all webhooks
//       await StoreModel.findOneAndUpdate({ shop }, { isActive: true });
//       //Update store to true after auth has happened, or it'll cause reinstall issues.

//       // Redirect to app with shop parameter upon auth
//       res.redirect(`/?shop=${shop}&host=${host}`);
//     } catch (e) {
//       console.log("auth/callback ERROR", e);

//       switch (true) {
//         case e instanceof Shopify.Errors.InvalidOAuthError:
//           res.status(400);
//           res.send(e.message);
//           break;
//         case e instanceof Shopify.Errors.CookieNotFound:
//         case e instanceof Shopify.Errors.SessionNotFound:
//           // This is likely because the OAuth session cookie expired before the merchant approved the request
//           // Delete sessions and restart installation
//           await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
//           await SessionModel.deleteMany({ shop });
//           res.redirect(`/auth?shop=${req.query.shop}&host=${req.query.host}`);
//           break;
//         default:
//           res.status(500);
//           res.send(e.message);
//           break;
//       }
//     }
//   });
// };

export default applyAuthMiddleware;
