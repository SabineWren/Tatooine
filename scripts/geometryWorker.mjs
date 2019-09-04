/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { MarshalModel, UnmarshalModel } from "./channels.mjs";
import { RK4 } from "./integrate.mjs";
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";

const TIME_STEP = 0.02;
const GRAV_CONST = 6.674 * Math.pow(10, -11);

const getAccelOneBody = function(d, body) {
	const displacement = body.position.Subtract(d);
	const distance = displacement.Magnitude();
	const rDir = displacement.Divide(distance);
	const rSquared = displacement.Dot(displacement);
	const aMag = GRAV_CONST * body.mass / rSquared;
	return M3.CreateVector([
		rDir[0] * aMag,
		rDir[1] * aMag,
		rDir[2] * aMag,
	]);
};

const getNextModel = function(model, models) {
	const m = model.mass;
	const otherBodies = models
		.filter(m => m.name !== model.name)
		.map(getStats);
	
	const [dFinal, vFinal] = integrate(model.matrix, model.velocity, TIME_STEP, otherBodies);
	return [dFinal, vFinal];
};

const getStats = function(m, p1) {
	return {
		position: M4.GetPosition(m.matrix),
		mass: m.mass,
	};
};

const integrate = function(modelMatrix, v, dt, otherBodies) {
	const getAccelFromBodies = function(d) {
		const accelParts = otherBodies.map(body => getAccelOneBody(d, body));
		return accelParts.reduce((acc, part) => acc.Add(part));
	};
	
	const d = M4.GetPosition(modelMatrix);
	const [dFinal, vFinal] = RK4(getAccelFromBodies, d, v, dt);
	
	const deltaD = dFinal.Subtract(d);
	return [
		modelMatrix.Translate(
			deltaD[0],
			deltaD[1],
			deltaD[2],
		)
		,vFinal
	];
};

const updateGeometry = function(models) {
	const nextState = models.map(m => getNextModel(m, models));
	for(let i = 0; i < models.length; i++) {
		models[i].matrix = nextState[i][0];
		models[i].velocity = nextState[i][1];
	}
};

let models;
const init = function(e) {
	models = e.data.map(UnmarshalModel);
	onmessage = update;
	setInterval(function() {
		for(let i = 0; i < 120; i++) {
			updateGeometry(models);
		}
	}, 0);
};

const update = function(e) {
	postMessage(models.map(MarshalModel));
};

onmessage = init;

