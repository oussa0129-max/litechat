const express = require('express');
const app = express();
app.use(express.json());

const users = {};
const messages = {};

// تسجيل دخول
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'no username' });
    if (Object.keys(users).length >= 10 && !users[username]) {
        return res.status(403).json({ error: 'max users reached' });
    }
    users[username] = Date.now();
    res.json({ ok: true });
});

// قائمة Users
app.get('/users', (req, res) => {
    // نحيو users اللي ما عندهمش activity من 30 ثانية
    const now = Date.now();
    Object.keys(users).forEach(u => {
        if (now - users[u] > 30000) delete users[u];
    });
    res.json(Object.keys(users));
});

// heartbeat باش يبقى user متصل
app.post('/heartbeat', (req, res) => {
    const { username } = req.body;
    if (username) users[username] = Date.now();
    res.json({ ok: true });
});

// إرسال رسالة خاصة
app.post('/send', (req, res) => {
    const { from, to, message } = req.body;
    if (!from || !to || !message) return res.status(400).json({ error: 'missing' });
    const key = [from, to].sort().join('_');
    if (!messages[key]) messages[key] = [];
    messages[key].push({
        from: from,
        text: message,
        time: new Date().toLocaleTimeString()
    });
    if (messages[key].length > 50) messages[key].shift();
    res.json({ ok: true });
});

// جلب رسائل بين شخصين
app.get('/messages', (req, res) => {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) return res.status(400).json({ error: 'missing' });
    const key = [user1, user2].sort().join('_');
    res.json(messages[key] || []);
});

// logout
app.post('/logout', (req, res) => {
    const { username } = req.body;
    if (username) delete users[username];
    res.json({ ok: true });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});