/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { UpdateGeometry };
import * as Integrate from "./integrate.js";
import * as M3 from "./matrices3D.js";
import * as M4 from "./matrices4D.js";
const timeStep = 0.4;

const getStats = function(m, p1) {
	return {
		position: M4.GetPosition(m.matrix),
		mass: m.mass,
	};
};

const getNextModel = function(model, models) {
	const m = model.mass;
	const otherBodies = models
		.filter(m => m.name !== model.name)
		.map(getStats);
	
	const [dFinal, vFinal] = Integrate.RK4(model.matrix, model.velocity, timeStep, otherBodies);
	return [dFinal, vFinal];
};

const UpdateGeometry = function(models) {
	const nextState = models.map(m => getNextModel(m, models));
	for(let i = 0; i < models.length; i++) {
		models[i].matrix = nextState[i][0];
		models[i].velocity = nextState[i][1];
	}
};

