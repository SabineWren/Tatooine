/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import * as M3 from "./matrices3D.mjs";
export { ComputePositionAfterTime };
const G = 6.6743015 * Math.pow(10,-11);

const ComputePositionAfterTime = function(
	mass1, mass2,
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
		const getAccelLarge = getAccelFactory(mass2, rEarth);
		const getAccelSmall = getAccelFactory(mass1, rSun);
		[rSun, vSun] = integrateMutV(getAccelLarge, rSun, vSun, dt);
		[rEarth, vEarth] = integrateMutV(getAccelSmall, rEarth, vEarth, dt);
	}
	
	return [rEarth, vEarth, rSun, vSun];
};
