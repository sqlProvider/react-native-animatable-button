
rm -rf dist/ &&
rm -rf build/ &&
tsc &&
cp -R ./build ./dist &&
cp ./package.json ./dist/ &&
cp ./README.md ./dist/ &&
cp ./src/index.d.ts ./dist/ &&
cp ./src/IButton.d.ts ./dist/