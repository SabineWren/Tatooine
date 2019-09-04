export { MarshalModel, UnmarshalModel };
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";

//web workers cannot pass functions
const MarshalModel = function(model) {
	return {
		mass: model.mass,
		matrix: model.matrix.ToArray(),
		name: model.name,
		velocity: model.velocity.ToArray(),
	};
};
const UnmarshalModel = function(model) {
	return {
		mass: model.mass,
		matrix: M4.CreateMatrix(model.matrix),
		name: model.name,
		velocity: M3.CreateVector(model.velocity),
	};
};
