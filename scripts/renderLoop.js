/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { Draw };

const Draw = function(locations, models, program, state) {
	const gl = state.gl;
	
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	//
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//
	gl.useProgram(program);
	
	//WebGLUniformLocation location, GLboolean transpose, const GLfloat *value
	gl.uniformMatrix4fv(locations.proj, false, new Float32Array(state.matrices.proj));
	gl.uniformMatrix4fv(locations.view, false, new Float32Array(state.matrices.view));
	
	models.forEach(model => drawMesh(gl, locations, model.mesh, model.matrix));
}

const drawMesh = function(gl, locations, mesh, modelMatrix) {
	gl.uniformMatrix4fv(locations.model, false, new Float32Array(modelMatrix));
	//
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
	gl.enableVertexAttribArray(locations.position);
	gl.vertexAttribPointer(locations.position, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
	gl.enableVertexAttribArray(locations.normal);
	gl.vertexAttribPointer(locations.normal, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	//
	gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

