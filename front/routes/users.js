var express = require('express');
var router = express.Router();
const url = "https://didactic-sniffle-5gqxqwq47xr4h7p5w-6000.app.github.dev/users/"

/* GET users listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de Usuários"
  let cols = ["Id", "CPF", "Nome", "Email", "Telefone", "Sexo", "Curso", "Ações"]

  const token = req.session.token || ""

  fetch(url, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
   })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((users) => {
      users = users.map(user => {
        return {
          id: user.id,
          cpf: user.cpf,
          name: user.username,
          email: user.email,
          phone: user.phone,
          sexo: user.sexo,
          curso: user.curso
        }
      })
      res.render('layout', {body: 'pages/users', title, users, cols, error: "", name: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
    })
});

// POST new user
router.post("/", (req, res) => {
  const { cpf, username, password, email, phone, sexo, curso } = req.body
  fetch(url + '/register', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, username, password, email, phone, sexo, curso })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE user
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { cpf, username, password, email, phone, sexo, curso } = req.body
  const token = req.session.token || ""
  fetch(url+id, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ cpf, username, password, email, phone, sexo, curso })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE user
router.delete("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url+id, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET user by id
router.get("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url+id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((user) => {
      res.send(user)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
