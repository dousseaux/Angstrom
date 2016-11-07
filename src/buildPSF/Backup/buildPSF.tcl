#############################################################
## Build a PSF   (conectivity)                             ##
#############################################################

set charmm .
set out testpsf

# Topology File
package require psfgen
topology topology/top_all36_prot.rtf
topology topology/top_all27_prot_lipid_na.inp

pdbalias residue HIS HSE
pdbalias atom ILE CD1 CD

set chainA [atomselect top "all"]
$chainA writepdb A.pdb
segment A {first none; last none; pdb A.pdb }
coordpdb A.pdb A

# Write the new PDB & PSF files
guesscoord

writepdb $out.pdb
writepsf $out.psf

# Delete all temporary files
file delete A.pdb
exit
