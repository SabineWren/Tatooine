let shaderSourceFragment = `
precision mediump float;

/*
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform samplerXX iChannel0;          // input channel. XX = 2D/Cube
The texture is the holographic image itself, not the projection effect!
*/

varying vec2 fragCoord;
//Borrowed from https://www.shadertoy.com/view/4dX3WN

vec3 rgb2hsv(vec3 rgb)
{
	float Cmax = max(rgb.r, max(rgb.g, rgb.b));
	float Cmin = min(rgb.r, min(rgb.g, rgb.b));
    float delta = Cmax - Cmin;

	vec3 hsv = vec3(0., 0., Cmax);
	
	if (Cmax > Cmin)
	{
		hsv.y = delta / Cmax;

		if (rgb.r == Cmax)
			hsv.x = (rgb.g - rgb.b) / delta;
		else
		{
			if (rgb.g == Cmax)
				hsv.x = 2. + (rgb.b - rgb.r) / delta;
			else
				hsv.x = 4. + (rgb.r - rgb.g) / delta;
		}
		hsv.x = fract(hsv.x / 6.);
	}
	return hsv;
}

float chromaKey(vec3 color)
{
	vec3 backgroundColor = vec3(0.157, 0.576, 0.129);
	vec3 weights = vec3(4., 1., 2.);

	vec3 hsv = rgb2hsv(color);
	vec3 target = rgb2hsv(backgroundColor);
	float dist = length(weights * (target - hsv));
	return 1. - clamp(3. * dist - 1.5, 0., 1.);
}

//based on Mario scan line:

vec3 Scanline(vec3 color, vec2 uv)
{
   float scanline    = clamp( 0.95 + 0.05 * cos( 3.14 * ( uv.y + 0.008 * iTime ) * 240.0 * 1.0 ), 0.0, 1.0 );
   float grille    = 0.85 + 0.15 * clamp( 1.5 * cos( 3.14 * uv.x * 640.0 * 1.0 ), 0.0, 1.0 );    
   return color * scanline * grille * 1.2;
}

//from tv flickering: https://www.shadertoy.com/view/4tSGzy

float rand(vec2 seed) {
    float dotResult = dot(seed.xy, vec2(12.9898,78.233));
    float sin = sin(dotResult) * 43758.5453;
    return fract(sin);
}

//mine:

vec3 makeBlue(vec3 i)
{
    return vec3(0.0, 0.0, (i.r + i.g + i.b)/3.0);
}

vec3 edgeSample(vec2 uv)
{    
  if(uv.x > 1.0) return vec3(0.0);
  if(uv.x < 0.0) return vec3(0.0);
  if(uv.y > 1.0) return vec3(0.0);
  if(uv.y < 0.0) return vec3(0.0);
  vec3 c = texture(iChannel0, clamp(uv,0.0,1.0)).rgb;
  float incrustation = chromaKey(c);
  //color = changeSaturation(color, 0.5);
  c = mix(c, vec3(0.0), incrustation);
  return c;
}

vec3 a(vec2 uv, float y, vec2 emmitPoint)
{
   //y=0.5;
   //emmitPoint = vec2(mod(iTime, 1.0),-(mod(iTime, 1.0)));

   uv -= emmitPoint;
   y -= emmitPoint.y;
   float ym = y;

   vec2 centre = vec2(0.0, y);
   vec2 scale = vec2(2.0, 2.0 * (0.5/y));

   vec2 n = (uv - centre)*scale * vec2(1.0,-1.0);
   
   vec2 n2 = vec2(n.x * (1.0/(1.0-n.y)), n.y);
   
   vec2 uv2 = n2 * vec2(1.0,-1.0) / scale + centre;
   
   uv2 += emmitPoint;
   y += emmitPoint.y;
   
   uv2.y = y;
   
   vec3 c = edgeSample(uv2);
   
   c *= clamp(((ym+0.2)-uv.y)/ym, 0.0, 1.0);
   
   return c;
}

void main()
{
   vec2 uv = fragCoord.xy / iResolution.xy;
    
   //Invert for video
   uv = vec2(uv.x,1.0-uv.y);
    
   uv = (uv - vec2(0.5,0.0)) * 1.5 + vec2(0.5,-0.5);
    
   vec2 uvFlicker = uv;
   
   //flicker
   uvFlicker.x += rand(vec2(0,uv.y)*(iTime)) * 0.005;
   uvFlicker.y += rand(vec2(0,uv.x)*(iTime)) * 0.005;
    
   vec3 c = vec3(0.0);
   
   float inc = 0.2;
   vec2 projectionPoint = vec2(0.0,-0.5);
   
   for(float i=0.0;i<=1.0;i += 0.2){
      c += a(uv, i, projectionPoint) * inc * 3.0;
   }
   
   c += Scanline(edgeSample(uvFlicker)*1.5, uv);
   
   gl_FragColor = vec4(makeBlue(c), 1.0);
}
`
