export { Program, Shader };

/*** Helper Functions ***/
const Program = function(gl, shaderVertex, shaderFragment){
	const program = gl.createProgram();
	gl.attachShader(program, shaderVertex);
	gl.attachShader(program, shaderFragment);
	gl.linkProgram(program);
	
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) { return program; }
	
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
};

const Shader = function(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) { return shader; }
	
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
};

