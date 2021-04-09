//employeeDetailRoutes.ts

import express from "express";
import {RouteLookup} from "../controllers/lookups/routingLookup";
import * as EmployeeDetailRouteController from "../controllers/EmployeeDetailRouteController";

function EmployeeDetailRoutes(server: express.Express) {
	server.get(
			RouteLookup.EmployeeDetail,
			EmployeeDetailRouteController.start);
			
	server.get(
			(RouteLookup.EmployeeDetail + RouteLookup.ProductIdParameter),
			EmployeeDetailRouteController.start*/WithEmployee/*);
			
	server.patch(
			(RouteLookup.API + RouteLookup.EmployeeDetail + RouteLookup.EmployeeIdParameter),
			EmployeeDetailRouteController.updateEmployee);
			
	server.post(
			(RouteLookup.API + RouteLookup.EmployeeDetail),
			EmployeeDetailRouteController.createEmployee);
			
}

module.exports.routes = EmployeeDetailRoutes;