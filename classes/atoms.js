/* ######################### ATOMS CLASS (SPHERES) ##############################
 *
 * This class is the graphic representation of each particle. It uses the
 * information directly from the data textures. By default the object has no
 * initial graphical representation. They can be added by informing the id of
 * the particle in world, which will be used as index to get the data from the
 * shaders. */

var atoms = function(world, shader){
    // VARIABLES
    var gl = world.gl;
    var self = this;

    // BUFFERS
    var drawerBuffers = [];
    var drawerArrays = [];

    // SET SHADER ATTRIBUTES POINTERS
    var sphereIdAttribute = gl.getAttribLocation(shader, "id");

    // SET SHADER UNIFORMS POINTERS
    var vertexPositionUniform = gl.getUniformLocation(shader, "vertexPos")
    var positionsUniform = gl.getUniformLocation(shader, "positionsTex");
    var colorUniform = gl.getUniformLocation(shader, "colorTex");
    var projectionMatrixUniform = gl.getUniformLocation(shader, "projectionMatrix");
    var viewMatrixUniform = gl.getUniformLocation(shader, "viewMatrix");
    var lightUniform = gl.getUniformLocation(shader, "light");
    var lightModeUniform = gl.getUniformLocation(shader, "lightmode");
    var shininessUniform = gl.getUniformLocation(shader, "shininess");
    var texsizeUniform = gl.getUniformLocation(shader, "texsize");
    var vertexsizeUniform = gl.getUniformLocation(shader, "vertexsize");
    var radiusScaleUniform = gl.getUniformLocation(shader, "radiusScale");
    var minradiusUniform = gl.getUniformLocation(shader, "minradius");
    var ambientColorUniform = gl.getUniformLocation(shader, "ambientColor");
    var diffuseColorUniform = gl.getUniformLocation(shader, "diffuseColor");
    var specularColorUniform = gl.getUniformLocation(shader, "specularColor");
    var atomsRadiusUniform = gl.getUniformLocation(shader, "atomsRadiusTex");

    /* UPDATE: Update the resolution and reacreate the textures of this class */
    this.update = function(){
        this.updateResolution();
        this.colors = new Float32Array(4*world.texsize.x*world.texsize.y);
        this.colorTex = createDataTexture(gl, world.texsize.x, world.texsize.y, this.colors, 4);
        this.vertexTex = createDataTexture(gl, this.sphereVertexSize, 1.0, this.vertex, 4);
    }

    /* FASTADD: add graphical representation for particles by passing a reference
     * id and the number of ids after the reference */
    this.fastAdd = function(id, n){
        this.ids = new Float32Array(this.idsBuffer, 8*this.sphereVertexSize*this.items, 2*this.sphereVertexSize*n);
        var atoms = [];
        for(var i=id; i<id+n; i++){
            for(var j=0; j<this.sphereVertexSize; j++){
                this.ids[(i-id)*2*this.sphereVertexSize + 2*j] = i;
                this.ids[(i-id)*2*this.sphereVertexSize + 2*j + 1] = j;
            }
            atoms.push(i);
        }
        this.paint(atoms);
        this.atoms = this.atoms.concat(atoms);
        this.items += n;
        this.ids = new Float32Array(this.idsBuffer, 0, 2*this.sphereVertexSize*this.items);
        updateBuffers();
    }

    /* ADDIDS: add graphical representation for particles by passing a vector of
     * ids. */
    this.addIDs = function(ids){
        this.ids = new Float32Array(this.idsBuffer, 8*this.sphereVertexSize*this.items, 2*this.sphereVertexSize*ids.length);
        for(var i=0; i<ids.length; i++){
            for(var j=0; j<this.sphereVertexSize; j++){
                this.ids[i*2*this.sphereVertexSize + 2*j] = ids[i];
                this.ids[i*2*this.sphereVertexSize + 2*j + 1] = j;
            }
        }
        this.paint(ids);
        this.atoms = this.atoms.concat(ids);
        this.items += ids.length;
        this.ids = new Float32Array(this.idsBuffer, 0, 2*this.sphereVertexSize*this.items);
        updateBuffers();
    }

    /* UPDATERESOLUTION: realloc memory for the vertex array and recaculate the
     * vertex positions when the resolution of the sphere is updated */
    this.updateResolution = function(){
        this.sphereVertexSize = this.sphereLatitude*this.sphereLongitude*6;
        if(this.sphereVertexSize*world.texsize.x*world.texsize.y*8 < 2147483648) this.idsBuffer = new ArrayBuffer(this.sphereVertexSize*world.texsize.x*world.texsize.y*8);
        else {
            if(this.natoms > 2147483647/(this.sphereVertexSize*8)) alert("Memory allocation failed. Using maximum size, all the elements might not be drawed.\nPlease drecrease texture size or sphere quality");
            this.idsBuffer = new ArrayBuffer(2147483647);
        }
        createArrays();
        if(this.vertexTex !== null) updateTexture4d(gl, {x: this.sphereVertexSize, y:1}, this.vertexTex, this.vertex);

        var ids = this.atoms;
        this.items = 0;
        this.atoms = [];
        this.addIDs(ids);
    }

    /* PAINT: set the color of each particle according to the worlds color mode,
     * and update the color texture */
    this.paint = function(ids){
        var color = [];
        if(world.colorMode === "atoms"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.atom_colors[world.data.atoms_types[ids[i]][0]];
                this.colors[4*ids[i]] = color[0];
                this.colors[4*ids[i] + 1] = color[1];
                this.colors[4*ids[i] + 2] = color[2];
                this.colors[4*ids[i] + 3] = color[3];
            }
        }
        else if(world.colorMode === "residuals"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.residual_colors[world.data.atoms_residuals[ids[i]][0]];
                this.colors[4*ids[i]] = color[0];
                this.colors[4*ids[i] + 1] = color[1];
                this.colors[4*ids[i] + 2] = color[2];
                this.colors[4*ids[i] + 3] = color[3];
            }
        }else if(world.colorMode === "single"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.single_color;
                this.colors[4*ids[i]] = color[0];
                this.colors[4*ids[i] + 1] = color[1];
                this.colors[4*ids[i] + 2] = color[2];
                this.colors[4*ids[i] + 3] = color[3];
            }
        }else if(world.colorMode === "selected"){
            for(var i=0; i<ids.length; i++){
                color = world.selectionColor;
                this.colors[4*ids[i]] = color[0];
                this.colors[4*ids[i] + 1] = color[1];
                this.colors[4*ids[i] + 2] = color[2];
                this.colors[4*ids[i] + 3] = color[3];
            }
        }
        if(this.colorTex !== null) updateTexture4d(gl, world.texsize, this.colorTex, this.colors);
    }

    /* DRAW: render the graphical representations. It may call multiple gl.drawArrays
     * if the number of representations is bigger than items_p_render */
    this.draw =  function() {
        if(this.items > 0){
            // SET SHADER
            gl.useProgram(shader);

            // ACTIVE/BIND TEXTURES
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, world.gpucomp.atoms_position);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.vertexTex);
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, world.gpucomp.atoms_radius);

            // LINK SHADER UNIFORMS WITH OBJECT VARIABLES
            gl.uniformMatrix4fv(viewMatrixUniform, false, world.scene.viewMatrix);             // VIW MATRIX
            gl.uniformMatrix4fv(projectionMatrixUniform, false, world.scene.projectionMatrix); // PROJECTION
            gl.uniform3fv(lightUniform, [1,1,world.scene.camera.z]);                           // LIGHT
            gl.uniform2fv(texsizeUniform, [world.texsize.x, world.texsize.y]);                 // TEX SIZE
            gl.uniform1f(vertexsizeUniform, this.sphereVertexSize);                            // NUM O VERTEX
            gl.uniform1f(lightModeUniform, world.scene.lightmode);                             // LIGHT MODE
            gl.uniform1f(shininessUniform, this.shininess);                                    // SHININESS
            gl.uniform1f(radiusScaleUniform, this.radiusScale);                                // RADIUS
            gl.uniform1f(minradiusUniform, this.minradius);                                    // RADIUS
            gl.uniform1i(positionsUniform, 0);                                                 // TRANSLATION TEXTURE
            gl.uniform1i(colorUniform, 1);                                                     // COLOR
            gl.uniform1i(vertexPositionUniform, 2);                                            // VERTEX POSITION
            gl.uniform1i(atomsRadiusUniform, 3);                                               // VERTEX POSITION
            gl.uniform4fv(ambientColorUniform, this.ambientColor);
            gl.uniform4fv(diffuseColorUniform, this.diffuseColor);
            gl.uniform4fv(specularColorUniform, this.specularColor);

            gl.enableVertexAttribArray(sphereIdAttribute);

            var n = parseInt(this.items / this.items_p_render);

            if(n>0){
                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
                gl.vertexAttribPointer(sphereIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, this.items_p_render*this.sphereVertexSize);

                for(var i=1; i<n; i++){
                    gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[i]);
                    gl.vertexAttribPointer(sphereIdAttribute, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, this.items_p_render*this.sphereVertexSize);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[n]);
                gl.vertexAttribPointer(sphereIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, (this.items - n*this.items_p_render)*this.sphereVertexSize);

            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
                gl.vertexAttribPointer(sphereIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, this.items*this.sphereVertexSize);
            }
        }
    }

    /* UPDATEBUFFERS: realloc memory for the buffers, and create the gl buffers.
     * It may create multiple buffers if the number of representations is
     * bigger than items_p_render  */
    function updateBuffers(){
        drawerBuffers = [];
        drawerArrays = [];
        var n = parseInt(self.items / self.items_p_render);
        if(n>0){
            drawerArrays.push(new Float32Array(self.idsBuffer, 0, 2*self.items_p_render*self.sphereVertexSize));
            drawerBuffers.push(gl.createBuffer());
            gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
            gl.bufferData(gl.ARRAY_BUFFER, drawerArrays[0], gl.STATIC_DRAW);
            for(var i=1; i<n; i++){
                drawerArrays.push(new Float32Array(self.idsBuffer, 8*i*self.sphereVertexSize*self.items_p_render, 2*self.items_p_render*self.sphereVertexSize));
                drawerBuffers.push(gl.createBuffer());
                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, drawerArrays[i], gl.STATIC_DRAW);
            }
            drawerArrays.push(new Float32Array(self.idsBuffer, 8*n*self.sphereVertexSize*self.items_p_render, 2*(self.items - n*self.items_p_render)*self.sphereVertexSize));
            drawerBuffers.push(gl.createBuffer());
            gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[n]);
            gl.bufferData(gl.ARRAY_BUFFER, drawerArrays[n], gl.STATIC_DRAW);
        }else{
            drawerBuffers.push(gl.createBuffer());
            gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
            gl.bufferData(gl.ARRAY_BUFFER, self.ids, gl.STATIC_DRAW);
        }
    }

    /* CREATEARRAYS: create the vertex array by calculating the position of each
     * vertex according to the current resolution. */
    function createArrays(){
        var vertex = [];
        var vtemp = [];
        var ttemp = [];
        self.vertex = [];

        var latitudeBands = self.sphereLatitude;
        var longitudeBands = self.sphereLongitude;

        for(var i=0; i<=latitudeBands; i++){

            var theta =  i*Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for(var j=0; j<=longitudeBands; j++){

                var phi =  j*Math.PI*2 / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                vtemp.push(x);
                vtemp.push(y);
                vtemp.push(z);
                vtemp.push(1);
            }
        }
        for(var i=0; i<latitudeBands; i++){
            for(var j=0; j<longitudeBands; j++){

                var first = (i*(latitudeBands + 1)) + j;
                var second = first + longitudeBands + 1;

                for(var k=0; k<4; k++) vertex.push(vtemp[4*first + k]);
                for(var k=0; k<4; k++) vertex.push(vtemp[4*second + k]);
                for(var k=0; k<4; k++) vertex.push(vtemp[4*(first + 1) + k]);

                for(var k=0; k<4; k++) vertex.push(vtemp[4*second + k]);
                for(var k=0; k<4; k++) vertex.push(vtemp[4*(second + 1) + k]);
                for(var k=0; k<4; k++) vertex.push(vtemp[4*(first + 1) + k]);
            }
        }

        self.vertex = new Float32Array(self.sphereVertexSize*4);
        self.vertex.set(vertex);
    }
}

atoms.prototype = {
    // SPHERE PARAMETERS
    shininess: 53,
    ambientColor: [0.1, 0.1, 0.1, 1.0],
    diffuseColor: [0.8, 0.8, 0.8, 1.0],
    specularColor: [0.5, 0.5, 0.5, 1.0],
    radiusScale: 0.2,
    minradius: 0.5,
    sphereLongitude: 10,
    sphereLatitude: 10,
    vertex: [],
    atoms: [],
    colors: [],
    colorTex: null,
    vertexTex: null,
    ids: [],
    items: 0,
    items_p_render: 10000,
}
