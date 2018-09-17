/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Dot, Magnitude };
export { Add, Cross, Divide, Minus, RotateAroundAxis, Scale };

const Add = function(a, b) {
	return [
		a[0] + b[0],
		a[1] + b[1],
		a[2] + b[2],
	];
};

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

const Divide = function(v, m) {
	return [
		v[0] / m,
		v[1] / m,
		v[2] / m,
	];
};

const Dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const Magnitude = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

const Minus = function(a, b) {
	return [
		a[0] - b[0],
		a[1] - b[1],
		a[2] - b[2],
	];
};

//https://en.wikipedia.org/wiki/Rodrigues'_rotation_formula
const RotateAroundAxis = function(axis, v, theta) {
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

const Scale = function(v, s) {
	return [
		v[0] * s,
		v[1] * s,
		v[2] * s,
	];
};

