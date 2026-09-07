const fs = require('fs/promises');

async function fileOperations() {
  try {
    //1.	Create a new file.
    //2.	Write some content inside the file.

    await fs.writeFile('test.txt', 'Hello Huma Volve!', 'utf8')
    console.log('File written successfully');

    // 3.	Read the file content and display it.
    let data = await fs.readFile('test.txt', 'utf8')
    console.log(data);

    // 4.	Append new content to the same file without deleting the old content.
    await fs.appendFile('test.txt', '\nthis is a new line', 'utf8')
    console.log('Content appended');

    // 5.	Read the file again and display the updated content.
    let updatedData = await fs.readFile('test.txt', 'utf8')
    console.log(updatedData);

    // 6.	Delete the file using fs.unlink().
    await fs.unlink('test.txt')
    console.log('File deleted successfully');

  } catch (err) {
    console.error('Error:', err);
  }
}

fileOperations();

