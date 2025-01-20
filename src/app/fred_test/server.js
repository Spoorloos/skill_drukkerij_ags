const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

app.post('/upload', function (req, res) {
    const params = new URLSearchParams({
        secret: '6Lej844qAAAAAOX_nLpU54iZCJD-natmoJtO9xbz',
        response: req.body['g-recaptcha-response'],
        remoteip: req.ip,
    });

    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: "POST",
        body: params,
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                res.json({ captchaSuccess: true });
            } else {
                res.json({ captchaSuccess: false });
            }
        })
        .catch(error => {
            console.error('Error verifying captcha:', error);
            res.status(500).json({ error: 'Captcha verification failed' });
        });
});
