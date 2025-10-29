// 导入依赖
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// 静态文件目录（提供 HTML、CSS、JS）
app.use(express.static(path.join(__dirname)));

// 用于解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, "users.json");

// 确保 users.json 存在
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// 注册接口
app.post("/register", (req, res) => {
  const { username, email, password, gender, hobbies, bio } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "请填写完整信息" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  // 检查用户名是否已存在
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ success: false, message: "用户名已存在" });
  }

  // 保存新用户完整信息
  users.push({
    username,
    email,
    password,
    gender: gender || "",
    hobbies: hobbies || [],
    bio: bio || ""
  });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  console.log(`✅ 新用户注册：${username}`);
  res.json({ success: true, message: "注册成功！" });
});

// 登录接口
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "请输入用户名和密码" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "用户名或密码错误" });
  }

  console.log(`🔑 用户登录：${username}`);
  // 返回完整用户信息
  res.json({ success: true, message: "登录成功！", user });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
