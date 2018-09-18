/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { GravConst, UpdateGeometry };
import * as M3 from "./matrices3D.js";
import * as M4 from "./matrices4D.js";
//const GravConst = 6.674 * Math.pow(10, -11);
const GravConst = 6.674 * Math.pow(10, -2);
const timeStep = 0.4;

const getAcceleration = function(force, mass) {
	return [
		force[0] / mass,
		force[1] / mass,
		force[2] / mass,
	];
}

const getForce = function(m, model) {
	const rDir = M3.Divide(m.displacement, M3.Magnitude(m.displacement));
	const rSquared = M3.Dot(m.displacement, m.displacement);
	const fMag = GravConst * m.mass * model.mass / rSquared;
	return [
		rDir[0] * fMag,
		rDir[1] * fMag,
		rDir[2] * fMag,
	];
};

const getStats = function(m, p1) {
	const p2 = M4.GetPosition(m.matrix);
	return {
		displacement: M3.Minus(p2, p1),
		mass: m.mass,
	};
};

const UpdateGeometry = function(models, state) {
	for(let model of models) {
		//if(model.name !== "tatooine") { continue; }
		//if(model.name === "tatooine") { continue; }
		const p = M4.GetPosition(model.matrix);
		const forces = models
			.filter(m => m.name !== model.name)
			.map(m => getStats(m, p))
			.map(m => getForce(m, model));
		const forceNet = forces.reduce((acc, ele) => M3.Add(acc, ele));
		const accel = getAcceleration(forceNet, model.mass);
		const deltaV = M3.Scale(accel, timeStep);
		const halfDeltaV = M3.Divide(deltaV, 2.0);	
		const vFinal = M3.Add(model.velocity, deltaV);
		const vAverage = M3.Add(model.velocity, halfDeltaV);
		
		model.velocity = vFinal;
		model.matrix = model.matrix.Translate(
			vAverage[0] * timeStep,
			vAverage[1] * timeStep,
			vAverage[2] * timeStep,
		);
	}
	state.needToRender = true;
};

