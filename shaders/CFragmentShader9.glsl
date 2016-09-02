precision highp float;

varying vec2 texPos;
uniform sampler2D positionsTex;
uniform sampler2D positions0Tex;
uniform float lambda;

void main(void) {
    vec3 pos = texture2D(positionsTex, texPos).xyz;
    vec3 pos0 = texture2D(positions0Tex, texPos).xyz;
    gl_FragColor = vec4(lambda*(pos-pos0) + pos, 1.0);
}
