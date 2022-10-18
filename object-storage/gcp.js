const {Storage} = require('@google-cloud/storage');

const storage = new Storage({keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS});

const publicBucket = storage.bucket(process.env.GOOGLE_PUBLIC_BUCKET);

// async function userHasFolder(bucket, userId) {
//   const result = await bucket.getFiles({prefix: userId, maxResults: 1});
//   return Array.isArray(result) && result.length > 0;
// }

function uploadFile(userId, fileName, bytes, callback) {
  const file = publicBucket.file(`${userId}/${fileName}`);
  const stream = file.createWriteStream();
  stream.on('error', error => {
    throw error;
  });
  stream.write(bytes, callback);
}

module.exports = {
  uploadFile: uploadFile,
};