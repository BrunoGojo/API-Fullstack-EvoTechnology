const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

// CRIANDO TABELA professorS
db.run(`
  CREATE TABLE IF NOT EXISTS professor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpfProfessor TEXT UNIQUE,
    nomeProfessor TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    sexo TEXT,
    especializacao TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela professor:', err);
  } else {
    console.log('Tabela professor criada com sucesso!');
  }
});

// Função auxiliar para execução de queries
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

// Função auxiliar para busca de dados
const getQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Função auxiliar para busca de múltiplos dados
const allQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/* POST create a new professor. */
router.post('/', verifyJWT, async (req, res) => {
  const { cpfProfessor, nomeProfessor, email, phone, sexo, especializacao } = req.body;

  try {
    await runQuery('INSERT INTO professor (cpfProfessor, nomeProfessor, email, phone, sexo, especializacao) VALUES (?, ?, ?, ?, ?, ?)', [cpfProfessor, nomeProfessor, email, phone, sexo, especializacao]);
    console.log("professor criado com sucesso:", nomeProfessor);
    res.status(201).send({ message: "professor criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar o professor:", error);
    res.status(500).send({ error: 'Erro ao criar o professor' });
  }
});

/* GET professor listing. */
router.get('/', verifyJWT, async (req, res) => {
  try {
    const professor = await allQuery('SELECT * FROM professor', []);
    res.status(200).send(professor);
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    res.status(500).send({ error: "Erro ao buscar professor" });
  }
});

/* GET single professor by ID. */
router.get('/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const professor = await getQuery('SELECT * FROM professor WHERE id = ?', [id]);
    if (!professor) {
      return res.status(404).json({ error: 'professor não encontrado' });
    }
    res.status(200).json(professor);
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({ error: 'Erro ao buscar professor' });
  }
});

/* PUT update a professor. */
router.put('/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { cpfProfessor, nomeProfessor, email, phone, sexo, especializacao } = req.body;

  try {
    const result = await runQuery('UPDATE professor SET cpfProfessor = ?, nomeProfessor = ?, email = ?, phone = ?, sexo = ?, especializacao = ? WHERE id = ?', [cpfProfessor, nomeProfessor, email, phone, sexo, especializacao, id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'professor não encontrado' });
    }
    res.status(200).json({ message: "professor atualizado com sucesso" });
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    res.status(500).json({ error: 'Erro ao atualizar professor' });
  }
});

/* PATCH partially update a professor. */
router.patch('/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  try {
    const result = await runQuery(`UPDATE professor SET ${setClause} WHERE id = ?`, [...values, id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'professor não encontrado' });
    }
    res.status(200).json({ message: "professor atualizado parcialmente com sucesso" });
  } catch (error) {
    console.error('Erro ao atualizar professor parcialmente:', error);
    res.status(500).json({ error: 'Erro ao atualizar professor parcialmente' });
  }
});

/* DELETE a professor. */
router.delete('/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await runQuery('DELETE FROM professor WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'professor não encontrado' });
    }
    res.status(200).json({ message: "professor deletado com sucesso" });
  } catch (error) {
    console.error('Erro ao deletar professor:', error);
    res.status(500).json({ error: 'Erro ao deletar professor' });
  }
});

module.exports = router;
