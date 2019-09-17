/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
//TODO fix positions to be as close as possible, and set one mass
// make eccentricity and mass ratios variables for user input
import { RK4MutV, MidpointEulerMutV } from "../scripts/integrate.mjs";
import { ComputePositionAfterTime } from "../scripts/nBody.mjs";
import * as M3 from "../scripts/matrices3D.mjs";
const G = 6.6743015 * Math.pow(10,-11);

const test2Body = function(params, dt, integrator) {
	let r2 = [params.apoapsis, 0.0, 0.0];
	let v2 = [0.0, -1.0, 0.0].ScaleMut(params.vApoapsis);
	let r1 = r2.Scale(params.comRatio);
	let v1 = v2.Scale(params.comRatio);
	const start = Date.now();
	
	[r2, v2, r1, v1] = ComputePositionAfterTime(
		params.m1, params.m2,
		r1, r2, v1, v2, integrator, params.orbitalPeriod, dt
	);
	
	const delta = Date.now() - start;
	return [r2, delta];
};

const createParams = function(eccentricity, mass1, mass2, semiMajorAxis) {
	//https://en.wikipedia.org/wiki/Apsis
	const apoapsis  = semiMajorAxis * (1.0 + eccentricity);
	//const periapsis = semiMajorAxis * (1.0 - eccentricity);

	//https://en.wikipedia.org/wiki/Barycenter
	const centreOfMassRatio = -1.0 * mass2 / (mass1 + mass2);

	//https://en.wikipedia.org/wiki/Orbital_speed
	const vApoapsis = Math.sqrt(G * mass1 * (1.0 - eccentricity) / apoapsis);
	
	//https://en.wikipedia.org/wiki/Gravitational_two-body_problem
	//T^2 G(m1 + m2) = 4 Pi^2 a^3
	const aCubed = Math.pow(semiMajorAxis, 3);
	const denom = G * (mass1 + mass2);
	const orbitalPeriod = 2.0 * Math.PI * Math.sqrt(aCubed / denom);
	
	console.log(orbitalPeriod / (3600.0 * 24.0));
	return {
		apoapsis: apoapsis,
		comRatio: centreOfMassRatio,
		m1: mass1,
		m2: mass2,
		orbitalPeriod: orbitalPeriod,
		//orbitalPeriod: 365.25335 * 24.0 * 3600.0,
		//orbitalPeriod: 365.256363004 * 24.0 * 3600.0,
		semiMajorAxis: semiMajorAxis,
		vApoapsis: vApoapsis,
	};
};

//const secToDay = seconds => seconds / 3600.0 / 24.0;
const MASS_SUN   = 1.9885    * Math.pow(10, 30);
const MASS_EARTH = 5.97237   * Math.pow(10, 24);
const EARTH_ECCENTRICITY = 0.0167086;
const EARTH_SEMI_MAJOR_AXIS = 149_598_023_000.0;

//user only inputs mass ratio and eccentricity
const params = createParams(
	EARTH_ECCENTRICITY, MASS_SUN,
	MASS_EARTH, EARTH_SEMI_MAJOR_AXIS
);
const rExact = [params.apoapsis, 0.0, 0.0];
console.log(rExact);
/*
const [rEuler, tEuler] = test2Body(params, 1.0, MidpointEulerMutV);
const errEuler = M3.Magnitude(rExact.Sub(rEuler));
console.log("Euler time: "  + tEuler);
console.log("Euler error: " + errEuler);
console.log(rEuler);*/

const [rRK4, tRK4] = test2Body(params, 4.0, RK4MutV);
const errRK4 = M3.Magnitude(rExact.Sub(rRK4));
console.log("RK4 time: "  + tRK4);
console.log("RK4 error: " + errRK4);
console.log(rRK4);

