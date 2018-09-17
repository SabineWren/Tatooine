export { ShaderSourceVertex }
const ShaderSourceVertex = `#version 300 es

uniform mat4 model;
uniform mat4 proj;
uniform mat4 view;

in vec3 in_normal;
in vec4 in_position;
in vec2 in_texture;

out vec3 v_normal;
out vec3 v_position;
out vec2 v_textureCoord;

void main() {
	v_normal       = in_normal;
	v_position     = in_position.xyz;
	v_textureCoord = in_texture;
	gl_Position    = proj * view * model * in_position;
}
`
