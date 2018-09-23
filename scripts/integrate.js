/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { GravConst, MidpointEuler, RK4 };
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

const MidpointEuler = function(modelMatrix, v, dt, otherBodies) {
	const d = M4.GetPosition(modelMatrix);
	const accelNet = getAccel(d, otherBodies);

	const vFinal = accelNet.Scale(dt).Add(v);
	const vMidpoint = v.Add(vFinal).Divide(2.0);

	return [
		modelMatrix.Translate(
			vMidpoint[0] * dt,
			vMidpoint[1] * dt,
			vMidpoint[2] * dt,
		), vFinal
	];
};


const RK4 = function(modelMatrix, v, dt, otherBodies) {
	const d = M4.GetPosition(modelMatrix);
	
	const k1 = getAccel(d, otherBodies);//accel at start
	
	const v2 = v.Add( k1.Scale(dt / 2.0) );
	const d2 = d.Add( v2.Scale(dt / 2.0) );
	const k2 = getAccel(d2, otherBodies);//accel in middle
	
	const v3 = v.Add( k2.Scale(dt / 2.0) );
	const d3 = d.Add( v3.Scale(dt / 2.0) );
	const k3 = getAccel(d3, otherBodies);//accel in middle if accel at start was k2
	
	const v4 = v.Add( k3.Scale(dt) );
	const d4 = d.Add( v4.Scale(dt) );
	const k4 = getAccel(d4, otherBodies);//accel at end if accel at start was k3
	
	const acceleration = (k1.Add(k2.Scale(2.0)).Add(k3.Scale(2.0)).Add(k4)).Divide(6.0);
	
	const vFinal = v.Add(acceleration.Scale(dt));
	const dFinal = d.Add(v.Scale(dt)).Add(acceleration.Scale(dt * dt * 0.5));
	
	return [
		modelMatrix.Translate(
			vFinal[0] * dt,
			vFinal[1] * dt,
			vFinal[2] * dt,
		), vFinal
	];
};
