precision highp float;

varying vec2 texPos;
uniform sampler2D positionsTex;
uniform sampler2D velocitiesTex;
uniform float dt;

void main(void) {
    gl_FragColor = vec4(texture2D(positionsTex, texPos).xyz - texture2D(velocitiesTex, texPos).xyz*dt, 1.0);
}
