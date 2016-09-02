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

    // ############ FINE
    vec3 v12 = pos1 - pos2;
    vec3 v32 = pos3 - pos2;
    float d12 = length(v12);
    float d32 = length(v32);
    float costheta = dot(v12,v32)/(d12*d32);
    float diff;

    // ############# FINE
    if(costheta > 1.0) costheta = 1.0;
    else if(costheta < -1.0) costheta = -1.0;

    // ############# FINE
    if(normal == 1.0) diff = acos(costheta) - theta0;
    else diff = costheta - cos(theta0);

    gl_FragColor = vec4(k*diff*diff,0.0,0.0,1.0);
    //gl_FragColor = vec4(distance(pos1, pos3),0.0,0.0,1.0);

    //gl_FragColor = vec4(theta,0.0,0.0,1.0);

    /*// ############## NOT FINE
    float sintheta = sqrt(1.0 - costheta*costheta);
    if(normal != 1.0) diff *= 2.0*k;
    else if(sintheta<0.000001) diff = -sign(diff)*2.0*k;
    else diff *= -2.0*k/sintheta;

    float c1 = (diff/d12);
    float c2 = (diff/d32);
    vec3 nv12 = v12 / d12;
    vec3 nv32 = v32 / d32;
    vec3 f1 = c1*(nv12*costheta - nv32);
    vec3 f3 = c2*(nv32*costheta - nv12);
    vec3 f2 = -f1-f3;

    // ############## FINE
    if (n==1) gl_FragColor = vec4(f1, 1.0);
    else if(n==2) gl_FragColor = vec4(f2, 1.0);
    else if(n==3) gl_FragColor = vec4(f3, 1.0);
    else gl_FragColor = vec4(0.0,0.0,0.0,1.0);*/
}
