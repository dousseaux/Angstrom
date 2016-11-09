TEMPOUT="tempout"
TEMPIN="../dist"
SRC=".."
OUT="../dist"
NAME="angstrom-1.0.3-a"

rm -r $OUT/$NAME.tar.gz

# echo COPYING SOURCE FOLDERS...
# mkdir $TEMPIN
# mkdir $TEMPIN/src
# cp -r $SRC/src/buildPSF/ $TEMPIN/src/buildPSF
# cp -r $SRC/src/classes/ $TEMPIN/src/classes
# cp -r $SRC/src/files/ $TEMPIN/src/files
# cp -r $SRC/src/images/ $TEMPIN/src/images
# cp -r $SRC/src/libs/ $TEMPIN/src/libs
# cp -r $SRC/src/shaders/ $TEMPIN/src/shaders
# cp -r $SRC/src/style/ $TEMPIN/src/style
# cp -r $SRC/node_modules/ $TEMPIN/node_modules
#
# echo COPYING SOURCE FILES...
# cp $SRC/src/DSKindex.html $TEMPIN/src/DSKindex.html
# cp $SRC/src/DSKapplication.html $TEMPIN/src/DSKapplication.html
# cp $SRC/src/DSKsimulate.html $TEMPIN/src/DSKsimulate.html
# cp $SRC/src/DSKvisualize.html $TEMPIN/src/DSKvisualize.html
# cp $SRC/LICENSE.txt $TEMPIN/LICENSE.txt
# cp $SRC/main.js $TEMPIN/main.js
# cp $SRC/package.json $TEMPIN/package.json
#
# echo PACKAGING ELECTRON APP...
# electron-packager $TEMPIN Angstrom --linux --version=1.3.8 --out=$TEMPOUT --overwrite --icon=$TEMPIN/images/logo2.png

echo COMPRESSING PACKAGE...
mkdir $TEMPOUT
mkdir $TEMPOUT/$NAME
tar -zcf  $TEMPOUT/$NAME/content.tar.gz -C $TEMPIN/ linux-unpacked

echo COPYING INSTALLATION FILES...
cp files/icon.png $TEMPOUT/$NAME/icon.png
cp files/install.sh $TEMPOUT/$NAME/install.sh
cp files/README_LINUXx64.txt $TEMPOUT/$NAME/README.txt
cp files/LICENSE.txt $TEMPOUT/$NAME/LICENSE.txt

echo COMPRESSING FINAL FILE...
mkdir $OUT
tar -zcf  $OUT/$NAME.tar.gz -C $TEMPOUT/ $NAME

echo CLEANING TEMPORARY FILES...
rm -r $TEMPOUT
# rm -r $TEMPIN
