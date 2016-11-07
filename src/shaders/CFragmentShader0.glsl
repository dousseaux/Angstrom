precision highp float;

varying vec2 texPos;
uniform vec2 texsize;
uniform sampler2D anglesTex;
uniform sampler2D theta0NKTex;
uniform sampler2D positionsTex;

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

    vec3 v12 = pos1 - pos2;
    vec3 v32 = pos3 - pos2;
    float d12 = length(v12);
    float d32 = length(v32);
    float costheta = dot(v12,v32)/(d12*d32);
    float diff;

    if(costheta > 1.0) costheta = 1.0;
    else if(costheta < -1.0) costheta = -1.0;

    if(normal == 1.0) diff = acos(costheta) - theta0;
    else diff = costheta - cos(theta0);

    float sintheta = sqrt(1.0 - costheta*costheta);
    if(normal != 1.0) diff *= 2.0*k;
    else if(sintheta<0.000001) diff = -sign(diff)*2.0*k;
    else diff *= -2.0*k/sintheta;
    
    if (n==1) gl_FragColor = vec4(diff*(costheta*(v12/d12) - (v32/d32))/d12, 1.0);
    else if(n==2) gl_FragColor = vec4(- diff*(costheta*(v32/d32) - (v12/d12))/d32 - diff*(costheta*(v12/d12) - (v32/d32))/d12, 1.0);
    else if(n==3) gl_FragColor = vec4(diff*(costheta*(v32/d32) - (v12/d12))/d32, 1.0);
    else gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
