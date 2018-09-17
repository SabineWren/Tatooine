/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { FetchText } from "./fetch.js";
import { GravConst, UpdateGeometry } from "./geometryLoop.js";
import * as Loader from "../node_modules/webgl-obj-loader/src/index.js";
import * as Input from "./input.js";
import * as M3 from "./matrices3D.js";
import * as M4 from "./matrices4D.js";
import { Draw } from "./renderLoop.js";
import { ResizeCanvas } from "./resize.js";
import * as Create from "../shaders/create.js";
import { ShaderSourceVertex } from "../shaders/vertex.js";
import { ShaderSourceFragment } from "../shaders/frag.js";
import { State } from "./state.js";

State.canvas = document.getElementById("c");
State.gl = State.canvas.getContext("webgl2");
const gl = State.gl;
if (!gl) { alert("webgl2 is not supported by your device") }
//allow right click for camera control
State.canvas.oncontextmenu = function(event) {
	event.preventDefault();
	return false;
};

window.onload = async function() {
	const sphereStr = await FetchText(new Error(), "../objects/sphere.obj");
	const mesh = new Loader.Mesh(sphereStr);
	console.log(mesh);
	
	const models = [
		{
			mass: 4.5,
			matrix: M4.GetIdentity()
				.Translate(-10.0, 0.0, -5.0)
				.Scale(0.2, 0.2, 0.2),
			mesh: mesh,
			name: "tatoo1",
			velocity: [0.0, 0.0, 0.0],
			//velocity: [0.0, 0.0, Math.sqrt(GravConst * 9.0 / 20.0) / 2],
		},
		{
			mass: 4.5,
			matrix: M4.GetIdentity()
				.Translate(10.0, 0.0, -5.0)
				.Scale(0.2, 0.2, 0.2),
			mesh: mesh,
			name: "tatoo2",
			velocity: [0.0, 0.0, 0.0],
			//velocity: [0.0, 0.0, -Math.sqrt(GravConst * 9.0 / 20.0) / 2],
		},
		{
			mass: 1,
			matrix: M4.GetIdentity()
				.Translate(-100.0, 0.0, -5.0)
				.Scale(0.1, 0.1, 0.1),
			mesh: mesh,
			name: "tatooine",
			velocity: [0.0, 0.0, 0.0],
		}
	];
	
	const allPairs = models.map(function(x, index) {
		return models
			.filter( (y, i) => i > index)
			.map(y => [x, y])
	}).reduce((acc, val) => acc.concat(val), []);
	
	//This doesn't work. It assumes V = sum of paired Vs, which is false.
	allPairs.forEach(function(pair) {
		const a = pair[0];
		const b = pair[1];
		
		const positionA = M4.GetPosition(a.matrix);
		const positionB = M4.GetPosition(b.matrix);
		
		//barycentre
		const totalMass = a.mass + b.mass;
		const posAWeighted = M3.Scale(positionA, a.mass / totalMass);
		const posBWeighted = M3.Scale(positionB, b.mass / totalMass);
		const baryCentre = M3.Add(posAWeighted, posBWeighted);
		
		//relative distances
		const rRelA = M3.Magnitude(M3.Minus(baryCentre, positionA));
		const rRelB = M3.Magnitude(M3.Minus(baryCentre, positionB));
		
		//initial speeds
		const vA = (b.mass / totalMass) * Math.sqrt(GravConst * b.mass / rRelA);
		const vB = (a.mass / totalMass) * Math.sqrt(GravConst * a.mass / rRelB);
		
		a.velocity[2] += vA;
		b.velocity[2] -= vB;
	});
	models[2].velocity[2] = -0.07//since allPairs doesn't work

	const shaderVertex   = Create.Shader(gl, gl.VERTEX_SHADER,   ShaderSourceVertex);
	const shaderFragment = Create.Shader(gl, gl.FRAGMENT_SHADER, ShaderSourceFragment);

	const program = Create.Program(gl, shaderVertex, shaderFragment);

	Loader.initMeshBuffers(gl, mesh);

	const locations = Object.freeze({
		model: gl.getUniformLocation(program, "model"),
		normal: gl.getAttribLocation(program, "in_normal"),
		position: gl.getAttribLocation(program, "in_position"),
		proj: gl.getUniformLocation(program, "proj"),
		texture: gl.getAttribLocation(program, "in_texture"),
		view: gl.getUniformLocation(program, "view")
	});
	Object.keys(locations).forEach(function(key, index) {
		if(locations[key] === -1) { console.log(key + ": " + locations[key]); }
	});

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	//texture
	//TODO

	//lighting here??
	//TODO

	document.onkeydown   = Input.HandleKeyDown;
	document.onkeyup     = Input.HandleKeyUp;
	document.onmousedown = Input.HandleMouseDown;
	document.onmousemove = Input.HandleMouseMove;
	document.onmouseup   = Input.HandleMouseUp;

	const renderIfNeeded = function() {
		ResizeCanvas(State);
		UpdateGeometry(models, State);
		if(State.needToRender){
			State.needToRender = false;
			Input.UpdateViewMat();
			Draw(locations, models, program, State);
		}
		window.requestAnimationFrame(renderIfNeeded);
	}
	renderIfNeeded();
}();

