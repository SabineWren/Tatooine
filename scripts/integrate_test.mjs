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
const dt = Math.PI / 32.0;

const testIntegrator = function(integrate) {
	let d = M3.CreateVector([0.0, 0.0, 0.0]);
	let v = M3.CreateVector([1.0, 1.0, 1.0]);
	
	for(let t = 0.0; t + EPSILON < 20 * Math.PI; t = t + dt) {
		[d, v] = integrate(getAccelSinusoid, d, v, dt);
	}
	
	return [d, v];
};

const rk4Timer = Date.now();
const [dRk, vRk] = testIntegrator(RK4);
const [dMe, vMe] = testIntegrator(MidpointEuler);
console.log("  RK4: [" + dRk[0] + ", " + dRk[1] + ", " + dRk[0] + "]");
console.log("MidEu: [" + dMe[0] + ", " + dMe[1] + ", " + dMe[0] + "]");
console.log("exact: [0.0, 0.0, 0.0]");

