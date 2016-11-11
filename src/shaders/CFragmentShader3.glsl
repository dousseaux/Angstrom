//  ###################################################################
//
//                 THIS SHADER IS MADE FOR TEST PURPOSES
//
// ###################################################################

precision highp float;

varying vec2 texPos;
uniform vec2 texsize;
uniform vec3 positiveLimit;
uniform vec3 negativeLimit;

uniform float maxVelocity;
uniform float dt;
uniform float dt2;
uniform float natoms;
uniform float ntypes;

uniform sampler2D bondForcesTex;
uniform sampler2D angleForcesTex;
uniform sampler2D bondIndexTex;
uniform sampler2D atomBondsTex;
uniform sampler2D angleIndexTex;
uniform sampler2D atoms_massTex;
uniform sampler2D atoms_chargeTex;
uniform sampler2D atoms_typeCodesTex;
uniform sampler2D positionsTex;
uniform sampler2D positions0Tex;
uniform sampler2D e12r12r6Tex;

void main(void) {

    const float Kc = 322.0636;
    const float Er = 1.0;

    vec4 atomBonds = texture2D(atomBondsTex, texPos);
    vec4 atomBonds2[4];
    vec4 bondIndex = texture2D(bondIndexTex, texPos);

    vec3 pos0 = texture2D(positions0Tex, texPos).xyz;
    vec3 pos1 = texture2D(positionsTex, texPos).xyz;
    vec3 pos2;
    vec3 r;
    vec3 e12r12r6;
    vec3 force = vec3(0.0,0.0,0.0);
    vec3 bondForces = vec3(0.0,0.0,0.0);

    vec2 texPos2;
    vec2 texPos3;

    int row;
    int nbonds = 0;
    bool interact = false;

    float q1 = texture2D(atoms_chargeTex, texPos).a;
    float q2;
    float type1 = texture2D(atoms_typeCodesTex, texPos).a;
    float type2;
    float mass = texture2D(atoms_massTex, texPos).a;
    float d;
    float a = 0.0;
    float s = 1.0;
    float angleIndex;
    float p;
    float k = 15.0;
    float particle = 8.0*(float(int(texPos.y*texsize[1]))*texsize[0] + float(int(texPos.x*texsize[0])));
    float tsizex1 = texsize[0]*8.0;
    float tsizex2 = texsize[0]*4.0;

    for(float j=0.0; j<8.0; j++){
        row = int(particle/tsizex1);
        texPos2 = vec2((particle-float(row)*tsizex1)/tsizex1, float(row)/texsize[1]);
        angleIndex = texture2D(angleIndexTex, texPos2).a;
        if(angleIndex != -1.0){
            row = int(angleIndex/tsizex2);
            texPos2 = vec2((angleIndex-float(row)*tsizex2)/tsizex2, float(row)/texsize[1]);
            force += texture2D(angleForcesTex, texPos2).xyz;
        }
        particle++;
    }

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

    if(bondIndex.x != 0.0){
        s = sign(bondIndex.x);
        bondIndex.x = s*bondIndex.x - 1.0;
        row = int(bondIndex.x/texsize[0]);
        texPos2 = vec2((bondIndex.x - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
        force += s*texture2D(bondForcesTex, texPos2).xyz;
        if(bondIndex.y != 0.0){
            s = sign(bondIndex.y);
            bondIndex.y = s*bondIndex.y - 1.0;
            row = int(bondIndex.y/texsize[0]);
            texPos2 = vec2((bondIndex.y - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
            force += s*texture2D(bondForcesTex, texPos2).xyz;
            if(bondIndex.z != 0.0){
                s = sign(bondIndex.z);
                bondIndex.z = s*bondIndex.z - 1.0;
                row = int(bondIndex.z/texsize[0]);
                texPos2 = vec2((bondIndex.z - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
                force += s*texture2D(bondForcesTex, texPos2).xyz;
                if(bondIndex.a != 0.0){
                    s = sign(bondIndex.a);
                    bondIndex.a = s*bondIndex.a - 1.0;
                    row = int(bondIndex.a/texsize[0]);
                    texPos2 = vec2((bondIndex.a - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
                    force += s*texture2D(bondForcesTex, texPos2).xyz;
                }
            }
        }
    }

    for(float i=0.0; i<3.0; i++){
        // Get texture position of the second particle
        row = int(i/texsize[0]);
        texPos2 = vec2((i - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
        // Get position of second particle and calculate vector R
        pos2 = texture2D(positionsTex, texPos2).xyz;
        r = pos2 - pos1;
        d = length(r);
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
                force -= (Kc*q1*q2/(Er*d*d))*r;
                // Lennard Jones force
                force += e12r12r6.x*((e12r12r6.y/pow(d,13.0))-(e12r12r6.z/pow(d,7.0)))*r;
            }
        }
    }

    //gl_FragColor = vec4(force.x + force.y + force.z, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(atomBonds.xyz, 1.0);
    gl_FragColor = vec4(atomBonds2[0].xyz,1.0);

    // ########## DISTANCE AND ANGLES
    /*float particle1 = 0.0;
    float particle2 = 1.0;
    float particle3 = 2.0;

    // Get position of particle 1 from texture
    row = int(particle1/texsize[0]);
    vec2 texP = vec2((particle1 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    pos0 = texture2D(positionsTex, texP).xyz;
    // Get position of particle 1 from texture
    row = int(particle2/texsize[0]);
    texP = vec2((particle2 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    pos1 = texture2D(positionsTex, texP).xyz;
    // Get position of particle 1 from texture
    row = int(particle3/texsize[0]);
    texP = vec2((particle3 - float(row)*texsize[0])/texsize[0], float(row)/texsize[1]);
    pos2 = texture2D(positionsTex, texP).xyz;

    vec3 v12 = pos0 - pos1;
    vec3 v32 = pos2 - pos1;
    float d12 = length(v12);
    float d32 = distance(pos2, pos1);
    float theta = (180.0/pi)*acos(dot(v12,v32)/(d12*d32));
    float hey = texture2D(positions0Tex, texPos).x;
    gl_FragColor = vec4(theta,theta,hey, 1.0);*/
}
