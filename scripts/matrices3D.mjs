/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { CreateVector, ScaleMut };

const CreateVector = function(v3) {
	v3.Cross = cross;
	v3.Dot = dot;
	v3.Magnitude = magnitude;
	v3.RotateAroundAxis = rotateAroundAxis;
	v3.Subtract = subtract;
	v3.ToArray = toArray;
	return v3;
};

const AddMut = function(b) {
	this[0] += b[0];
	this[1] += b[1];
	this[2] += b[2];
	return this;
};
Object.defineProperty(Array.prototype, 'AddMut', { value: AddMut });

const cross = function(b) {
	const a = this;
	const aX = a[0];
	const aY = a[1];
	const aZ = a[2];
	const bX = b[0];
	const bY = b[1];
	const bZ = b[2];
	return CreateVector([
		aY * bZ - aZ * bY,
		aZ * bX - aX * bZ,
		aX * bY - aY * bX,
	]);
};

const Divide = function(m) {
	const v = this;
	return CreateVector([
		v[0] / m,
		v[1] / m,
		v[2] / m,
	]);
};
const DivideMut = function(m) {
	this[0] /= m;
	this[1] /= m;
	this[2] /= m;
	return this;
};
Object.defineProperty(Array.prototype, 'Divide',    { value: Divide });
Object.defineProperty(Array.prototype, 'DivideMut', { value: DivideMut });

const dot = function(b) {
	const a = this;
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

const magnitude = function() {
	const v = this;
	return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

//https://en.wikipedia.org/wiki/Rodrigues'_rotation_formula
const rotateAroundAxis = function(axis, theta) {
	const v = this;
	const cosTheta = Math.cos(theta);
	const sinTheta = Math.sin(theta);
	const crossed = Cross(axis, v);
	const dotted = Dot(axis, v);
	
	const v1 = [
		v[0] * cosTheta,
		v[1] * cosTheta,
		v[2] * cosTheta,
	];
	const v2 = [
		crossed[0] * sinTheta,
		crossed[1] * sinTheta,
		crossed[2] * sinTheta,
	];
	const v3 = [
		axis[0] * dotted * (1.0 - cosTheta),
		axis[1] * dotted * (1.0 - cosTheta),
		axis[2] * dotted * (1.0 - cosTheta),
	];
	
	return CreateVector([
		v1[0] + v2[0] + v3[0],
		v1[1] + v2[1] + v3[1],
		v1[2] + v2[2] + v3[2],
	]);
};

const Scale = function(s) {
	const v = this;
	return CreateVector([
		v[0] * s,
		v[1] * s,
		v[2] * s,
	]);
};
const ScaleMut = function(s) {
	const v = this;
	this[0] *= s;
	this[1] *= s;
	this[2] *= s;
	return this;
};
Object.defineProperty(Array.prototype, 'Scale',    { value: Scale });
Object.defineProperty(Array.prototype, 'ScaleMut', { value: ScaleMut });

const subtract = function(b) {
	const a = this;
	return CreateVector([
		a[0] - b[0],
		a[1] - b[1],
		a[2] - b[2],
	]);
};

const toArray = function() {
	const v = this;
	return [v[0], v[1], v[2]];
};

