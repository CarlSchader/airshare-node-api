let provider = null;
switch (process.env.PROVIDER.toLowerCase()) {
  case 'gcp':
    provider = require('./gcp');
    break;
  default:
    provider = require('./local');
    break;
}

function verifyFileName(fileName) {
  if (fileName.includes('/')) {
    throw 'name cannot contain "/"';
  }
}

function uploadFile(userId, fileName, bytes, callback) {
  verifyFileName(fileName);
  provider.uploadFile(userId, fileName, bytes, callback);
}

module.exports = {
  uploadFile: uploadFile
}
