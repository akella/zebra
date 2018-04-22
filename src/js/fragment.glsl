uniform float time;

varying vec2 vUv;
varying vec4 vPosition;

void main()	{


	vec3 color1 = vec3(0.533, 0.847, 0.745);
	vec3 color2 = vec3(0.192, 0.216, 0.576);
	float threshold = 0.005;

	float pi = 3.1415926;
	float f_line = sin(pi*200.*(vUv.x  - 0.08*vUv.y) - time*4.);

	float k = 0.;
	float sk = 0.;

	if(f_line<0.){
		k = -1.;
	} else{
		k = 1.;
	}

	float f_line_a = abs(f_line);

	if(f_line_a<threshold){
		sk = (threshold - f_line_a)/threshold;
		k = f_line*sk + (1. - sk)*k;
	}


	k = (k+1.)/2.;



	vec3 resultcolor = color1*k + color2*(1. - k);
	gl_FragColor = vec4(resultcolor,1.0);
}