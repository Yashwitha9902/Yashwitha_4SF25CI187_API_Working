const express = require("express");

const app = express();

app.use(express.json());



let users = [];

app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const existingUser = users.find(
        (user) => user.username === username
    );

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username,
        password
    });

    res.status(201).json({
        message: "Registration successful"
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (user) =>
            user.username === username &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.status(200).json({
        message: "Login successful"
    });
});

let students = [];
let currentId = 1;


app.get("/students", (req, res) => {
    let result = students;

    if (req.query.usn) {
        result = result.filter((student) =>
            student.usn
                .toLowerCase()
                .includes(req.query.usn.toLowerCase())
        );
    }

    if (req.query.department) {
        result = result.filter(
            (student) =>
                student.department.toLowerCase() ===
                req.query.department.toLowerCase()
        );
    }

    res.status(200).json(result);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(
        (s) => s.id == req.params.id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

app.post("/students", (req, res) => {
    const {
        name,
        usn,
        age,
        dob,
        course,
        department,
        year,
        hobbies
    } = req.body;

    if (
        !name ||
        !usn ||
        !age ||
        !dob ||
        !course ||
        !department ||
        !year
    ) {
        return res.status(400).json({
            message: "All required fields must be filled"
        });
    }

    const student = {
        id: currentId++,
        name,
        usn,
        age,
        dob,
        course,
        department,
        year,
        hobbies
    };

    students.push(student);

    res.status(201).json({
        message: "Student added successfully",
        student: student
    });
});
app.put("/students/:id", (req, res) => {
    const student = students.find(
        (s) => s.id == req.params.id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    Object.assign(student, req.body);

    res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});

app.delete("/students/:id", (req, res) => {
    const index = students.findIndex(
        (s) => s.id == req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});