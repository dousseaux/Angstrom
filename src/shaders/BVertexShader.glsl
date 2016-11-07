attribute vec2 id;

uniform sampler2D positionTex;
uniform sampler2D bondsTex;
uniform sampler2D colorTex;
uniform sampler2D vertexPos;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float lightmode;
uniform float shininess;
uniform vec2 size;
uniform float vTexsize;
uniform float radius;
varying mat4 mvMatrix;
varying vec4 vertexP;
varying vec3 vertexN;
varying float fshininess;
varying float flightmode;
varying vec4 fcolor1;
varying vec4 fcolor2;
varying vec4 fcolor0;

void main(void) {

    // Position Index
    int row1 = int(id.x/size[0]);
    vec2 texpos1 = vec2((id.x - float(row1)*size[0])/size[0], float(row1)/size[1]);

    // Vertex Texture index
    int row2 = int(id.y/vTexsize);
    vec2 texpos2 = vec2((id.y + + 1.0 - float(row2)*(vTexsize+1.0))/(vTexsize+1.0), 1.0);

    vec2 bond = vec2(texture2D(bondsTex, texpos1));

    int row3 = int(bond.x/size[0]);
    vec2 p1texpos = vec2((bond.x - float(row3)*size[0])/size[0], float(row3)/size[1]);

    int row4 = int(bond.y/size[0]);
    vec2 p2texpos = vec2((bond.y - float(row4)*size[0])/size[0], float(row4)/size[1]);

    float idl = id.y + 3.0;

    int row5 = int(idl/vTexsize);
    vec2 texpos5 = vec2((idl + 1.0 - float(row5)*(vTexsize+1.0))/(vTexsize+1.0), 1.0);


    vec4 pos = texture2D(vertexPos, texpos2);

    vec3 p1 = vec3(texture2D(positionTex, p1texpos));
    vec3 p2 = vec3(texture2D(positionTex, p2texpos));

    vec3 vy = (p2 - p1);
    vec3 ey = normalize(p2 - p1);
    vec3 ex = normalize(vec3(0.0,1.0,0.0) - dot(vec3(0.0,1.0,0.0), ey)*ey);
    vec3 ez = normalize(cross(ex,ey));

    float s = 0.2;

    pos.x *= radius;
    pos.z *= radius;
    float si = sin(-1.15);
    float co = cos(-1.15);

    pos = mat4(  co , 0.0, si , 0.0,
                         0.0, 1.0, 0.0, 0.0,
                        -si , 0.0, co , 0.0,
                         0.0, 0.0, 0.0, 1.0) * pos;

    mat4 mMatrix = mat4( ex.x, ex.y, ex.z, 0.0,
                         vy.x, vy.y, vy.z, 0.0,
                         ez.x, ez.y, ez.z, 0.0,
                         p1.x, p1.y, p1.z, 1.0);


    mvMatrix = viewMatrix*mMatrix;

    gl_Position = projectionMatrix * mvMatrix * pos;

    vec3 n = mat3(viewMatrix)*cross(normalize(vy),normalize(mat3(mMatrix)*vec3(texture2D(vertexPos, texpos5) - pos)));

    vertexP = pos;
    vertexN = n;
    flightmode = lightmode;
    fshininess = shininess;
    fcolor1 = texture2D(colorTex, p1texpos);
    fcolor2 = texture2D(colorTex, p2texpos);
    if(pos.y >0.0) fcolor0 = fcolor2;
    else fcolor0 = fcolor1;
}
