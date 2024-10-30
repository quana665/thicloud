const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Khóa bí mật để mã hóa JWT
const secretKey = "your_secret_key";

// Giả lập thông tin tài khoản (dùng cho ví dụ)
const users = [
    {
        username: "admin",
        password: bcrypt.hashSync("12345", 8) // Mã hóa mật khẩu
    }
];

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route: Đăng nhập
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Tìm người dùng trong danh sách giả lập
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại!" });
    }

    // So sánh mật khẩu
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo JWT token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: "1h" });

    return res.json({ message: "Đăng nhập thành công!", token });
});

// Route: Kiểm tra token
app.get("/protected", (req, res) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ message: "Token không được cung cấp!" });
    }

    // Kiểm tra và giải mã token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token không hợp lệ!" });
        }

        return res.json({ message: `Chào mừng ${decoded.username}, bạn đã đăng nhập thành công!` });
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
