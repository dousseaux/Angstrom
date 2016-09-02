precision mediump float;

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform vec3 light;
uniform float lightmode;
uniform float shininess;

varying mat4 mvMatrix;
varying vec4 vertexP;
varying vec4 fcolor;

void main(void) {

    vec3 L1;
    vec3 L2;
    vec3 H1;
    vec3 H2;

    vec3 pos = vec3(mvMatrix*vertexP);
    vec3 N = -normalize(mat3(mvMatrix)*vec3(vertexP));

    vec3 light2 = light * vec3(8.0*light.z,16.0*light.z,1.0);

    if(lightmode > 0.0){
        L1 = normalize(pos - light);
        H1 = normalize(L1 - normalize(-pos));
        L2 = normalize(pos - light2);
        H2 = normalize(L2 - normalize(-pos));
    }else{
        L1 = normalize(light);
        H1 = normalize(L1);
        L2 = normalize(light2);
        H2 = normalize(L2);
    }


    float Kd = max(dot(L1, N), 0.0) + 0.35*max(dot(L2, N), 0.0);
    float Ks = pow(max(dot(N, H1), 0.0), shininess) +  1.2*pow(max(dot(N, H2), 0.0), 3.0*shininess);
    //if(dot(L1, N) < 0.0 || dot(L2, N) < 0.0) Ks = 0.0;

    vec4 ambient = ambientColor;
    vec4 diffuse =  Kd * diffuseColor;
    vec4 specular = Ks * specularColor;

    gl_FragColor = vec4(vec3(fcolor*(ambient + diffuse + specular)), fcolor.a);
}
