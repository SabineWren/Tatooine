/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { RK4MutV, MidpointEulerMutV } from "./integrate.mjs";
import * as M3 from "./matrices3D.mjs";

const G               = 6.6743015 * Math.pow(10,-11);
const MASS_SMALL      = 5.9724    * Math.pow(10, 24);
const MASS_LARGE      = 1.9885    * Math.pow(10, 30);
const SEMI_MAJOR_AXIS = 149_598_023_000.0;

const SPEED_INITIAL_SMALL = Math.sqrt(
	//https://en.wikipedia.org/wiki/Orbital_speed
	//G * MASS_LARGE / SEMI_MAJOR_AXIS
	//https://en.wikipedia.org/wiki/Standard_gravitational_parameter
	1.32712440018 * Math.pow(10, 20) / SEMI_MAJOR_AXIS
);
const SPEED_INITIAL_LARGE = Math.sqrt(
	G * MASS_SMALL / SEMI_MAJOR_AXIS
);

//https://en.wikipedia.org/wiki/Gravitational_two-body_problem
//2-body elliptical orbit:
//T^2 G(m1 + m2) = 4 Pi^2 a^3
const expectYearInSeconds = 2.0 * Math.PI * Math.sqrt(
	Math.pow(SEMI_MAJOR_AXIS, 3)
	/ ( G * (MASS_SMALL + MASS_LARGE) )
);
const secToYear = seconds => seconds / 3600.0 / 24.0;
console.log("exact: " + secToYear(expectYearInSeconds));

const computeYear = function(integrateMutV, dt) {
	const getAccelFactory = function(m2, p2) {
		return function(p1) {
			//a = Gm/r^2
			const displacement = p2.Sub(p1);
			const direction = M3.Normalize(displacement);
			const distance = M3.Magnitude(displacement);
			const a = G * m2 / (distance * distance);
			return direction.ScaleMut(a);
		};
	};

	let rLarge = [0.0, 0.0, 0.0];
	let rSmall = [SEMI_MAJOR_AXIS, 0.0, 0.0];
	let vLarge = [0.0, SPEED_INITIAL_LARGE, 0.0];
	let vSmall = [0.0, -1.0 * SPEED_INITIAL_SMALL, 0.0];
	
	let t = 0.0;
	let isDoneHalf = false;
	for(;;) {
		const getAccelLarge = getAccelFactory(MASS_SMALL, rSmall);
		const getAccelSmall = getAccelFactory(MASS_LARGE, rLarge);
		[rLarge, vLarge] = integrateMutV(getAccelLarge, rLarge, vLarge, dt);
		[rSmall, vSmall] = integrateMutV(getAccelSmall, rSmall, vSmall, dt);
		
		t += dt;
		
		if(rSmall[1] > 0.0) { isDoneHalf = true; }
		if(isDoneHalf && rSmall[1] <= 0.0) break;
	}
	
	return t;
};

{
	const timeStep = 12.0;
	const eulerStart = Date.now();
	const resultEuler = computeYear(MidpointEulerMutV, timeStep / 4.0);
	const eulerDelta = Date.now() - eulerStart;
	console.log("MidEu: " + eulerDelta + " result: " + secToYear(resultEuler));

	const rk4Start = Date.now();
	const resultRK4 = computeYear(RK4MutV, timeStep);
	const rkDelta = Date.now() - rk4Start;
	console.log("  RK4: " + rkDelta + " result: " + secToYear(resultRK4));
}

const getAccelSinusoid = function(d) {
	return d.Scale(-1);
};

const EPSILON = 0.000_000_001;
const testIntegrator = function(integrateMutV, dt) {
	let d = [0.0, 0.0, 0.0];
	let v = [1.0, 1.0, 1.0];
	
	for(let t = 0.0; t + EPSILON < 8000.0 * Math.PI; t = t + dt) {
		[d, v] = integrateMutV(getAccelSinusoid, d, v, dt);
	}
	
	return [d, v];
};

{
	console.log("exact: [0.0, 0.0, 0.0]");
	const timeStep = Math.PI / Math.pow(2, 10);
	//re-using testIntegrator reduces Euler performance unless computing Euler first
	//i.e. V8 must be de-optimizing testIntegrator when calling it with Rk4
	const eulerStart = Date.now();
	const [dMe, vMe] = testIntegrator(MidpointEulerMutV, timeStep / 5.0);
	const eulerDelta = Date.now() - eulerStart;

	const rk4Start = Date.now();
	const [dRk, vRk] = testIntegrator(RK4MutV, timeStep);
	const rkDelta = Date.now() - rk4Start;

	console.log("  RK4: " + rkDelta + " [" + dRk[0] + ", " + dRk[1] + ", " + dRk[0] + "]");
	console.log("MidEu: " + eulerDelta + " [" + dMe[0] + ", " + dMe[1] + ", " + dMe[0] + "]");
}

