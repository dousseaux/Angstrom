/* ################################ ELEMENTS ##################################
 *
 * This class has general specifications for particles and residuals. */

var elements = function(){

    // ################ TYPE COLORS PER FIRST LETTER
    this.atom_colors = new Array();
    this.atom_colors["C"] = [0.15,0.65,0.15,1.0]; // OK
    this.atom_colors["H"] = [0.85,0.85,0.85,1.0];
    this.atom_colors["L"] = [0.20,0.80,0.30,1.0]; // OK
    this.atom_colors["N"] = [0.15,0.15,0.65,1.0]; // OK

    this.atom_colors["O"] = [0.8,0.1,0.1,1.0];    // OK
    this.atom_colors["P"] = [0.5,0.5,0.2,1.0];    // OK
    this.atom_colors["Q"] = [0.65,0.15,0.15,1.0];

    this.atom_colors["S"] = [0.85,0.85,0.25,1.0]; // OK
    this.atom_colors["X"] = [0.8,0.8,0.8,1.0];    // OK
    this.atom_colors["Z"] = [0.8,0.8,0.8,1.0];    // OK

    // ################ RESIDUAL COLORS PER FIRST LETTER
    this.residual_colors = new Array();
    this.residual_colors["A"] = [0.85,0.85,0.85,1.0];
    this.residual_colors["B"] = [0.85,0.85,0.85,1.0];
    this.residual_colors["C"] = [0.85,0.85,0.85,1.0];
    this.residual_colors["D"] = [0.85,0.85,0.85,1.0];

    this.residual_colors["E"] = [0.15,0.65,0.15,1.0]; // OK
    this.residual_colors["F"] = [0.15,0.65,0.15,1.0]; // OK
    this.residual_colors["G"] = [0.15,0.65,0.15,1.0]; // OK

    this.residual_colors["H"] = [0.20,0.80,0.30,1.0]; // OK
    this.residual_colors["I"] = [0.20,0.80,0.30,1.0]; // OK
    this.residual_colors["J"] = [0.20,0.80,0.30,1.0]; // OK
    this.residual_colors["K"] = [0.20,0.80,0.30,1.0]; // OK
    this.residual_colors["L"] = [0.20,0.80,0.30,1.0]; // OK

    this.residual_colors["M"] = [0.15,0.15,0.85,1.0]; // OK
    this.residual_colors["N"] = [0.15,0.15,0.85,1.0]; // OK

    this.residual_colors["O"] = [0.9,0.1,0.1,1.0];    // OK
    this.residual_colors["P"] = [0.5,0.5,0.2,1.0];    // OK
    this.residual_colors["Q"] = [1.0,0.0,0.0,1.0];

    this.residual_colors["R"] = [0.85,0.85,0.25,1.0]; // OK
    this.residual_colors["S"] = [0.85,0.85,0.25,1.0]; // OK
    this.residual_colors["T"] = [0.85,0.85,0.25,1.0]; // OK

    this.residual_colors["U"] = [0.8,0.8,0.8,1.0];    // OK
    this.residual_colors["V"] = [0.8,0.8,0.8,1.0];    // OK
    this.residual_colors["X"] = [0.8,0.8,0.8,1.0];    // OK
    this.residual_colors["W"] = [0.8,0.8,0.8,1.0];    // OK
    this.residual_colors["Y"] = [0.8,0.8,0.8,1.0];    // OK
    this.residual_colors["Z"] = [0.8,0.8,0.8,1.0];    // OK

    // ################## CUSTOM COLOR OPTION
    this.single_color = [0.7,0.45,0.45,1.0];

    // ################## TYPE LISTING
    this.types = {
        list: [],                           // List of all types, indexed by code.
        radius: [],                         // Van der Waals radius of each tye, indexed by code.
        code: new Array(),                  // Code of each type
    };
}
