import express from "express";
import { ViewNameLookup, RouteLookup } from "../controllers/lookups/routingLookup";
import * as SignInRouteController from "../controllers/signInRouteController";

function signInRoutes(server: express.Express) {
	// TODO: Route for initial page load
	server.get('/', function(req, res){
		return res.render(ViewNameLookup.SignIn)
	});
		   
	server.post(RouteLookup.SignIn, SignInRouteController.signIn);

	server.delete(
		(RouteLookup.API + RouteLookup.SignOut),
		SignInRouteController.clearActiveUser);
}

module.exports.routes = signInRoutes;
