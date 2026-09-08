const fs = require('fs');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination_pipe.txt');

readStream.pipe(writeStream);

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);
});

writeStream.on('finish', () => {
  console.log('File copy completed using pipe');
});