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

function uploadFile(req, res) {
  const userId = 'test-user';
  verifyFileName(req.query.fileName);
  provider.uploadFile(userId, req.query.fileName, req.body, req.headers)
  return res.sendStatus(200);
}

function retrieveFile(req, res) {
  verifyFileName(req.params.fileName);
  const {data, metaData} = provider.retrieveFile(req.params.userId, req.params.fileName);
  res.type(metaData['content-type']);
  res.send(data);
}

module.exports = {
  uploadFile: uploadFile,
  retrieveFile: retrieveFile,
}
