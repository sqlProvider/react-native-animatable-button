
rm -rf dist/ &&
rm -rf build/ &&
echo "rm -rf dist/ build/" &&
tsc &&
echo "tsc" &&
cp -R ./build ./dist &&
echo "cp -R ./build ./dist" &&
cp ./package.json ./dist/ &&
echo "cp ./package.json ./dist/" &&
cp ./README.md ./dist/ &&
echo "cp ./README.md ./dist/" &&
cp ./src/index.d.ts ./dist/ &&
echo "cp ./src/index.d.ts ./dist/" &&
cp ./src/IButton.d.ts ./dist/