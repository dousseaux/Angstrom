// ---------------------------------- KEYBOARD HANDLER ----------------------------------
var Keyboarder = function(){

    var keyState = {};

    window.onkeydown = function(e){
        keyState[e.keyCode] = true;
    };

    window.onkeyup = function(e){
        keyState[e.keyCode] = false;
    };

    this.isDown = function(keyCode){
        return keyState[keyCode] === true;
    };

    this.Keys = {LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32,
                 A: 65, S:83, D:68, W:87, PAGEUP: 33, PAGEDOWN: 34,
                 CTRL: 17, SHIFT: 16};
}

// ------------------------------- RETURNS JSON STRING ----------------------------------
function dataToJSON(data){
    return "data:text/json; charset=utf-16," + encodeURIComponent(JSON.stringify(data));
}

// ----------------------------- CONVERT OBJECT TO ARRAY --------------------------------
function objToArray(obj){
    return Object.keys(obj).map(function(key){return obj[key]});
}

// ------------------------------- CALCULATE FACTORIAL ----------------------------------
function factorial(n){
    return(n<2)?1:factorial(n-1)*n;
}

// ---------------------------- ADD TO A STRING AT INDEX --------------------------------
String.prototype.addAt = function(index, str) {
    return this.substr(0, index) + str + this.substr(index);
}

// -------------------- GAUSSIAN DISTRIBUTED PSEUDO-RANDOM NUMBER -----------------------
function gaussianRandom(mean, stdev) {
    var use_last = false;
    var y;
    var x1, x2, w;
    do{
         x1 = 2.0 * Math.random() - 1.0;
         x2 = 2.0 * Math.random() - 1.0;
         w  = x1 * x1 + x2 * x2;
    }while( w >= 1.0);
    w = Math.sqrt((-2.0 * Math.log(w))/w);
    y = x1 * w;

   var retval = mean + stdev * y;
   if(retval > 0)
       return retval;
   else return -retval;
}

function getPositionOutOfTheBox(boxSize, positiveLimit, negativeLimit){

    var px = Math.random()*boxSize.x;
    var py = Math.random()*boxSize.y;
    var pz = Math.random()*boxSize.z;

    if(Math.round(Math.random()) == 0) px += positiveLimit.x
    else px = negativeLimit.x - px;

    if(Math.round(Math.random()) == 0) py += positiveLimit.y;
    else py = negativeLimit.y - py;

    if(Math.round(Math.random()) == 0) pz += positiveLimit.z;
    else pz = negativeLimit.x - pz;

    return [px, py, pz];
}
