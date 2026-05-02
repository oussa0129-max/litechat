const express = require('express');
const app = express();
app.use(express.json());

// قائمة الرسائل
const messages = [];

// إرسال رسالة
app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: 'ناقص' });
    }
    messages.push({
        user: username,
        text: message,
        time: new Date().toLocaleTimeString()
    });
    // خلي غير آخر 50 رسالة
    if (messages.length > 50) messages.shift();
    res.json({ ok: true });
});

// جلب الرسائل
app.get('/messages', (req, res) => {
    res.json(messages);
});

app.listen(3000, '0.0.0.0', () => {
    console.log('السيرفر خدام على port 3000');
});