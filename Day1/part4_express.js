const express = require('express')

const app = express()
app.use(express.json());

let students = [
  { id: 1, name: "Ahmed", age: 20 },
  { id: 2, name: "Sara", age: 21 }
];

app.get('/students', (req, res) => {
  res.json(students)
})

app.get('/student', (req, res) => {
  const id = parseInt(req.query.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    res.status(404).json({ success: false, message: 'Student not found' });
  } else {
    res.json(student);
  }
})

app.post('/students', (req, res) => {
  students.push(req.body)
  res.status(201).json({ success: true, data: req.body })

});


app.put('/students', (req, res) => {
  let updatedStudent = req.body
  let index = students.findIndex(s => s.id === updatedStudent.id)
  
  if (index === -1) {
    res.status(404).json({ success: false, data: "Student not found" })
    
  } else {
    students[index] = { ...students[index], ...updatedStudent  }
    res.status(200).json({ success: true, data: students[index] })
    
  }

})


app.delete('/students', (req, res) => {
  let updatedStudent = req.body
  let index = students.findIndex(s => s.id === updatedStudent.id)

  if (index === -1) {
    res.status(404).json({ success: false, data: "Student not found" })
  } else {
    students = students.filter(s => s.id !== updatedStudent.id)
    res.status(204).end()
    
  }

})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
})

const PORT = 3000;

// Start the server and listen on the specified port
app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});