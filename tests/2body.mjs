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
const secToDay = seconds => seconds / 3600.0 / 24.0;

const test2Body = function(params, dt, integrator) {
	let r2 = [params.apoapsis, 0.0, 0.0];
	let v2 = [0.0, -1.0, 0.0].ScaleMut(params.vApoapsis);
	let r1 = r2.Scale(-1.0 * params.comRatio);
	let v1 = v2.Scale(-1.0 * params.comRatio);
	const start = Date.now();
	
	[r2, v2, r1, v1] = ComputePositionAfterTime(
		params.m1, params.m2,
		r1, r2, v1, v2, integrator, params.orbitalPeriod, dt
	);
	
	const delta = Date.now() - start;
	return [r2, delta];
};

const createParams = function(ecc, m1, m2, a) {
	//https://en.wikipedia.org/wiki/Apsis
	const apoapsis  = a * (1.0 + ecc);

	//https://en.wikipedia.org/wiki/Barycenter
	const centreOfMassRatio = m2 / (m1 + m2);

	//https://en.wikipedia.org/wiki/Orbital_speed
	//vis-viva equation
	const vApoapsis = Math.sqrt(G * (m1 + m2) * (1.0 - ecc) / apoapsis);
	console.log(vApoapsis);
	
	//https://en.wikipedia.org/wiki/Gravitational_two-body_problem
	const denom = G * (m1 + m2);
	const orbitalPeriod = 2.0 * Math.PI * Math.sqrt(a * a * a / denom);
	
	return {
		apoapsis: apoapsis,
		comRatio: centreOfMassRatio,
		m1: m1,
		m2: m2,
		orbitalPeriod: orbitalPeriod,
		semiMajorAxis: a,
		vApoapsis: vApoapsis,
	};
};

const printError = function(err, exact) {
	console.log(err[0].toFixed() + ", " + (err[0] / exact[0] * 100.0).toFixed() + "%");
	console.log(err[1].toFixed() + ", " + (err[1] / exact[1] * 100.0).toFixed() + "%");
	console.log(err[2].toFixed() + ", " + (err[2] / exact[2] * 100.0).toFixed() + "%");
};

const run2BodyTest = function(ecc, m1, m2, a) {
	const params = createParams(ecc, m1, m2, a);
	const rExact = [params.apoapsis, 0.0, 0.0];
	console.log(rExact);

	const [rRK4, tRK4] = test2Body(params, 4.0, RK4MutV);
	const err = rExact.Sub(rRK4);
	console.log("RK4 time: "  + tRK4);
	printError(err, rExact);
	/*
	const [rEuler, tEuler] = test2Body(params, 1.0, MidpointEulerMutV);
	const errEuler = M3.Magnitude(rExact.Sub(rEuler));
	console.log("Euler time: "  + tEuler);
	console.log("Euler error: " + errEuler);
	console.log(rEuler);*/
}

//Earth: 0.0167086
//5.97237 * Math.pow(10, 24)
//1.9885 * Math.pow(10, 30);
//149_598_023_000.0;

const massStar = 1.5 * Math.pow(10, 30);
run2BodyTest(0.0, massStar, massStar, 50_000_000_000.0);

