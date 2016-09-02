precision highp float;

varying vec2 texPos;
uniform sampler2D positionsTex;

void main(void) {
    float m = 100.0;//300.0;
    vec3 pos = texture2D(positionsTex, texPos).xyz;
    float k = length(pos)/m;

    float inc = 2.0*k;
    float dec = 1.0;

    if(k>0.5){
        dec  = 1.0-2.0*(k-0.5);
        inc = 1.0;
    }

    //gl_FragColor = vec4(1.6*inc,0.4*dec,0.0,1.0);
    gl_FragColor = vec4(pos,1.0);
}
