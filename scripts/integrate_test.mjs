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
const testIntegrator1 = function(integrateMutDV, dt) {
	let d = [0.0, 0.0, 0.0];
	let v = [1.0, 1.0, 1.0];
	
	for(let t = 0.0; t + EPSILON < 8000.0 * Math.PI; t = t + dt) {
		[d, v] = integrateMutDV(getAccelSinusoid, d, v, dt);
	}
	
	return [d, v];
};

const computeTimeOfCollision = function(integrateMutDV, dt) {
	const getAccelFactory = function(G, m2, p2) {
		return function(p1) {
			//a = Gm/r^2
			const displacement = p2.Sub(p1);
			const direction = M3.Normalize(displacement);
			const distance = M3.Magnitude(displacement);
			const rSquared = distance * distance;
			const a = G * m2 / rSquared;
			return direction.ScaleMut(a);
		};
	};
	const G =          6.6743015 * Math.pow(10, -11);
	const MASS_EARTH = 5.9722    * Math.pow(10, 24);
	const MASS_MOON  = 7.342     * Math.pow(10, 22);

	let pEarth = [0.0, 0.0, 0.0];
	let pMoon  = M3.Normalize([1.0, 2.0, 3.0]).Scale(405_400_000.0);
	let vEarth = [0.0, 0.0, 0.0];
	let vMoon  = [0.0, 0.0, 0.0];
	
	let separation = 0.0;
	let t = 0.0;
	do {
		const getAccelEarth = getAccelFactory(G, MASS_MOON, pMoon);
		[pEarth, vEarth] = integrateMutDV(getAccelEarth, pEarth, vEarth, dt);
		
		const getAccelMoon = getAccelFactory(G, MASS_EARTH, pEarth);
		[pMoon, vMoon] = integrateMutDV(getAccelMoon, pMoon, vMoon, dt);
		
		separation = M3.Magnitude(pEarth.Sub(pMoon));
		t += dt;
	} while (separation > 15_000_000.0)
	
	return t;
};

const timeStep = 1.0;
const eulerStart = Date.now();
const resultEuler = computeTimeOfCollision(MidpointEulerMutDV, timeStep / 4.0);
const eulerDelta = Date.now() - eulerStart;
console.log("MidEu: " + eulerDelta + " result: " + resultEuler);

const rk4Start = Date.now();
const resultRK4 = computeTimeOfCollision(RK4MutDV, timeStep);
const rkDelta = Date.now() - rk4Start;
console.log("  RK4: " + rkDelta + " result: " + resultRK4);

/*
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
*/


