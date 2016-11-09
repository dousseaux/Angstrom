NAME="angstrom-1.0.3-a"
echo EXTRACTING FILES TO $HOME/$NAME
rm -r $HOME/$NAME
rm -r $HOME/linux-unpacked
mkdir $HOME/$NAME
tar -zxf content.tar.gz -C $HOME
mv $HOME/linux-unpacked/* $HOME/$NAME
rm -r $HOME/linux-unpacked

echo CREATING DESKTOP FILE
cp icon.png $HOME/$NAME/icon.png
cat <<EOT > $HOME/$NAME/Angstrom.desktop
[Desktop Entry]
Version=1.0
Name=Angstrom
Comment=Visualize nature in the nano scale.
Exec=$HOME/$NAME/Angstrom
Path=$HOME/$NAME/
Icon=$HOME/$NAME/icon.png
Terminal=true
Type=Application
Categories=Science;Development;
EOT
chmod +x $HOME/$NAME/Angstrom.desktop
chmod 777 -R $HOME/$NAME/
cp $HOME/$NAME/Angstrom.desktop $HOME/.local/share/applications/Angstrom.desktop
