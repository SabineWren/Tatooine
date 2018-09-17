export { ShaderSourceFragment }
const ShaderSourceFragment = `#version 300 es

precision highp float;

uniform mat4 model;
//uniform mat4 proj;
//uniform mat4 view;
//uniform vec3 mirrorColour;

//uniform sampler2D textureOfSpider;

in vec3 v_normal;
in vec3 v_position;
in vec2 v_textureCoord;

out vec4 outColour;

float brightness;
vec3 lightSource = vec3(1.2, 2.0, 4.0);

void main() {
	vec3 normal = ( model * vec4(v_normal.xyz, 0.0) ).xyz;
	normal = normalize(normal);
	
	//vec3 objectToLightSource = lightSource.xyz - (  model * vec4( positionVtoF.xyz, 0.0 )  ).xyz;
	//objectToLightSource = normalize(objectToLightSource);
	
	//float brightness = max(0.0, dot(normal, objectToLightSource) );
	
	//outColour = texture2D(textureOfSpider, textureCoordVtoF) * vec4( (colourVtoF.rgb * mirrorColour.rgb) * brightness, 1.0);
	outColour = vec4(abs(normal.xyz), 1.0);
}
`
