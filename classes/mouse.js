// --------------------------------- MOUSE HANDLER --------------------------------------
var mouse =  function(world){
    var scene = world.scene;
    var colorModeBackup = "";
    var isSelected = null;

    var self = this;

    var click = function(event){
        self.hold = true;

        if(event.touches){
            self.pos.x = event.touches[0].clientX - scene.canvas.offsetLeft;
            self.pos.y = event.touches[0].clientY - scene.canvas.offsetTop;
        }else{
            self.pos.x = event.clientX - scene.canvas.offsetLeft;
            self.pos.y = event.clientY - scene.canvas.offsetTop;
        }

        mousePicking(world);

        if(self.selected !== null){
            if(self.mode === "select"){
                self.hold = false;
                isSelected = world.selected.find(function(index){
                        if(index === self.selected) return true;
                        else return false;
                });
                if(!(isSelected + 1)){
                    world.selected.push(self.selected);
                    world.view.showInfo(self.selected);
                    colorModeBackup = world.colorMode;
                    world.colorMode = "selected";
                    world.atoms.paint([self.selected]);
                    world.colorMode = colorModeBackup;
                }else{
                    world.selected.splice(world.selected.indexOf(isSelected), 1);
                    world.atoms.paint([isSelected]);
                    document.getElementById("pInfo" + isSelected).remove();
                }
            }
        }

        self.pos.x0 = self.pos.x;
        self.pos.y0 = self.pos.y
    }

    var zoom = function(event){
        var norms;
        var x = -1 + (2*self.pos.x/scene.canvas.width);
        var y =  1 - (2*self.pos.y/scene.canvas.height);
        var ray_clip = [x , y, -1, 1];

        var ray_eye = mult(inverse(scene.projectionMatrix), ray_clip,4);
        ray_eye[2] = -1;
        ray_eye[3] =  0;

        var ray_world = mult(inverse(scene.viewMatrix0), ray_eye,4);
        ray_world[3]  = 0;
        norms = 0;
        for( var i=0; i<ray_world.length - 1; i++) norms += ray_world[i]*ray_world[i];
        norms = Math.sqrt(norms);
        for( var i=0; i<ray_world.length - 1; i++) ray_world[i] /= norms;

        if(scene.projectionMode === 1){
            if(event.deltaY > 0){
                scene.camera.x -= ray_world[0]*self.sensitivity.zoom;
                scene.camera.y -= ray_world[1]*self.sensitivity.zoom;
                scene.camera.z -= ray_world[2]*self.sensitivity.zoom;
            }else {
                scene.camera.x += ray_world[0]*self.sensitivity.zoom;
                scene.camera.y += ray_world[1]*self.sensitivity.zoom;
                scene.camera.z += ray_world[2]*self.sensitivity.zoom;
            }
            var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
            var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
            var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
            scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
            scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
            scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
            scene.viewMatrix[12] = Tx;
            scene.viewMatrix[13] = Ty;
            scene.viewMatrix[14] = Tz;
        }else{
            if(event.deltaY > 0){
                scene.camera.x -= scene.right*0.008*ray_world[0]*self.sensitivity.zoom;
                scene.camera.y -= scene.top*0.008*ray_world[1]*self.sensitivity.zoom;
                scene.camera.z -= ray_world[2]*self.sensitivity.zoom;
                scene.right *= 0.27*self.sensitivity.zoom;
                scene.top *= 0.27*self.sensitivity.zoom;
                scene.left = -scene.right;
                scene.bottom = -scene.top;
            }else {
                scene.camera.x += scene.right*0.008*ray_world[0]*self.sensitivity.zoom;
                scene.camera.y += scene.top*0.008*ray_world[1]*self.sensitivity.zoom;
                scene.camera.z += ray_world[2]*self.sensitivity.zoom;
                scene.right *= 0.23*self.sensitivity.zoom;
                scene.top *= 0.23*self.sensitivity.zoom;
                scene.left = -scene.right;
                scene.bottom = -scene.top;
            }
            var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
            var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
            var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
            scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
            scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
            scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
            scene.viewMatrix[12] = Tx;
            scene.viewMatrix[13] = Ty;
            scene.viewMatrix[14] = Tz;
            scene.updateProjection();
        }
    }

    var release = function(event){
      self.selected = null;
      self.hold = false;
    }

    var move = function(event){
        self.pos.x = event.clientX - scene.canvas.offsetLeft;
        self.pos.y = event.clientY - scene.canvas.offsetTop;

        if (self.hold === true) {
            if(self.selected !== null) mouseMoving(world);
            else{
                var mouseDx = self.pos.x - self.pos.x0;
                var mouseDy = self.pos.y - self.pos.y0;

                var yaw = self.sensitivity.rotation*mouseDx;
                var pitch = self.sensitivity.rotation*mouseDy;

                var cosYaw = Math.cos(yaw);
                var sinYaw = Math.sin(yaw);
                var cosPitch = Math.cos(pitch);
                var sinPitch = Math.sin(pitch);

                var rotYaw = new Float32Array([ cosYaw, 0,-sinYaw, 0,
                                                0     , 1, 0     , 0,
                                                sinYaw, 0, cosYaw, 0,
                                                0     , 0, 0     , 1]);

                var rotPitch = new Float32Array([ 1, 0       , 0       , 0,
                                                  0, cosPitch, sinPitch, 0,
                                                  0,-sinPitch, cosPitch, 0,
                                                  0, 0       , 0       , 1]);

                scene.viewMatrix = mult(scene.viewMatrix,rotYaw,4);
                scene.viewMatrix = mult(scene.viewMatrix,rotPitch,4);

                var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
                var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
                var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
                scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
                scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
                scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
                scene.viewMatrix[12] = Tx;
                scene.viewMatrix[13] = Ty;
                scene.viewMatrix[14] = Tz;

                self.pos.x0 = self.pos.x;
                self.pos.y0 = self.pos.y;
            }
        }
    }

    var Tmove = function(event){

      self.pos.x = event.touches[0].clientX - scene.canvas.offsetLeft;
      self.pos.y = event.touches[0].clientY - scene.canvas.offsetTop;

      if(event.touches[1] === undefined){
          var mouseDx = self.pos.x - self.pos.x0;
          var mouseDy = self.pos.y - self.pos.y0;

          var yaw = self.sensitivity.rotation*mouseDx;
          var pitch = self.sensitivity.rotation*mouseDy;

          var cosYaw = Math.cos(yaw);
          var sinYaw = Math.sin(yaw);
          var cosPitch = Math.cos(pitch);
          var sinPitch = Math.sin(pitch);

          var rotYaw = new Float32Array([ cosYaw, 0,-sinYaw, 0,
                                          0     , 1, 0     , 0,
                                          sinYaw, 0, cosYaw, 0,
                                          0     , 0, 0     , 1]);

          var rotPitch = new Float32Array([ 1, 0       , 0       , 0,
                                            0, cosPitch, sinPitch, 0,
                                            0,-sinPitch, cosPitch, 0,
                                            0, 0       , 0       , 1]);


          scene.viewMatrix = mult(scene.viewMatrix,rotYaw,4);
          scene.viewMatrix = mult(scene.viewMatrix,rotPitch,4);
          var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
          var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
          var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
          scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
          scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
          scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
          scene.viewMatrix[12] = Tx;
          scene.viewMatrix[13] = Ty;
          scene.viewMatrix[14] = Tz;
      }else{

        self.pos2.x = event.touches[1].clientX - scene.canvas.offsetLeft;
        self.pos2.y = event.touches[1].clientY - scene.canvas.offsetTop;
        var d0 = (self.pos.x0-self.pos2.x0)*(self.pos.x0-self.pos2.x0) + (self.pos.y0-self.pos2.y0)*(self.pos.y0-self.pos2.y0);
        var d = (self.pos.x-self.pos2.x)*(self.pos.x-self.pos2.x) + (self.pos.y-self.pos2.y)*(self.pos.y-self.pos2.y);
        var px = (self.pos.x + self.pos2.x)/2
        var py = (self.pos.y + self.pos2.y)/2

        var ray_clip = [-1 + (2*px/scene.canvas.width), 1 - (2*py/scene.canvas.height), -1, 1];
        var ray_eye = mult(inverse(scene.projectionMatrix), ray_clip,4);
        ray_eye[2] = -1;
        ray_eye[3] =  0;
        var ray_world = mult(inverse(scene.viewMatrix0), ray_eye,4);
        ray_world[3]  = 0;
        var norms = 0;
        for( var i=0; i<ray_world.length - 1; i++) norms += ray_world[i]*ray_world[i];
        norms = Math.sqrt(norms);
        for( var i=0; i<ray_world.length - 1; i++) ray_world[i] /= norms;

        if(scene.projectionMode === 1){
            if(d < d0){
                scene.camera.x -= ray_world[0]*self.sensitivity.zoom*0.15;
                scene.camera.y -= ray_world[1]*self.sensitivity.zoom*0.15;
                scene.camera.z -= ray_world[2]*self.sensitivity.zoom*0.15;
            }else {
                scene.camera.x += ray_world[0]*self.sensitivity.zoom*0.15;
                scene.camera.y += ray_world[1]*self.sensitivity.zoom*0.15;
                scene.camera.z += ray_world[2]*self.sensitivity.zoom*0.15;
            }
            var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
            var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
            var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
            scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
            scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
            scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
            scene.viewMatrix[12] = Tx;
            scene.viewMatrix[13] = Ty;
            scene.viewMatrix[14] = Tz;
        }else{
            if(d < d0){
                scene.camera.x -= scene.right*0.008*ray_world[0]*self.sensitivity.zoom;
                scene.camera.y -= scene.top*0.008*ray_world[1]*self.sensitivity.zoom;
                scene.camera.z -= ray_world[2]*self.sensitivity.zoom;
                scene.right *= 0.27*self.sensitivity.zoom;
                scene.top *= 0.27*self.sensitivity.zoom;
                scene.left = -scene.right;
                scene.bottom = -scene.top;
            }else {
                scene.camera.x += scene.right*0.008*ray_world[0]*self.sensitivity.zoom;
                scene.camera.y += scene.top*0.008*ray_world[1]*self.sensitivity.zoom;
                scene.camera.z += ray_world[2]*self.sensitivity.zoom;
                scene.right *= 0.23*self.sensitivity.zoom;
                scene.top *= 0.23*self.sensitivity.zoom;
                scene.left = -scene.right;
                scene.bottom = -scene.top;
            }
            var Tx = -scene.look.x*scene.viewMatrix[0] -scene.look.y*scene.viewMatrix[4] -scene.look.z*scene.viewMatrix[8] - scene.camera.x + scene.look.x;
            var Ty = -scene.look.x*scene.viewMatrix[1] -scene.look.y*scene.viewMatrix[5] -scene.look.z*scene.viewMatrix[9] - scene.camera.y + scene.look.y;
            var Tz = -scene.look.x*scene.viewMatrix[2] -scene.look.y*scene.viewMatrix[6] -scene.look.z*scene.viewMatrix[10] - scene.camera.z + scene.look.z;;
            scene.camera_rot.x = -Tx*scene.viewMatrix[0] - Ty*scene.viewMatrix[1] - Tz*scene.viewMatrix[2];
            scene.camera_rot.y = -Tx*scene.viewMatrix[4] - Ty*scene.viewMatrix[5] - Tz*scene.viewMatrix[6];
            scene.camera_rot.z = -Tx*scene.viewMatrix[8] - Ty*scene.viewMatrix[9] - Tz*scene.viewMatrix[10];
            scene.viewMatrix[12] = Tx;
            scene.viewMatrix[13] = Ty;
            scene.viewMatrix[14] = Tz;
            scene.updateProjection();
        }
      }
      self.pos.x0 = self.pos.x;
      self.pos.y0 = self.pos.y;
      self.pos2.x0 = self.pos2.x;
      self.pos2.y0 = self.pos2.y;
    }

    // ########## MOUSE SELECTION
    function mousePicking(){
        var norms;
        var tp = world.scene.far;
        var x = -1 + (2*world.view.mouse.pos.x/world.canvas.width);
        var y =  1 - (2*world.view.mouse.pos.y/world.canvas.height);
        var ray_clip = [x , y, -1, 1];
        var radius = 0;
        var ray_eye = mult(inverse(world.scene.projectionMatrix), ray_clip,4);
        ray_eye[2] = -1;
        ray_eye[3] =  0;

        var ray_world = mult((world.scene.viewMatrix), ray_eye,4);
        ray_world[3] = 0;

        norms = 0;
        for( var i=0; i<ray_world.length - 1; i++) norms += ray_world[i]*ray_world[i];
        norms = Math.sqrt(norms);
        for( var i=0; i<ray_world.length - 1; i++) ray_world[i] /= norms;

        getFrameData4d(world.gl, world.texsize, world.gpucomp.FBposition, world.data.atoms_position);

        for(var i=0; i<world.natoms; i++){
            var b = world.scene.camera_rot.x*ray_world[0] + world.scene.camera_rot.y*ray_world[1] + world.scene.camera_rot.z*ray_world[2] -
                    world.data.atoms_position[4*i]*ray_world[0] - world.data.atoms_position[4*i + 1]*ray_world[1] -
                    world.data.atoms_position[4*i + 2]*ray_world[2];

            var c = ray_world[0]*ray_world[0] + ray_world[1]*ray_world[1] + ray_world[2]*ray_world[2];

            var t = -b/c;

            px = world.scene.camera_rot.x + t*ray_world[0];
            py = world.scene.camera_rot.y + t*ray_world[1];
            pz = world.scene.camera_rot.z + t*ray_world[2];

            d = (px-world.data.atoms_position[4*i])*(px-world.data.atoms_position[4*i])
              + (py-world.data.atoms_position[4*i + 1])*(py-world.data.atoms_position[4*i + 1])
              + (pz-world.data.atoms_position[4*i + 2])*(pz-world.data.atoms_position[4*i + 2])

            if(world.data.atoms_radius[i]*world.atoms.radiusScale < world.atoms.minradius) radius = world.atoms.minradius;
            else radius = world.data.atoms_radius[i]*world.atoms.radiusScale;

            if(d <= radius*radius && t<tp){
                world.view.mouse.selected = i;
                tp = t;
            }
        }
    }

    // ########## PARTICLE MOVING
    function mouseMoving(){
        var norms;
        var tp = world.scene.far;
        var x = -1 + (2*world.view.mouse.pos.x/world.canvas.width);
        var y =  1 - (2*world.view.mouse.pos.y/world.canvas.height);
        var ray_clip = [x , y, -1, 1];

        var ray_eye = mult(inverse(world.scene.projectionMatrix), ray_clip,4);
        ray_eye[2] = -1;
        ray_eye[3] =  0;

        var ray_world = mult((world.scene.viewMatrix), ray_eye,4);
        ray_world[3] = 0;

        norms = 0;
        for(var i=0; i<ray_world.length - 1; i++) norms += ray_world[i]*ray_world[i];
        norms = Math.sqrt(norms);
        for(var i=0; i<ray_world.length - 1; i++) ray_world[i] /= norms;

        var molecule = world.data.molecules_Offset[world.data.atoms_moleculesIndex[world.view.mouse.selected]];
        world.gpucomp.particlesPositionToData(molecule.firstp, molecule.lastp);

        var b = world.scene.camera_rot.x*ray_world[0] + world.scene.camera_rot.y*ray_world[1] + world.scene.camera_rot.z*ray_world[2] -
                world.data.atoms_position[4*world.view.mouse.selected]*ray_world[0] -
                world.data.atoms_position[4*world.view.mouse.selected + 1]*ray_world[1] -
                world.data.atoms_position[4*world.view.mouse.selected + 2]*ray_world[2];

        var c = ray_world[0]*ray_world[0] + ray_world[1]*ray_world[1] + ray_world[2]*ray_world[2];

        var t = -b/c;

        var dx = world.scene.camera_rot.x + t*ray_world[0] - world.data.atoms_position[4*world.view.mouse.selected];
        var dy = world.scene.camera_rot.y + t*ray_world[1] - world.data.atoms_position[4*world.view.mouse.selected + 1];
        var dz = world.scene.camera_rot.z + t*ray_world[2] - world.data.atoms_position[4*world.view.mouse.selected + 2];

        for(var i=molecule.firstp; i<=molecule.lastp; i++){
            world.data.atoms_position[4*i]     += dx;
            world.data.atoms_position[4*i + 1] += dy;
            world.data.atoms_position[4*i + 2] += dz;
        }

        world.gpucomp.particlesPositionToTexture(molecule.firstp, molecule.lastp);
    }

    scene.canvas.onmousedown = click;
    scene.canvas.onmousemove = move;
    scene.canvas.onmouseup = release;
    scene.canvas.onwheel = zoom;
    scene.canvas.ontouchstart = click;
    scene.canvas.ontouchend = release;
    scene.canvas.ontouchmove = Tmove;
}

mouse.prototype = {
    pos: {x: 0, y: 0, x0: 0, y0: 0},
    pos2: {x: 0, y: 0, x0: 0, y0: 0},
    sensitivity: {rotation: 0.005, zoom: 4.0},
    hold: false,
    selected: null,
    mode: "select",
}
