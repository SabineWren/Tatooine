/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Cross, Dot, Magnitude, RotateAroundAxis };

const Add = function(b) {
	const v = this;
	return [
		v[0] + b[0],
		v[1] + b[1],
		v[2] + b[2],
	];
};
const AddMut = function(b) {
	this[0] += b[0];
	this[1] += b[1];
	this[2] += b[2];
	return this;
};
Object.defineProperty(Array.prototype, 'Add',    { value: Add });
Object.defineProperty(Array.prototype, 'AddMut', { value: AddMut });

const Cross = function(a, b) {
	const aX = a[0];
	const aY = a[1];
	const aZ = a[2];
	const bX = b[0];
	const bY = b[1];
	const bZ = b[2];
	return [
		aY * bZ - aZ * bY,
		aZ * bX - aX * bZ,
		aX * bY - aY * bX,
	];
};

const Divide = function(m) {
	const v = this;
	return [
		v[0] / m,
		v[1] / m,
		v[2] / m,
	];
};
const DivideMut = function(m) {
	this[0] /= m;
	this[1] /= m;
	this[2] /= m;
	return this;
};
Object.defineProperty(Array.prototype, 'Divide',    { value: Divide });
Object.defineProperty(Array.prototype, 'DivideMut', { value: DivideMut });

const Dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const Magnitude = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

//https://en.wikipedia.org/wiki/Rodrigues'_rotation_formula
const RotateAroundAxis = function(v, axis, theta) {
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
	
	return [
		v1[0] + v2[0] + v3[0],
		v1[1] + v2[1] + v3[1],
		v1[2] + v2[2] + v3[2],
	];
};

const Scale = function(s) {
	return [
		this[0] * s,
		this[1] * s,
		this[2] * s,
	];
};
const ScaleMut = function(s) {
	this[0] *= s;
	this[1] *= s;
	this[2] *= s;
	return this;
};
Object.defineProperty(Array.prototype, 'Scale',    { value: Scale });
Object.defineProperty(Array.prototype, 'ScaleMut', { value: ScaleMut });

const Subtract = function(b) {
	const a = this;
	return [
		a[0] - b[0],
		a[1] - b[1],
		a[2] - b[2],
	];
};
const SubtractMut = function(b) {
	this[0] -= b[0];
	this[1] -= b[1];
	this[2] -= b[2];
	return this;
};
Object.defineProperty(Array.prototype, 'Subtract',    { value: Subtract });
Object.defineProperty(Array.prototype, 'SubtractMut', { value: SubtractMut });

