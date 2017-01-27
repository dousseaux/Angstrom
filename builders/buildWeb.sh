#DEFINE PARAMETERS
SRC="../src/"
TARGET=$HOME/Angstrom-Web

# REMOVE PREVIOUS BUILD
rm -r $TARGET
mkdir $TARGET

# COPY FOLDERS
cp -r $SRC/buildPSF/ $TARGET/buildPSF
cp -r $SRC/classes/ $TARGET/classes
cp -r $SRC/files/ $TARGET/files
cp -r $SRC/images/ $TARGET/images
cp -r $SRC/libs/ $TARGET/libs
cp -r $SRC/shaders/ $TARGET/shaders
cp -r $SRC/style/ $TARGET/style

# COPY FILES
cp $SRC/index.html $TARGET/index.html
cp $SRC/application.php $TARGET/application.php
cp $SRC/simu $TARGET/simulate.php
cp $SRC/visualize.php $TARGET/visualize.php
cp $SRC/about.html $TARGET/alate.phpbout.html
cp $SRC/documentation.html $TARGET/documentation.html
cp $SRC/download.html $TARGET/download.html
cp $SRC/github.html $TARGET/github.html
cp $SRC/tutorials.html $TARGET/tutorials.html
cp $SRC/DSKapplication_cloud.php $TARGET/DSKapplication_cloud.php
cp $SRC/.htaccess $TARGET/.htaccess

mkdir $TARGET/downloads

# GIVE PERMISSIONS TO THE FOLDER
chmod 644 -R $TARGET
chmod 755 $TARGET/buildPSF
chmod 755 $TARGET/classes
chmod 755 $TARGET/files
chmod 755 $TARGET/images
chmod 755 $TARGET/libs
chmod 755 $TARGET/shaders
chmod 755 $TARGET/style
chmod 755 $TARGET/downloads

chown -hR $TARGET

