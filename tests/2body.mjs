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

const G      = 6.6743015 * Math.pow(10,-11);
const MASS_1 = 1.9885    * Math.pow(10, 30);
const SEMI_MAJOR_AXIS = 149_598_023_000.0;
//user inputs
const mass2        = 5.97237 * Math.pow(10, 24);
const eccentricity = 0.0167086;
//https://en.wikipedia.org/wiki/Apsis
const apoapsis  = SEMI_MAJOR_AXIS * (1 + eccentricity);
const periapsis = SEMI_MAJOR_AXIS * (1 - eccentricity);

const secToDay = seconds => seconds / 3600.0 / 24.0;

//https://en.wikipedia.org/wiki/Gravitational_two-body_problem
//T^2 G(m1 + m2) = 4 Pi^2 a^3
const expectYearInSeconds = function() {
	const aCubed = Math.pow(SEMI_MAJOR_AXIS, 3);
	const denom = G * (mass2 + MASS_1);
	return 2.0 * Math.PI * Math.sqrt(aCubed / denom);
}();
//why is the computed year different from the sidereal year on charts?
//365.256363004 * 3600.0 * 24.0

//https://en.wikipedia.org/wiki/Orbital_speed
const SPEED_AT_APOAPSIS = Math.sqrt(G * MASS_1 * (1.0 - eccentricity) / apoapsis);
//https://en.wikipedia.org/wiki/Barycenter
const centreOfMassRatio = -1.0 * mass2 / (MASS_1 + mass2);

{
	let r2 = [apoapsis, 0.0, 0.0];
	let v2 = [0.0, -1.0, 0.0].ScaleMut(SPEED_AT_APOAPSIS);
	let r1 = r2.Scale(centreOfMassRatio);
	let v1 = v2.Scale(centreOfMassRatio);
	console.log(r2);

	const timeStep = 1.0;
	const start = Date.now();
	[r2, v2, r1, v1] = ComputePositionAfterTime(
		MASS_1, mass2,
		r1, r2, v1, v2, MidpointEulerMutV, expectYearInSeconds, timeStep
	);
	const delta = Date.now() - start;
	console.log("MidEu: " + delta);
	console.log(r2);
}

{
	let r2 = [apoapsis, 0.0, 0.0];
	let v2 = [0.0, -1.0, 0.0].ScaleMut(SPEED_AT_APOAPSIS);
	let r1 = r2.Scale(centreOfMassRatio);
	let v1 = v2.Scale(centreOfMassRatio);

	const timeStep = 8.0;
	const rk4Start = Date.now();
	[r2, v2, r1, v1] = ComputePositionAfterTime(
		MASS_1, mass2,
		r1, r2, v1, v2, RK4MutV, expectYearInSeconds, timeStep
	);
	const rkDelta = Date.now() - rk4Start;
	console.log("  RK4: " + rkDelta);
	console.log(r2);
}

