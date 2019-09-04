/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018-2019 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
import { MarshalModel, UnmarshalModel } from "./channels.mjs";
import { FetchText } from "./fetch.mjs";
import * as Loader from "../node_modules/webgl-obj-loader/src/index.js";
import * as Input from "./input.mjs";
import * as M3 from "./matrices3D.mjs";
import * as M4 from "./matrices4D.mjs";
import { Draw } from "./renderLoop.mjs";
import { ResizeCanvas } from "./resize.mjs";
import * as Create from "../shaders/create.mjs";
import { ShaderSourceVertex } from "../shaders/vertex.mjs";
import { ShaderSourceFragment } from "../shaders/frag.mjs";
import { State } from "./state.mjs";

const root = "/";
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
	const sphereStr = await FetchText(new Error(), root + "objects/sphere.obj");
	const mesh = new Loader.Mesh(sphereStr);
	//console.log(mesh);
	
	const models = [
		{
			mass: 5 * Math.pow(10, 9),
			matrix: M4.GetIdentity()
				.Scale(0.2, 0.2, 0.2)
				.Translate(-6.5, 0.0, -5.0),
			mesh: mesh,
			name: "tatoo1",
			velocity: M3.CreateVector([0.0, 0.0, 0.154]),
		},
		{
			mass: 6 * Math.pow(10, 9),
			matrix: M4.GetIdentity()
				.Scale(0.25, 0.25, 0.25)
				.Translate(6.5, 0.0, -5.0),
			mesh: mesh,
			name: "tatoo2",
			velocity: M3.CreateVector([0.0, 0.0, -0.13]),
		},
		{
			mass: 0.15 * Math.pow(10, 9),
			matrix: M4.GetIdentity()
				.Scale(0.08, 0.08, 0.08)
				.Translate(-150.0, 0.0, -5.0),
			mesh: mesh,
			name: "tatooine",
			velocity: M3.CreateVector([0.0, 0.0, 0.06]),
		},
		{
			mass: 0.01111111 * Math.pow(10, 9),
			matrix: M4.GetIdentity()
				.Scale(0.015, 0.015, 0.015)
				.Translate(-140.0, 0.0, -5.0),
			mesh: mesh,
			name: "moon",
			velocity: M3.CreateVector([0.0, 0.0, 0.09]),
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

	console.log("creating worker");
	const geometryWorker = new Worker(
		root + "scripts/geometryWorker.mjs",
		{ type: "module" }
	);
	geometryWorker.onmessage = function(e) {
		const nextState = e.data.map(UnmarshalModel);
		for(let i = 0; i < models.length; i++) {
			models[i].matrix = nextState[i].matrix;
			models[i].velocity = nextState[i].velocity;
		}
	};
	geometryWorker.postMessage(models.map(MarshalModel));

	const render = function() {
		ResizeCanvas(State);
		Input.UpdateViewMat();
		Draw(locations, models, program, State);
		window.requestAnimationFrame(render);
		geometryWorker.postMessage(true);
	}
	render();
}();

