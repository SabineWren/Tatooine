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
	//console.log(mesh);
	
	const models = [
		{
			mass: 5,
			matrix: M4.GetIdentity()
				.Translate(-10.0, 0.0, -5.0)
				.Scale(0.2, 0.2, 0.2),
			mesh: mesh,
			name: "tatoo1",
			velocity: [0.0, 0.0, 0.1],
		},
		{
			mass: 6,
			matrix: M4.GetIdentity()
				.Translate(10.0, 0.0, -5.0)
				.Scale(0.25, 0.25, 0.25),
			mesh: mesh,
			name: "tatoo2",
			velocity: [0.0, 0.0, -0.09],
		},
		{
			mass: 0.5,
			matrix: M4.GetIdentity()
				.Translate(-100.0, 0.0, -5.0)
				.Scale(0.08, 0.08, 0.08),
			mesh: mesh,
			name: "tatooine",
			velocity: [0.0, 0.0, 0.08],
		}
	];

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
		if(State.needToRender) {
			State.needToRender = false;
			Input.UpdateViewMat();
			Draw(locations, models, program, State);
		}
		window.requestAnimationFrame(renderIfNeeded);
	}
	UpdateGeometry(models, State);
	renderIfNeeded();
	
	for(;;) {
		await new Promise(resolve => setTimeout(resolve, 0));
		UpdateGeometry(models, State);
	}
}();

