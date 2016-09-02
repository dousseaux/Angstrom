attribute vec4 vertexPos;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 color;

varying vec4 fcolor;

void main(void) {
    gl_Position = projectionMatrix * viewMatrix * vertexPos;
    fcolor = color;
}
