/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { RK4MutV, MidpointEulerMutV } from "../scripts/integrate.mjs";
import * as M3 from "../scripts/matrices3D.mjs";

const ECCENTRICITY    = 0.0167086;
const G               = 6.6743015 * Math.pow(10,-11);
const MASS_EARTH      = 5.9724    * Math.pow(10, 24);
const MASS_SUN        = 1.9885    * Math.pow(10, 30);
const SEMI_MAJOR_AXIS = 149_598_023_000.0;

const secToDay = seconds => seconds / 3600.0 / 24.0;

//https://en.wikipedia.org/wiki/Gravitational_two-body_problem
//2-body elliptical orbit:
//T^2 G(m1 + m2) = 4 Pi^2 a^3
const expectYearInSeconds = function() {
	const aCubed = Math.pow(SEMI_MAJOR_AXIS, 3);
	const denom = G * (MASS_EARTH + MASS_SUN);
	return 2.0 * Math.PI * Math.sqrt(aCubed / denom);
}();
//why is the computed year different from the sidereal year on charts?
//365.256363004 * 3600.0 * 24.0

const computePositionAfterTime = function(
	rSun, rEarth, vSun, vEarth,
	integrateMutV, time, dt
) {
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

	for(let t = 0.0; t < time; t += dt) {
		const getAccelLarge = getAccelFactory(MASS_EARTH, rEarth);
		const getAccelSmall = getAccelFactory(MASS_SUN, rSun);
		[rSun, vSun] = integrateMutV(getAccelLarge, rSun, vSun, dt);
		[rEarth, vEarth] = integrateMutV(getAccelSmall, rEarth, vEarth, dt);
	}
	
	return [rEarth, vEarth, rSun, vSun];
};

//https://en.wikipedia.org/wiki/Apsis
//https://en.wikipedia.org/wiki/Orbital_speed
//at apoapsis: r=a(1+e)
const SPEED_EARTH_AT_APHELION = function() {
	const num = (1.0 - ECCENTRICITY) * G * MASS_SUN;
	const denom = (1.0 + ECCENTRICITY) * SEMI_MAJOR_AXIS;
	return Math.sqrt(num/denom);
}();

//Why is this APHELION? It somehow seems to work
const APHELION = 152_100_000_000.0;//from a chart
//Aphelion should be magnitude: rEarth + rSun, as measured from COM
//but rSun is almost zero due to high mass, so semi_major ~= aphelion, right?
//149_598_472_313
//console.log(M3.Magnitude(rSun) + M3.Magnitude(rEarth));
let rEarth = [APHELION, 0.0, 0.0];
let vEarth = [0.0, -1.0 * SPEED_EARTH_AT_APHELION, 0.0];
const consMomentum = -1.0 * MASS_EARTH / MASS_SUN
let rSun = rEarth.Scale(consMomentum);
let vSun = vEarth.Scale(consMomentum);
console.log(rEarth);

console.log("posit: " + rEarth.toString());
{
	const timeStep = 2.0;
	const start = Date.now();
	[rEarth, vEarth, rSun, vSun] = computePositionAfterTime(
		rSun, rEarth, vSun, vEarth,
		MidpointEulerMutV, expectYearInSeconds, timeStep
	);
	const delta = Date.now() - start;
	console.log("MidEu: " + delta);
	console.log("posit: " + rEarth.toString());
}

/*{
	const timeStep = 12.0;
	const rk4Start = Date.now();
	const [rEarth, vEarth] = computeYear(RK4MutV, timeStep);
	const rkDelta = Date.now() - rk4Start;
	console.log("  RK4: " + rkDelta + " result:");
	console.log(rEarth);
}*/

