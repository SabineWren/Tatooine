/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { GravConst, MidpointEuler };
import * as M3 from "./matrices3D.js";
import * as M4 from "./matrices4D.js";

const GravConst = 6.674 * Math.pow(10, -11);
const getAccelPart = function(d, body) {
	const displacement = body.position.Subtract(d);
	const distance = displacement.Magnitude();
	const rDir = displacement.Divide(distance);
	const rSquared = displacement.Dot(displacement);
	const aMag = GravConst * body.mass / rSquared;
	return M3.CreateVector([
		rDir[0] * aMag,
		rDir[1] * aMag,
		rDir[2] * aMag,
	]);
};

const getAccel = function(d, bodies) {
	const accelParts = bodies.map(body => getAccelPart(d, body));
	return accelParts.reduce((acc, part) => acc.Add(part));
};

const MidpointEuler = function(modelMatrix, v, timeStep, otherBodies) {
	const d = M4.GetPosition(modelMatrix);
	const accelNet = getAccel(d, otherBodies);

	const vFinal = accelNet.Scale(timeStep).Add(v);
	const vMidpoint = v.Add(vFinal).Divide(2.0);

	return [
		vFinal,
		modelMatrix.Translate(
			vMidpoint[0] * timeStep,
			vMidpoint[1] * timeStep,
			vMidpoint[2] * timeStep,
	)];
};


const RK4 = function(d, v, timeStep, otherModels) {
};
