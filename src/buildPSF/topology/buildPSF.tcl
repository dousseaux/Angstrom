#############################################################
## Build a PSF   (conectivity)                             ##
#############################################################

package require autopsf

pdbalias residue HIS HSE

pdbalias atom ILE CD1 CD

topology topology/top_all27_prot_lipid_na.inp

autopsf -top topology/top_all27_prot_lipid_na.inp -mol 0

exit
