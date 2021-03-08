import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as MainMenuRouteController from "../controllers/mainMenuRouteController.ts";

function productListingRoutes(server: express.Express) {
	server.get(RouteLookup.MainMenu, mainMenuRouteController.start);
}

module.exports.routes = mainMenuRoutes;