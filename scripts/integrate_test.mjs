/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { RK4MutDV, MidpointEulerMutDV } from "./integrate.mjs";
import * as M3 from "./matrices3D.mjs";

const getAccelSinusoid = function(d) {
	return d.Scale(-1);
};

const EPSILON = 0.000_000_001;
const testIntegrator = function(integrateMutDV, dt) {
	let d = [0.0, 0.0, 0.0];
	let v = [1.0, 1.0, 1.0];
	
	for(let t = 0.0; t + EPSILON < 8000.0 * Math.PI; t = t + dt) {
		[d, v] = integrateMutDV(getAccelSinusoid, d, v, dt);
	}
	
	return [d, v];
};

const timeStep = Math.PI / Math.pow(2, 10);
//re-using testIntegrator reduces Euler performance unless computing Euler first
//i.e. V8 must be de-optimizing testIntegrator when calling it with Rk4
const eulerStart = Date.now();
const [dMe, vMe] = testIntegrator(MidpointEulerMutDV, timeStep / 5.0);
const eulerDelta = Date.now() - eulerStart;

const rk4Start = Date.now();
const [dRk, vRk] = testIntegrator(RK4MutDV, timeStep);
const rkDelta = Date.now() - rk4Start;

console.log("  RK4: " + rkDelta + " [" + dRk[0] + ", " + dRk[1] + ", " + dRk[0] + "]");
console.log("MidEu: " + eulerDelta + " [" + dMe[0] + ", " + dMe[1] + ", " + dMe[0] + "]");
console.log("exact: [0.0, 0.0, 0.0]");

