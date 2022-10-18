const fs = require('fs');
const path = require('path');

const publicBucket = path.join(process.cwd(), 'local-storage');
if (!fs.existsSync(publicBucket)) {
  fs.mkdirSync(publicBucket);
}

function uploadFile(userId, fileName, bytes, callback) {
  const userFolder = path.join(publicBucket, userId);
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder);
  }
  const stream = fs.createWriteStream(path.join(userFolder, fileName));
  stream.on('error', error => {
    throw error;
  });
  stream.write(bytes, callback);
}

module.exports = {
  uploadFile: uploadFile,
};