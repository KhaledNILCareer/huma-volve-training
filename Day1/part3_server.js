const http = require('http');

let students = [
  { id: 1, name: "Ahmed", age: 20 },
  { id: 2, name: "Sara", age: 21 }
];

// Create a server object
const server = http.createServer((req, res) => {

  //
  if(req.method === 'GET' && req.url === '/students'){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify((students)));
  }

  //
  else if (req.method === 'POST' && req.url === '/students') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      let newStudent = JSON.parse(body)
      students.push(newStudent)
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify((students)));

  });

  }

  else if (req.method === 'PUT' && req.url === '/students') {
    
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const updatedStudent = JSON.parse(body);

        const index = students.findIndex(s => s.id === updatedStudent.id);

        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Todo not found' }));
        } else {
          students[index] = { ...students[index], ...updatedStudent  };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(students[index]));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  else if (req.method === 'DELETE' && req.url === '/students') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    
    req.on('end', () => {
      const updatedStudent = JSON.parse(body);
      const index = students.findIndex(s => s.id === updatedStudent.id);

      if (index === -1) {
        

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Student not found' }));
      } else {
        students = students.filter(s => s.id !== updatedStudent.id);
        res.writeHead(204);
        res.end();
      }
    });
    
  }

  // 404 Not Found
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }

});


const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});