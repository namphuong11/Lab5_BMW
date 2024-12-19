const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080;

// Middleware để parse JSON
app.use(bodyParser.json());

// Lưu trữ dữ liệu người dùng tạm thời
const users = [];

// API đăng ký người dùng
app.post('/api/v1/user/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered!' });
    }

    // Thêm người dùng mới
    const newUser = { name, email, password };
    users.push(newUser);

    // Hiển thị thông tin người dùng trong CMD
    console.log('New user added:', newUser);

    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
});

// API kiểm tra (health check)
app.get('/', (req, res) => {
    res.send('Server is running!');
});


app.post('/api/v1/user/login', async (req, res) => {
    const { name, password } = req.body;

    const user = users.find(u => u.name === name);
    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({ name: user.name, email: user.email });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Bắt đầu server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
