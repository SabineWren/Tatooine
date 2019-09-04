/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { RK4, MidpointEuler } from "./integrate.mjs";
import * as M3 from "./matrices3D.mjs";

const getAccelSinusoid = function(d) {
	return d.Scale(-1);
};

const EPSILON = 0.000_000_001;
const testIntegrator = function(integrate, dt) {
	let d = M3.CreateVector([0.0, 0.0, 0.0]);
	let v = M3.CreateVector([1.0, 1.0, 1.0]);
	
	for(let t = 0.0; t + EPSILON < 2000 * Math.PI; t = t + dt) {
		[d, v] = integrate(getAccelSinusoid, d, v, dt);
	}
	
	return [d, v];
};

const rk4Start = Date.now();
const [dRk, vRk] = testIntegrator(RK4, Math.PI / 1024.0);
const rkDelta = Date.now() - rk4Start;

const eulerStart = Date.now();
const [dMe, vMe] = testIntegrator(MidpointEuler, Math.PI / (1024.0 * 7));
const eulerDelta = Date.now() - eulerStart;

console.log("  RK4: " + rkDelta + " [" + dRk[0] + ", " + dRk[1] + ", " + dRk[0] + "]");
console.log("MidEu: " + eulerDelta + " [" + dMe[0] + ", " + dMe[1] + ", " + dMe[0] + "]");
console.log("exact: [0.0, 0.0, 0.0]");

