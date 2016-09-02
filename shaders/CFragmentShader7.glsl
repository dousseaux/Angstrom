precision highp float;

varying vec2 texPos;
uniform vec2 texsize;
uniform vec3 positiveLimit;
uniform vec3 negativeLimit;
uniform sampler2D bondIndexTex;
uniform sampler2D atomBondsTex;
uniform sampler2D angleIndexTex;
uniform sampler2D atoms_massTex;
uniform sampler2D atoms_chargeTex;
uniform sampler2D atoms_typeCodesTex;
uniform sampler2D positionsTex;
uniform sampler2D positions0Tex;
uniform sampler2D e12r12r6Tex;

uniform float Er;
uniform float Kc;
uniform float dt;
uniform float natoms;
uniform float ntypes;

void main(void) {

    vec4 atomBonds = texture2D(atomBondsTex, texPos);
    vec4 atomBonds2[4];

    vec3 pos0 = texture2D(positions0Tex, texPos).xyz;
    vec3 pos1 = texture2D(positionsTex, texPos).xyz;
    vec3 pos2;
    vec3 r;
    vec3 e12r12r6;
    vec3 energy = vec3(0.0,0.0,0.0);

    vec2 texPos2;

    int row;

    bool interact = false;

    float q1 = texture2D(atoms_chargeTex, texPos).a;
    float q2;
    float type1 = texture2D(atoms_typeCodesTex, texPos).a;
    float type2;
    float mass = texture2D(atoms_massTex, texPos).a;
    float d;
    float k = 15.0;

    for(int i=0; i<4; i++) atomBonds2[i] = vec4(-1.0,-1.0,-1.0,-1.0);

    if(atomBonds.x != -1.0){
        row = int(atomBonds.x/texsize[0]);
        texPos2 = vec2((atomBonds.x - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
        atomBonds2[0] = texture2D(atomBondsTex, texPos2);
        if(atomBonds.y != -1.0){
            row = int(atomBonds.y/texsize[0]);
            texPos2 = vec2((atomBonds.y - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
            atomBonds2[1] = texture2D(atomBondsTex, texPos2);
            if(atomBonds.z != -1.0){
                row = int(atomBonds.z/texsize[0]);
                texPos2 = vec2((atomBonds.z - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
                atomBonds2[2] = texture2D(atomBondsTex, texPos2);
                if(atomBonds.a != -1.0){
                    row = int(atomBonds.a/texsize[0]);
                    texPos2 = vec2((atomBonds.a - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
                    atomBonds2[3] = texture2D(atomBondsTex, texPos2);
                }
            }
        }
    }

    for(float i=0.0; i<.0; i++){
        // Get texture position of the second particle
        row = int(i/texsize[0]);
        texPos2 = vec2((i - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
        // Get position of second particle and calculate vector R
        pos2 = texture2D(positionsTex, texPos2).xyz;
        r = pos2 - pos1;
        d = length(r);
        // Check if particle is valid
        if(d>0.0){
            interact = atomBonds.x != i && atomBonds.y != i && atomBonds.z != i && atomBonds.a != i
                     && atomBonds2[0].x != i && atomBonds2[0].y != i && atomBonds2[0].z != i && atomBonds2[0].a != i
                     && atomBonds2[1].x != i && atomBonds2[1].y != i && atomBonds2[1].z != i && atomBonds2[1].a != i
                     && atomBonds2[2].x != i && atomBonds2[2].y != i && atomBonds2[2].z != i && atomBonds2[2].a != i
                     && atomBonds2[3].x != i && atomBonds2[3].y != i && atomBonds2[3].z != i && atomBonds2[3].a != i;

            if(interact){
                r /= d;
                // Particle 2 charge and type
                q2 = texture2D(atoms_chargeTex, texPos2).a;
                type2 = texture2D(atoms_typeCodesTex, texPos2).a;
                // Get epsolon*12, r^12, r^6
                texPos2 = vec2(type2/ntypes, type1/ntypes);
                e12r12r6 = texture2D(e12r12r6Tex, texPos2).xyz;
                // Coulomb force
                energy.x += 0.5*Kc*q1*q2/(Er*d);
                // Lennard Jones force
                energy.y -= e12r12r6.x*((e12r12r6.y/pow(d,12.0))-2.0*(e12r12r6.z/pow(d,6.0)))/24.0;
            }
        }
    }

    /*vec3 diff = vec3(0.0,0.0,0.0);
    if(pos1.x > positiveLimit.x) diff.x += (pos1.x - positiveLimit.x);
    else if(pos1.x < negativeLimit.x) diff.x += (pos1.x - negativeLimit.x);
    if(pos1.y > positiveLimit.y) diff.y += (pos1.y - positiveLimit.y);
    else if(pos1.y < negativeLimit.y) diff.y += (pos1.y - negativeLimit.y);
    if(pos1.z > positiveLimit.z) diff.z += (pos1.z - positiveLimit.z);
    else if(pos1.z < negativeLimit.z) diff.z += (pos1.z - negativeLimit.z);
    float magsq_diff = dot(diff, diff);
    energy.x += 0.5*k*magsq_diff;*/

    // KINECT ENERGY;
    energy.z = 0.5*mass*pow(length((pos1 - pos0)/dt),2.0);

    gl_FragColor = vec4(energy, 1.0);
}
