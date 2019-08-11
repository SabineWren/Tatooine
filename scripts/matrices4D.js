/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { GetPosition };
export { CreateMatrix, GetIdentity, Transform };
export { LookAt, Proj };
import * as M3 from "./matrices3D.js";

const CreateMatrix = function(arr) {
	arr.Multiply = multiply;
	arr.RotateX = rotateX;
	arr.RotateY = rotateY;
	arr.RotateZ = rotateZ;
	arr.Scale = scale;
	arr.Translate = translate;
	arr.Transpose = transpose;
	arr.ToArray = toArray;
	return arr;
};

const GetIdentity = function(s) {
	return CreateMatrix([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	]);
};

const GetPosition = m => M3.CreateVector([m[12], m[13], m[14], m[15]]);

const LookAt = function(eye, centre) {
	const up = [0.0, 1.0, 0.0];
	const faceRaw = M3.CreateVector([
		centre[0] - eye[0],
		centre[1] - eye[1],
		centre[2] - eye[2],
	]);
	const f = faceRaw.Divide(faceRaw.Magnitude());
	
	const s = f.Cross(up);
	const sNorm = s.Divide(s.Magnitude());
	const u = sNorm.Cross(f);
	
	const e = M3.CreateVector(eye);
	const tx = s.Dot(e) * -1.0;
	const ty = u.Dot(e) * -1.0;
	const tz = f.Dot(e);
	
	return CreateMatrix([
		s[0], u[0], -f[0], 0,
		s[1], u[1], -f[1], 0,
		s[2], u[2], -f[2], 0,
		tx,    ty,     tz, 1
	]);
};

const multiply = function(b) {
	const a = this;
	const a00 = a[0 * 4 + 0];
	const a01 = a[0 * 4 + 1];
	const a02 = a[0 * 4 + 2];
	const a03 = a[0 * 4 + 3];
	const a10 = a[1 * 4 + 0];
	const a11 = a[1 * 4 + 1];
	const a12 = a[1 * 4 + 2];
	const a13 = a[1 * 4 + 3];
	const a20 = a[2 * 4 + 0];
	const a21 = a[2 * 4 + 1];
	const a22 = a[2 * 4 + 2];
	const a23 = a[2 * 4 + 3];
	const a30 = a[3 * 4 + 0];
	const a31 = a[3 * 4 + 1];
	const a32 = a[3 * 4 + 2];
	const a33 = a[3 * 4 + 3];
	const b00 = b[0 * 4 + 0];
	const b01 = b[0 * 4 + 1];
	const b02 = b[0 * 4 + 2];
	const b03 = b[0 * 4 + 3];
	const b10 = b[1 * 4 + 0];
	const b11 = b[1 * 4 + 1];
	const b12 = b[1 * 4 + 2];
	const b13 = b[1 * 4 + 3];
	const b20 = b[2 * 4 + 0];
	const b21 = b[2 * 4 + 1];
	const b22 = b[2 * 4 + 2];
	const b23 = b[2 * 4 + 3];
	const b30 = b[3 * 4 + 0];
	const b31 = b[3 * 4 + 1];
	const b32 = b[3 * 4 + 2];
	const b33 = b[3 * 4 + 3];
	return CreateMatrix([
		b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
		b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
		b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
		b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
		b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
		b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
		b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
		b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
		b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
		b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
		b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
		b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
		b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
		b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
		b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
		b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
	]);
};

const Proj = function(aspectR, far, fov, near) {
	const dist = 1.0 / Math.tan(fov/2.0);
	const rangeInv = 1.0 / (near - far);
	return CreateMatrix([
		dist / aspectR, 0.0,  0.0,                         0.0,
		0.0,            dist, 0.0,                         0.0,
		0.0,            0.0,  (near + far) * rangeInv,    -1.0,
		0.0,            0.0,  far * near * rangeInv * 2.0, 0.0,
	]);
};
const rotateX = function(radians) {
	const c = Math.cos(radians);
	const s = Math.sin(radians);
	return CreateMatrix([
		 1.0, 0.0,  0.0, 0.0,
		 0.0, c,   -s,   0.0,
		 0.0, s,    c,   0.0,
		 0.0, 0.0,  0.0, 1.0,
	]).Multiply(this);
};
const rotateY = function(radians){
	const c = Math.cos(radians);
	const s = Math.sin(radians);
	return CreateMatrix([
		  c,    0.0, s,   0.0,
		  0.0,  1.0, 0.0, 0.0,
		 -s,    0.0, c,   0.0,
		  0.0,  0.0, 0.0, 1.0,
	]).Multiply(this);
};
const rotateZ = function(radians){
	const c = Math.cos(radians);
	const s = Math.sin(radians);
	return CreateMatrix([
		 c,   s,   0.0, 0.0,
		-s,   c,   0.0, 0.0,
		 0.0, 0.0, 1.0, 0.0,
		 0.0, 0.0, 0.0, 1.0,
	]).Multiply(this);
};
const scale = function(sx, sy, sz) {
	return CreateMatrix([
		sx, 0,  0,  0,
		0,  sy, 0,  0,
		0,  0,  sz, 0,
		0,  0,  0,  1,
	]).Multiply(this);
}

const Transform = function(m, v) {
	const m00 = m[0 * 4 + 0];
	const m01 = m[0 * 4 + 1];
	const m02 = m[0 * 4 + 2];
	const m03 = m[0 * 4 + 3];
	const m10 = m[1 * 4 + 0];
	const m11 = m[1 * 4 + 1];
	const m12 = m[1 * 4 + 2];
	const m13 = m[1 * 4 + 3];
	const m20 = m[2 * 4 + 0];
	const m21 = m[2 * 4 + 1];
	const m22 = m[2 * 4 + 2];
	const m23 = m[2 * 4 + 3];
	const m30 = m[3 * 4 + 0];
	const m31 = m[3 * 4 + 1];
	const m32 = m[3 * 4 + 2];
	const m33 = m[3 * 4 + 3];
	return CreateMatrix([
		m00 * v[0] + m01 * v[1] + m02 * v[2] + m03 * v[3],
		m10 * v[0] + m11 * v[1] + m12 * v[2] + m13 * v[3],
		m20 * v[0] + m21 * v[1] + m22 * v[2] + m23 * v[3],
		m30 * v[0] + m31 * v[1] + m32 * v[2] + m33 * v[3],
	]);
};

const translate = function(tx, ty, tz) {
	return CreateMatrix([
		1,  0,  0,  0,
		0,  1,  0,  0,
		0,  0,  1,  0,
		tx, ty, tz, 1,
	]).Multiply(this);
};

const transpose = function() {
	const m = this;
	return CreateMatrix([
		m[0], m[4], m[8],  m[12],
		m[1], m[5], m[9],  m[13],
		m[2], m[6], m[10], m[14],
		m[3], m[7], m[11], m[15]
	]);
};

const toArray = function() {
	const m = this;
	return [
		m[0],  m[1],  m[2],  m[3],
		m[4],  m[5],  m[6],  m[7],
		m[8],  m[9],  m[10], m[11],
		m[12], m[13], m[14], m[15],
	];
};

