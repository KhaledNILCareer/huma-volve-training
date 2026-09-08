const fs = require('fs');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');


readStream.on('data', (chunk) => {
  writeStream.write(chunk);
  console.log(`Received chunk of ${chunk.length} bytes`);
});

readStream.on('end', () => {
  writeStream.end();
  console.log('File copy completed');
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);
});