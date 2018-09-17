/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { ResizeCanvas };
import * as M4 from "./matrices4D.js";

const ResizeCanvas = function(state) {
	const realToCSSPixels = window.devicePixelRatio;
	
	const displayWidth  = Math.floor(state.canvas.clientWidth * realToCSSPixels);
	const displayHeight = Math.floor(state.canvas.clientHeight * realToCSSPixels);
	
	if (state.canvas.width !== displayWidth || state.canvas.height !== displayHeight) {
		state.canvas.width  = displayWidth;
		state.canvas.height = displayHeight;
		state.needToRender = true;
		
		//build perspective
		const aspectRatio = state.gl.drawingBufferWidth / state.gl.drawingBufferHeight;
		const g = state.graphics;
		state.matrices.proj = M4.Proj(aspectRatio, g.far, g.fov, g.near);
	}
};
