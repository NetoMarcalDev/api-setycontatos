const mysql = require('../mysql').pool;

exports.postContato =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO contato (nome, id_grupo, observacao) VALUES (?,?,?);`,
        [req.body.nome, req.body.id_grupo, req.body.observacao],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Contato Cadastrado com sucesso.',
            contatoCriado: {
              id_contato: result.insertId,
              nome: req.body.nome,
              id_grupo: req.body.id_grupo,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Contatos',
                url: 'http://localhost:3000/contatos'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };
  
  exports.getContatos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `SELECT 
          id_contato,
          nome,
          id_grupo,
          observacao
        FROM
          contato`,
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          return res.status(200).send(result)
        }
      )
    })
  };

  exports.getTelefones = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `SELECT 
          telefone.id_telefone, 
          telefone.id_tipo_telefone, 
          telefone.numero,
          tipo_telefone.descricao AS tipo 
        FROM 
          telefone 
        INNER JOIN
          tipo_telefone
        ON tipo_telefone.id_tipo_telefone = telefone.id_tipo_telefone
        WHERE 
          telefone.id_contato = ?`,
          [req.params.id_contato],
          (error, result, field) => {
            if(error) { return res.status(500).send({ error: error })}        
            if (result.length == 0) {
              return res.status(404).send({
                mensagem: 'Não há telefone cadastrado nesse contato.'
              })
            }       
          return res.status(200).send(result)
        }
      )
    })
  };
  