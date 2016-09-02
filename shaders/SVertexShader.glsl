attribute vec2 id;

uniform sampler2D positionsTex;
uniform sampler2D colorTex;
uniform sampler2D vertexPos;
uniform sampler2D atomsRadiusTex;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 texsize;
uniform float vertexsize;
uniform float radiusScale;
uniform float minradius;
uniform float test[8];

varying mat4 mvMatrix;
varying vec4 vertexP;
varying vec4 fcolor;

void main(void) {

    int row1 = int(id.x/texsize[0]);
    vec2 texpos1 = vec2((id.x - float(row1)*texsize[0])/texsize[0], float(row1)/texsize[1]);

    vec2 texpos2 = vec2((id.y + 1.0)/(vertexsize+1.0), 0.0);

    vec3 t = vec3(texture2D(positionsTex, texpos1));
    vec4 pos = texture2D(vertexPos, texpos2);

    float radius = radiusScale*texture2D(atomsRadiusTex, texpos1).a;
    if(radius < minradius) radius = minradius;

    mvMatrix =  viewMatrix * mat4(radius, 0.0, 0.0, 0.0,
                                  0.0, radius  , 0.0, 0.0,
                                  0.0, 0.0, radius  , 0.0,
                                  t.x, t.y, t.z, 1.0 );;

    gl_Position = projectionMatrix * mvMatrix * pos;

    vertexP = pos;
    fcolor = texture2D(colorTex, texpos1);
}
