import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as MainMenuRouteController from "../controllers/mainMenuRouteController.ts";

function mainMenuRoutes(server: express.Express) {
	server.get(RouteLookup.MainMenu, mainMenuRouteController.start);
}

module.exports.routes = mainMenuRoutes;
