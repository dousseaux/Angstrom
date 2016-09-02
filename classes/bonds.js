/* ######################### BONDS CLASS (CYLINDERS) ##############################
 *
 * This class is the graphic representation of each bond. It uses the
 * information directly from the data textures. By default the object has no
 * initial graphical representation. They can be added by informing the id of
 * the bond in world, which will be used as index to get the data from the
 * shaders. */

var bonds = function(world, shader){
    // VARIABLES
    var gl = world.gl;
    var self = this;


    // BUFFERS
    var drawerBuffers = [];
    var drawerArrays = [];

    // SET SHADER ATTRIBUTES POINTERS
    var bondIdAttribute = gl.getAttribLocation(shader, "id");

    // SET SHADER UNIFORMS POINTERS
    var vertexPositionUniform = gl.getUniformLocation(shader, "vertexPos")
    var positionsUniform = gl.getUniformLocation(shader, "positionTex");
    var bondsUniform = gl.getUniformLocation(shader, "bondsTex");
    var colorUniform = gl.getUniformLocation(shader, "colorTex");
    var projectionMatrixUniform = gl.getUniformLocation(shader, "projectionMatrix");
    var viewMatrixUniform = gl.getUniformLocation(shader, "viewMatrix");
    var lightUniform = gl.getUniformLocation(shader, "light");
    var lightModeUniform = gl.getUniformLocation(shader, "lightmode");
    var shininessUniform = gl.getUniformLocation(shader, "shininess");
    var sizeUniform = gl.getUniformLocation(shader, "size");
    var vTexSizeUniform = gl.getUniformLocation(shader, "vTexsize");
    var radiusUniform = gl.getUniformLocation(shader, "radius");
    var ambientColorUniform = gl.getUniformLocation(shader, "ambientColor");
    var diffuseColorUniform = gl.getUniformLocation(shader, "diffuseColor");
    var specularColorUniform = gl.getUniformLocation(shader, "specularColor");

    this.update = function(){
        this.updateResolution();
        this.colors = new Float32Array(4*world.texsize.x*world.texsize.y);
        this.bondsTex = createDataTexture(gl, world.texsize.x, world.texsize.y, world.data.bonds, 3);
        this.colorTex = createDataTexture(gl, world.texsize.x, world.texsize.y, this.colors, 4);
        this.vertexTex = createDataTexture(gl, this.nVertex, 1.0, this.vertex, 4);
    }

    /* FASTADD: add graphical representation for bonds by passing a reference
     * id and the number of ids after the reference */
    this.fastAdd = function(id, n){
        this.ids = new Float32Array(this.idsBuffer, 8*this.nVertex*this.items, 2*this.nVertex*n);
        var bonds = [];
        updateTexture3d(gl, world.texsize, this.bondsTex, world.data.bonds);
        for(var i=id; i<id+n; i++){
            for(var j=0; j<this.nVertex; j++){
                this.ids[(i-id)*2*this.nVertex + 2*j] = i;
                this.ids[(i-id)*2*this.nVertex + 2*j + 1] = j;
            }
            bonds.push(i);
        }
        this.paint(bonds);
        this.bonds = this.bonds.concat(bonds);
        this.items += n;
        this.ids = new Float32Array(this.idsBuffer, 0, 2*this.nVertex*this.items);
        updateBuffers();
    }

    /* ADDIDS: add graphical representation for bonds by passing a vector of
     * ids. */
    this.addIDs = function(ids){
        this.ids = new Float32Array(this.idsBuffer, 8*this.nVertex*this.items, 2*this.nVertex*ids.length);
        updateTexture3d(gl, world.texsize, this.bondsTex, world.data.bonds);
        for(var i=0; i<ids.length; i++){
            for(var j=0; j<this.nVertex; j++){
                this.ids[2*i*this.nVertex + 2*j] = ids[i];
                this.ids[2*i*this.nVertex + 2*j + 1] = j;
            }
        }
        this.paint(ids);
        this.items += ids.length;
        this.ids = new Float32Array(this.idsBuffer, 0, 2*this.nVertex*this.items);
        this.bonds = this.bonds.concat(ids);
        updateBuffers();
    }

    /* UPDATERESOLUTION: realloc memory for the vertex array and recaculate the
     * vertex positions when the precision of the cylinder is updated */
    this.updateResolution = function(){
        this.nVertex = (this.precision + 2)*6;
        if(this.nVertex*world.texsize.x*world.texsize.y*8 < 2147483648) this.idsBuffer = new ArrayBuffer(this.nVertex*world.texsize.x*world.texsize.y*8);
        else {
            if(this.nbonds > 2147483647/(this.nVertex*8)) alert("Memory allocation failed. Using maximum size, all the elements might not be drawed.\nPlease drecrease texture size or sphere quality");
            this.idsBuffer = new ArrayBuffer(2147483647);
        }
        createArrays();
        if(this.vertexTex !== null) updateTexture4d(gl, {x: this.nVertex, y:1}, this.vertexTex, this.vertex);
        var ids = this.bonds;
        this.bonds = [];
        this.items = 0;
        this.addIDs(ids);
    }

    /* PAINT: set the color of each particle according to the worlds color mode,
     * and update the color texture */
    this.paint = function(ids){
        var color = [];
        if(world.colorMode === "atoms"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.atom_colors[world.data.atoms_types[world.data.bonds[3*ids[i]]][0]];
                this.colors[4*world.data.bonds[3*ids[i]]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]] + 3] = color[3];
                color = world.elements.atom_colors[world.data.atoms_types[world.data.bonds[3*ids[i]+1]][0]];
                this.colors[4*world.data.bonds[3*ids[i]+1]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 3] = color[3];
            }
        }
        else if(world.colorMode === "residuals"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.residual_colors[world.data.atoms_residuals[world.data.bonds[3*ids[i]]][0]];
                this.colors[4*world.data.bonds[3*ids[i]]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]] + 3] = color[3];
                color = world.elements.residual_colors[world.data.atoms_residuals[world.data.bonds[3*ids[i]]][0]];
                this.colors[4*world.data.bonds[3*ids[i]+1]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 3] = color[3];
            }
        }else if(world.colorMode === "single"){
            for(var i=0; i<ids.length; i++){
                color = world.elements.single_color;
                this.colors[4*world.data.bonds[3*ids[i]]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]] + 3] = color[3];
                this.colors[4*world.data.bonds[3*ids[i]+1]] = color[0];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 1] = color[1];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 2] = color[2];
                this.colors[4*world.data.bonds[3*ids[i]+1] + 3] = color[3];
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
            gl.bindTexture(gl.TEXTURE_2D, this.bondsTex);

            // LINK SHADER UNIFORMS WITH OBJECT VARIABLES
            gl.uniformMatrix4fv(viewMatrixUniform, false, world.scene.viewMatrix);                  // VIW MATRIX
            gl.uniformMatrix4fv(projectionMatrixUniform, false, world.scene.projectionMatrix); // PROJECTION
            gl.uniform3fv(lightUniform, [1,1,world.scene.camera.z]);                                     // LIGHT
            gl.uniform2fv(sizeUniform, [world.texsize.x, world.texsize.y]);                          // TEX SIZE
            gl.uniform1f(vTexSizeUniform, this.nVertex);                                      // NUM O VERTEX
            gl.uniform1f(lightModeUniform, world.scene.lightmode);                             // LIGHT MODE
            gl.uniform1f(shininessUniform, this.shininess);                                   // SHININESS
            gl.uniform1f(radiusUniform, this.radius);                               // SHININESS
            gl.uniform1i(positionsUniform, 0);                                                // TRANSLATION TEXTURE
            gl.uniform1i(colorUniform, 1);                                                    // COLOR
            gl.uniform1i(vertexPositionUniform, 2);                                           // VERTEX POSITION
            gl.uniform1i(bondsUniform, 3);
            gl.uniform4fv(ambientColorUniform, this.ambientColor);
            gl.uniform4fv(diffuseColorUniform, this.diffuseColor);
            gl.uniform4fv(specularColorUniform, this.specularColor);

            gl.enableVertexAttribArray(this.bondIdAttribute);

            var n = parseInt(this.items / this.items_p_render);

            if(n>0){

                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
                gl.vertexAttribPointer(bondIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, this.items_p_render*this.nVertex);

                for(var i=1; i<n; i++){
                    gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[i]);
                    gl.vertexAttribPointer(bondIdAttribute, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, this.items_p_render*this.nVertex);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[n]);
                gl.vertexAttribPointer(bondIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, (this.items - n*this.items_p_render)*this.nVertex);

            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
                gl.vertexAttribPointer(bondIdAttribute, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLES, 0, this.items*this.nVertex);
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
            drawerArrays.push(new Float32Array(self.idsBuffer, 0, 2*self.items_p_render*self.nVertex));
            drawerBuffers.push(gl.createBuffer());
            gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[0]);
            gl.bufferData(gl.ARRAY_BUFFER, drawerArrays[0], gl.STATIC_DRAW);
            for(var i=1; i<n; i++){
                drawerArrays.push(new Float32Array(self.idsBuffer, 8*i*self.nVertex*self.items_p_render, 2*self.items_p_render*self.nVertex));
                drawerBuffers.push(gl.createBuffer());
                gl.bindBuffer(gl.ARRAY_BUFFER, drawerBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, drawerArrays[i], gl.STATIC_DRAW);
            }
            drawerArrays.push(new Float32Array(self.idsBuffer, 8*n*self.nVertex*self.items_p_render, 2*(self.items - n*self.items_p_render)*self.nVertex));
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

        var phi =  2*Math.PI / self.precision;
        var x;
        var z;
        var xl;
        var zl;

        for(var theta = 0; theta<2*Math.PI + phi; theta += phi){
            x = Math.cos(theta);
            z = Math.sin(theta);

            xl = Math.cos(theta + phi);
            zl = Math.sin(theta + phi);

            vertex.push(x);
            vertex.push(0);
            vertex.push(z);
            vertex.push(1);

            vertex.push(x);
            vertex.push(1);
            vertex.push(z);
            vertex.push(1);

            vertex.push(xl);
            vertex.push(0);
            vertex.push(zl);
            vertex.push(1);
        }

        for(var theta = 0; theta<2*Math.PI + phi; theta += phi){
            x = Math.cos(theta);
            z = Math.sin(theta);

            xl = Math.cos(theta + phi);
            zl = Math.sin(theta + phi);

            vertex.push(x);
            vertex.push(1);
            vertex.push(z);
            vertex.push(1);

            vertex.push(xl);
            vertex.push(0);
            vertex.push(zl);
            vertex.push(1);

            vertex.push(xl);
            vertex.push(1);
            vertex.push(zl);
            vertex.push(1);
        }

        self.vertex = new Float32Array(self.nVertex*8);
        self.vertex.set(vertex);
    }
}

bonds.prototype = {
    // CYLINDER PARAMETERS
    shininess: 53,
    ambientColor: [0.05, 0.05, 0.05, 1.0],
    diffuseColor: [0.8, 0.8, 0.8, 1.0],
    specularColor: [0.5, 0.5, 0.5, 1.0],
    radius: 0.2,
    precision: 10,
    ids: [],
    bonds: [],
    vertex: [],
    colors: [],
    nVertex: 0,
    bondsTex: null,
    colorTex: null,
    vertexTex: null,
    items: 0,
    items_p_render: 10000,
}
