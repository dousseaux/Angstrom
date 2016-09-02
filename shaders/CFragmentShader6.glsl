precision mediump float;

varying vec2 texPos;
uniform vec2 texsize;
uniform sampler2D bondsTex;
uniform sampler2D kbTex;
uniform sampler2D positionTex;

void main(void) {

    float particle1 = texture2D(bondsTex, texPos).x;
    float particle2 = texture2D(bondsTex, texPos).y;
    float k = texture2D(kbTex, texPos).x;
    float b = texture2D(kbTex, texPos).y;

    // Get position of particle 1 from texure
    int row = int(particle1/texsize[0]);
    vec2 texP = vec2((particle1 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    vec3 pos1 = texture2D(positionTex, texP).xyz;
    // Get position of particle 1 from texure
    row = int(particle2/texsize[0]);
    texP = vec2((particle2 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    vec3 pos2 = texture2D(positionTex, texP).xyz;

    float diff = distance(pos1,pos2) - b;
    gl_FragColor = vec4(k*diff*diff,0.0,0.0, 1.0);
    //gl_FragColor = vec4((pos1 - pos2), 1.0);
}
