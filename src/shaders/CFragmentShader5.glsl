precision highp float;

varying vec2 texPos;
uniform vec2 texsize;
uniform sampler2D anglesTex;
uniform sampler2D theta0NKTex;
uniform sampler2D positionsTex;

bool isnan(float val)
{
  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true;
}

void main(void) {

    const float pi = 3.14159265359;

    float particle1 = texture2D(anglesTex, texPos).x;
    float particle2 = texture2D(anglesTex, texPos).y;
    float particle3 = texture2D(anglesTex, texPos).z;
    int n = int(texture2D(anglesTex, texPos).a);
    float theta0 = (pi/180.0)*texture2D(theta0NKTex, texPos).x;
    float normal = texture2D(theta0NKTex, texPos).y;
    float k = texture2D(theta0NKTex, texPos).z;

    // Get position of particle 1 from texture
    int row = int(particle1/texsize[0]);
    vec2 texP = vec2((particle1 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    vec3 pos1 = texture2D(positionsTex, texP).xyz;
    // Get position of particle 1 from texture
    row = int(particle2/texsize[0]);
    texP = vec2((particle2 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    vec3 pos2 = texture2D(positionsTex, texP).xyz;
    // Get position of particle 1 from texture
    row = int(particle3/texsize[0]);
    texP = vec2((particle3 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    vec3 pos3 = texture2D(positionsTex, texP).xyz;

    // ############ FINE
    vec3 v12 = pos1 - pos2;
    vec3 v32 = pos3 - pos2;
    float d12 = length(v12);
    float d32 = length(v32);
    float costheta = dot(v12,v32)/(d12*d32);
    float diff;

    if(isnan(costheta)) n = 4;

    // ############# FINE
    if(costheta > 1.0) costheta = 1.0;
    else if(costheta < -1.0) costheta = -1.0;

    // ############# FINE
    if(normal == 1.0) diff = acos(costheta) - theta0;
    else diff = costheta - cos(theta0);

    gl_FragColor = vec4(k*diff*diff,0.0,0.0,1.0);
}
