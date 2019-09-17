/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { IDENTITY } from "./mat4D.mjs";
import * as M4Mut   from "./mat4DMut.mjs";

const EPSILON = 0.000_000_001;

const assertEqualM4 = function(a, b, err) {
	let isEqual = true;
	if(Math.abs(a[0]  - b[0])  > EPSILON) isEqual = false;
	if(Math.abs(a[1]  - b[1])  > EPSILON) isEqual = false;
	if(Math.abs(a[2]  - b[2])  > EPSILON) isEqual = false;
	if(Math.abs(a[3]  - b[3])  > EPSILON) isEqual = false;
	if(Math.abs(a[4]  - b[4])  > EPSILON) isEqual = false;
	if(Math.abs(a[5]  - b[5])  > EPSILON) isEqual = false;
	if(Math.abs(a[6]  - b[6])  > EPSILON) isEqual = false;
	if(Math.abs(a[7]  - b[7])  > EPSILON) isEqual = false;
	if(Math.abs(a[8]  - b[8])  > EPSILON) isEqual = false;
	if(Math.abs(a[9]  - b[9])  > EPSILON) isEqual = false;
	if(Math.abs(a[10] - b[10]) > EPSILON) isEqual = false;
	if(Math.abs(a[11] - b[11]) > EPSILON) isEqual = false;
	if(Math.abs(a[12] - b[12]) > EPSILON) isEqual = false;
	if(Math.abs(a[13] - b[13]) > EPSILON) isEqual = false;
	if(Math.abs(a[14] - b[14]) > EPSILON) isEqual = false;
	if(Math.abs(a[15] - b[15]) > EPSILON) isEqual = false;
	if(!isEqual) {
		console.log(err);
		console.log(a);
		console.log(b);
	}
};

const assertEqualVec4 = function(a, b, err) {
	let isEqual = true;
	if(Math.abs(a[0]  - b[0])  > EPSILON) isEqual = false;
	if(Math.abs(a[1]  - b[1])  > EPSILON) isEqual = false;
	if(Math.abs(a[2]  - b[2])  > EPSILON) isEqual = false;
	if(Math.abs(a[3]  - b[3])  > EPSILON) isEqual = false;
	if(!isEqual) {
		console.log(err);
		console.log(a);
		console.log(b);
	}
};

const testCompoundTransformations = function() {
	let err = new Error();
	const angleX = Math.PI / 4;
	const angleY = Math.PI / 5;
	const angleZ = Math.PI / 6;
	const sx = 2.0;
	const sy = 3.0;
	const sz = 4.0;
	const tx = 1.0;
	const ty = 2.0;
	const tz = 3.0;
	
	console.log("Missing compound tests!");
	err.message = "Scale X then Translate X";
	err.message = "Translate X then Scale X";
	//
	err.message = "Scale Y then Translate Y";
	err.message = "Translate Y then Scale Y";
	//
	err.message = "Scale Z then Translate Z";
	err.message = "Translate Z then Scale Z";
	
	err.message = "Rotate X then Translate X";
	err.message = "Translate X then Rotate X";
	//
	err.message = "Rotate Y then Translate Y";
	err.message = "Translate Y then Rotate Y";
	//
	err.message = "Rotate Z then Translate Z";
	err.message = "Translate Z then Rotate Z";
};

const testMultiply = function() {
	let err = new Error();
	err.message = "Identities Squared";
	let m1 = IDENTITY.slice();
	let m2 = IDENTITY.slice();
	let expect = IDENTITY.slice();
	let result = M4Mut.Multiply(m1, m2);
	if(m1 !== result) { console.log("Not mutating input"); }
	assertEqualM4(expect, result, err);
	
	err = new Error();
	err.message = "Matrix * IDENTITY";
	m1 = [
		 1,  2,  3,  4,
		 5,  6,  7,  8,
		 9, 10, 11, 12,
		13, 14, 15, 16,
	];
	m2 = IDENTITY.slice();
	expect = m1.slice();
	result = M4Mut.Multiply(m1, m2);
	if(m1 !== result) { console.log("Not mutating input"); }
	assertEqualM4(expect, result, err);
	
	err = new Error();
	err.message = "IDENTITY * Matrix";
	m1 = IDENTITY.slice();
	m2 = [
		 1,  2,  3,  4,
		 5,  6,  7,  8,
		 9, 10, 11, 12,
		13, 14, 15, 16,
	];
	expect = m2.slice();
	result = M4Mut.Multiply(m1, m2);
	if(m1 !== result) { console.log("Not mutating input"); }
	assertEqualM4(expect, result, err);
	
	err = new Error();
	err.message = "Matrix Squared";
	m1 = [
		 1,  2,  3,  4,
		 5,  6,  7,  8,
		 9, 10, 11, 12,
		13, 14, 15, 16,
	];
	m2 = m1.slice();
	expect = [
		90,  100, 110, 120,
		202, 228, 254, 280,
		314, 356, 398, 440,
		426, 484, 542, 600,
	];
	result = M4Mut.Multiply(m1, m2);
	if(m1 !== result) { console.log("Not mutating input"); }
	assertEqualM4(expect, result, err);
};

const testRotate = function() {
	const angle = Math.PI / 4;
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	
	let err = new Error();
	err.message = "Rotation Around X-Axis";
	let modelMatrix = IDENTITY.slice();
	let expect = [
		 1.0, 0.0,  0.0, 0.0,
		 0.0, c,   -s,   0.0,
		 0.0, s,    c,   0.0,
		 0.0, 0.0,  0.0, 1.0,
	];
	let result = M4Mut.RotateX(modelMatrix, angle);
	if(modelMatrix !== result) { console.log("Not mutating input matrix"); }
	assertEqualM4(result, expect, err);
	let v       = [0.0, 1.0, 0.0, 1.0];
	let vExpect = [0.0, 0.707106781, 0.707106781, 1.0];
	let vResult = M4Mut.Transform(modelMatrix, v);
	if(v !== vResult) { console.log("Not mutating input vector"); }
	assertEqualVec4(v, vExpect, err);
	
	err = new Error();
	err.message = "Rotation Around Y-Axis";
	modelMatrix = IDENTITY.slice();
	expect = [
		 c,    0.0, s,   0.0,
		 0.0,  1.0, 0.0, 0.0,
		-s,    0.0, c,   0.0,
		 0.0,  0.0, 0.0, 1.0,
	];
	result = M4Mut.RotateY(modelMatrix, angle);
	if(modelMatrix !== result) { console.log("Not mutating input matrix"); }
	assertEqualM4(result, expect, err);
	v       = [1.0, 0.0, 0.0, 1.0];
	vExpect = [0.707106781, 0.0, -0.707106781, 1.0];
	vResult = M4Mut.Transform(modelMatrix, v);
	if(v !== vResult) { console.log("Not mutating input vector"); }
	assertEqualVec4(v, vExpect, err);
	
	err = new Error();
	err.message = "Rotation Around Z-Axis";
	modelMatrix = IDENTITY.slice();
	expect = [
		 c,  -s,   0.0, 0.0,
		 s,   c,   0.0, 0.0,
		 0.0, 0.0, 1.0, 0.0,
		 0.0, 0.0, 0.0, 1.0,
	];
	result = M4Mut.RotateZ(modelMatrix, angle);
	if(modelMatrix !== result) { console.log("Not mutating input matrix"); }
	assertEqualM4(result, expect, err);
	v       = [1.0, 0.0, 0.0, 1.0];
	vExpect = [0.707106781, 0.707106781, 0.0, 1.0];
	vResult = M4Mut.Transform(modelMatrix, v);
	if(v !== vResult) { console.log("Not mutating input vector"); }
	assertEqualVec4(v, vExpect, err);
	
	err = new Error();
	err.message = "Rotate around X,Y";
	modelMatrix = IDENTITY.slice();
	M4Mut.RotateY(modelMatrix, angle);
	M4Mut.RotateX(modelMatrix, angle);
	v = [0.0, 0.0, 1.0, 1.0];
	//[0.0, -0.707106781, 0.707106781, 1.0]//around X only
	vExpect = [0.5, -0.707106781, 0.5, 1.0];
	vResult = M4Mut.Transform(modelMatrix, v);
	if(v !== vResult) { console.log("Not mutating input vector"); }
	assertEqualVec4(v, vExpect, err);
	
	err = new Error();
	err.message = "Rotate around X,Y,Z";
	modelMatrix = IDENTITY.slice();
	M4Mut.RotateZ(modelMatrix, angle);
	M4Mut.RotateY(modelMatrix, angle);
	M4Mut.RotateX(modelMatrix, angle);
	v = [0.0, 0.0, 1.0, 1.0];
	//[0.0, -0.707106781, 0.707106781, 1.0] X only
	//[0.5, -0.707106781, 0.5, 1.0] X,Y only
	vExpect = [0.85355339, -0.14644661, 0.5, 1.0];
	vResult = M4Mut.Transform(modelMatrix, v);
	if(v !== vResult) { console.log("Not mutating input vector"); }
	assertEqualVec4(v, vExpect, err);
};

const testScale = function() {
	const err = new Error();
	const sx = 2.0;
	const sy = 3.0;
	const sz = 4.0;
	
	let modelMatrix = IDENTITY.slice();
	let expect = [
		sx,    0.0,  0.0, 0.0,
		 0.0, sy,    0.0, 0.0,
		 0.0,  0.0, sz,   0.0,
		 0.0,  0.0,  0.0, 1.0,
	];
	let result = M4Mut.Scale(modelMatrix, sx, sy, sz);
	if(modelMatrix !== result) { console.log("Not mutating input"); }
	assertEqualM4(result, expect, err);
};

const testTranslate = function() {
	const tx = 5.0;
	const ty = 6.0;
	const tz = 2.0;
	
	let err = new Error();
	err.message = "Translate X,Y,Z";
	let modelMatrix = IDENTITY.slice();
	let expect = [
		1,  0,  0,  0,
		0,  1,  0,  0,
		0,  0,  1,  0,
		tx, ty, tz, 1,
	];
	let result = M4Mut.Translate(modelMatrix, tx, ty, tz);
	if(modelMatrix !== result) { console.log("Not mutating input"); }
	assertEqualM4(result, expect, err);
};

testMultiply();
testRotate();
testScale();
testTranslate();
testCompoundTransformations();

