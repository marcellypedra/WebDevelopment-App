# install node.js and dependencies on Server folder

cd server

echo "Installing NPM package"

npm init -y

echo "Installing node packages"

npm install cors dotenv express mongodb

#install typescript extensions
echo "Installing typescript packages"

npm install -D typescript @types/cors @types/express @types/node ts-node

npm i -D tsx




