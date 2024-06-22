var express = require('express');
var router = express.Router();


const url = "https://didactic-sniffle-5gqxqwq47xr4h7p5w-6000.app.github.dev/auth/login"

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('layout', { body: 'pages/login', title: 'Express', error: ''});
});

router.post('/', (req, res) => {
    const { username, password } = req.body
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json()
                console.log('err', err)
                throw err
            }
            return res.json()
        })
        .then((data) => {
            console.log('veio', data)
            req.session.token = data.token
            res.redirect('/users')
        })
        .catch((error) => {
            console.log('Erro', error)
            res.render('layout', { body: 'pages/login', title: 'Express', error,})
        })
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).send({ error: 'Erro ao fazer logout' });
        }

        res.redirect('/');
    });
});

module.exports = router;
