const fs = require('fs');
const path = require('path');

const metaDataExtension = '.metadata.json';

const localStorageDir = path.join(process.cwd(), 'local-storage');
if (!fs.existsSync(localStorageDir)) {
  fs.mkdirSync(localStorageDir);
}

const publicBucket = path.join(localStorageDir, 'public');
if (!fs.existsSync(publicBucket)) {
  fs.mkdirSync(publicBucket);
}

const metaDataBucket = path.join(localStorageDir, 'metadata');
if (!fs.existsSync(metaDataBucket)) {
  fs.mkdirSync(metaDataBucket);
}

function userFolderPath(bucket, userId) {
  const userFolder = path.join(bucket, userId);
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder);
  }
  return userFolder;
}

function uploadFile(userId, fileName, bytes, metaData) {
  const userPublicFolder = userFolderPath(publicBucket, userId);
  const userMetaDataFolder = userFolderPath(metaDataBucket, userId);
  fs.writeFileSync(path.join(userMetaDataFolder, `${fileName}${metaDataExtension}`), JSON.stringify(metaData));
  fs.writeFileSync(path.join(userPublicFolder, fileName), bytes);
}

function retrieveFile(userId, fileName) {
  const userPublicFolder = userFolderPath(publicBucket, userId);
  const userMetaDataFolder = userFolderPath(metaDataBucket, userId);
  const metaData = JSON.parse(fs.readFileSync(path.join(userMetaDataFolder, `${fileName}${metaDataExtension}`)));
  const data = fs.readFileSync(path.join(userPublicFolder, fileName));
  return {data: data, metaData: metaData};
}

module.exports = {
  uploadFile: uploadFile,
  retrieveFile: retrieveFile,
};