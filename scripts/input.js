/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export {
	HandleKeyDown, HandleKeyUp,
	HandleMouseDown, HandleMouseMove,
	HandleMouseUp, UpdateViewMat
};
import * as M4 from "./matrices4D.js";
import { State } from "./state.js";

const UpdateViewMat = function() {
	if(State.keycount === 0) { return; }
	
	const k = State.keys
	const m = State.matrices;
	if(k.left)      m.view = m.view.Translate(State.keySens, 0.0, 0.0);
	if(k.down)      m.view = m.view.Translate(0.0, State.keySens, 0.0);
	if(k.right)     m.view = m.view.Translate(-State.keySens, 0.0, 0.0);
	if(k.rollRight) m.view = m.view.RotateZ(-State.keySensRotate);
	if(k.rollLeft)  m.view = m.view.RotateZ(State.keySensRotate);
	if(k.back)      m.view = m.view.Translate(0.0, 0.0, -State.keySens);
	if(k.space)     m.view = m.view.Translate(0.0, -State.keySens, 0.0);
	if(k.front)     m.view = m.view.Translate(0.0, 0.0, State.keySens);
};

const KEYCODES = Object.freeze({
	A: 65,
	C: 67,//ctrl is 17
	D: 68,
	E: 69,
	Q: 81,
	S: 83,
	SPACE: 32,
	W: 87
});

const HandleKeyDown = function(event) {
	switch(event.keyCode) {
		case KEYCODES.A:
			if(!State.keys.left) {
				State.keys.left = true;
				State.keycount++;
			}
			break;
		case KEYCODES.C:
			if(!State.keys.down) {
				State.keys.down = true;
				State.keycount++;
			}
			break;
		case KEYCODES.D:
			if(!State.keys.right) {
				State.keys.right = true;
				State.keycount++;
			}
			break;
		case KEYCODES.E:
			if(!State.keys.rollRight) {
				State.keys.rollRight = true;
				State.keycount++;
			}
			break;
		case KEYCODES.Q:
			if(!State.keys.rollLeft) {
				State.keys.rollLeft = true;
				State.keycount++;
			}
			break;
		case KEYCODES.S:
			if(!State.keys.back) {
				State.keys.back = true;
				State.keycount++;
			}
			break;
		case KEYCODES.SPACE:
			if(!State.keys.space) {
				State.keycount++;
				State.keys.space = true;
			}
			break;
		case KEYCODES.W:
			if(!State.keys.front) {
				State.keys.front = true;
				State.keycount++;
			}
			break;
		default:
			break;
	}
};

const HandleKeyUp = function(event) {
	switch(event.keyCode) {
		case KEYCODES.SPACE:
			State.keys.space = false;
			State.keycount--;
			break;
		case KEYCODES.A:
			State.keys.left = false;
			State.keycount--;
			break;
		case KEYCODES.C:
			State.keys.down = false;
			State.keycount--;
			break;
		case KEYCODES.D:
			State.keys.right = false;
			State.keycount--;
			break;
		case KEYCODES.E:
			State.keys.rollRight = false;
			State.keycount--;
			break;
		case KEYCODES.Q:
			State.keys.rollLeft = false;
			State.keycount--;
			break;
		case KEYCODES.S:
			State.keys.back = false;
			State.keycount--;
			break;
		case KEYCODES.W:
			State.keys.front = false;
			State.keycount--;
			break;
		default:
			break;
	}
};

const HandleMouseDown = function(event) {
	State.mouse.clickPrimary = true;
	State.mouse.lastX = event.clientX;
	State.mouse.lastY = event.clientY;
};

const HandleMouseMove = function(event) {
	if (!State.mouse.clickPrimary) { return; }
	
	const deltaX = event.clientX - State.mouse.lastX;
	const deltaY = event.clientY - State.mouse.lastY;
	State.mouse.lastX = event.clientX;
	State.mouse.lastY = event.clientY;
	const rY = deltaX * State.mouse.sensitivity;
	const rX = deltaY * State.mouse.sensitivity;
	
	const cX = Math.cos(-rX);
	const cY = Math.cos(-rY);
	const sX = Math.sin(-rX);
	const sY = Math.sin(-rY);
	
	const rotYX = M4.CreateMatrix([
		 cY, sY*sX, sY*cX, 0.0,
		0.0,    cX,   -sX, 0.0,
		-sY, cY*sX, cY*cX, 0.0,
		0.0,   0.0,   0.0, 1.0
	]);
	State.matrices.view = rotYX.Multiply(State.matrices.view);
};

const HandleMouseUp = function(event) {
	State.mouse.clickPrimary = false;
};

