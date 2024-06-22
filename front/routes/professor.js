var express = require('express');
var router = express.Router();
const url = "https://didactic-sniffle-5gqxqwq47xr4h7p5w-6000.app.github.dev/professor/"

/* GET pets listing. */
router.get('/', function (req, res, next) {
  let title = "Gestão de Professores"
  let cols = ["Id", "CPF", "Nome", "Email", "Telefone","Sexo", "Grau", "Ações"]
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
    .then((pets) => {
      res.render('layout', { body: 'pages/professor', title, pets, cols, error: "" })
    })
    .catch((error) => {
      console.log('Erro', error)
      res.redirect('/login')
    })
});

// POST new pet
router.post("/", (req, res) => {
  const { cpfProfessor, nomeProfessor, email, phone, sexo, especializacao } = req.body
  const token = req.session.token || ""
  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`

     },
    body: JSON.stringify({ cpfProfessor, nomeProfessor, email, phone, sexo, especializacao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// UPDATE pet
router.put("/:id", (req, res) => {
  const { id } = req.params
  const { cpfProfessor, nomeProfessor, email, phone, sexo, especializacao } = req.body
  const token = req.session.token || ""
  fetch(url + id, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify({ cpfProfessor, nomeProfessor, email, phone, sexo, especializacao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// REMOVE pet
router.delete("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url + id, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

// GET pet by id
router.get("/:id", (req, res) => {
  const { id } = req.params
  const token = req.session.token || ""
  fetch(url + id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((pet) => {
      res.send(pet)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
