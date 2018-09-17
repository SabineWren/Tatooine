let shaderSourceFragment = `
precision mediump float;

varying vec2 fragCoord;

/*
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
*/

float sinc(float x)
{
    return (x == 0.0) ? 1.0 : sin(x) / x;
}

float triIsolate(float x)
{
    return abs(-1.0 + fract(clamp(x, -0.5, 0.5)) * 2.0);
}

float waveform(float x)
{
    float prebeat = -sinc((x - 0.37) * 40.0) * 0.6 * triIsolate((x - 0.4) * 1.0);
    float mainbeat = (sinc((x - 0.5) * 60.0)) * 1.2 * triIsolate((x - 0.5) * 0.7) * 1.5;
    float postbeat = sinc((x - 0.91) * 15.0) * 0.85;
    return (prebeat + mainbeat + postbeat) * triIsolate((x - 0.625) * 0.8);
}

float test(vec2 uv)
{
    float delta = 0.00001;
    float x1 = uv.x - delta;
    float x2 = uv.x + delta;
    float y1 = waveform(x1);
    float y2 = waveform(x2);
    
    float x0 = uv.x;
    float y0 = uv.y;
    float d =( (y2-y1)*x0-(x2-x1)*y0+x2*y1-y2*x1 )/sqrt(pow(y2-y1, 2.0)+pow(x2-x1, 2.0));
    
    float t = smoothstep(0.0, 1.0, pow(abs(d), 0.5) * 8.0);
    float w = smoothstep(0.0, 1.0, pow(abs(uv.y - y1), 0.85) * 8.0);

    return min(t, min(t * w, min(t + (t * w) * 0.5, w + (t * w) * 0.5)));
}

float rand(float n){return fract(sin(n) * 43758.5453123);}


void main()
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    float Time = fract(iTime);
    

    float light = 3.0;
    float noise = 0.1 * rand(floor(fract(iTime * 0.1) * 10.0));
    float delta = 1.0 * noise * sin(noise + uv.x);
    uv.y += noise + delta;
    float dist = test(vec2(uv.x * 1.1 + 0.2, uv.y * 4.0 - 1.5)) * 1.5;
    
    if (Time >= uv.x ) {
		gl_FragColor = vec4(vec3(light, 0.0, 0.0) * (1.0 - dist),1.0);

    }

    uv.x *= iResolution.x / iResolution.y;
    
    vec2 tuv = vec2(Time * iResolution.x / iResolution.y, (waveform(Time * 1.1 + 0.2) + 1.5) / 4.0);
    float dotDist = distance(vec2(uv.x, uv.y), tuv);
    
    if (dotDist < 0.0125) {
        gl_FragColor = vec4(smoothstep(0.15, 0.0, dotDist));
    }
       
    uv.y -= noise + delta;        
    
    if (fract(uv.x * 10.0) - 0.0015 < 0.03 || fract(uv.y * 10.0) < 0.03) 
    {
        gl_FragColor = max(gl_FragColor, vec4(0.1));
    }
}
`
