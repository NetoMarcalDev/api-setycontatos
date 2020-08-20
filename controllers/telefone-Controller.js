const { param } = require('../routes/users');

const mysql = require('../mysql').pool;

exports.postTelefone =  (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `INSERT INTO telefone (numero, id_contato, id_tipo_telefone) VALUES (?,?,?);`,
      [req.body.numero, req.body.id_contato, req.body.id_tipo_telefone],
      (error, result, field) => {
        conn.release();
        if(error) {        
          return res.status(500).send({ error: error })
        }
        const response = {
          mensagem: 'Telefone Cadastrado com sucesso.',
          telefoneCriado: {
            id_telefone: result.insertId,
            numero: req.body.numero,
            id_tipo_telefone: req.body.id_tipo_telefone,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os Telefones',
              url: 'http://localhost:3000/telefones'
            }
          }
        }  
        return res.status(201).send(response);
      }
    )
  });    
};

exports.getTelefones = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query( 
      `SELECT telefone.id_telefone,
              telefone.numero,
              contato.id_contato,
              contato.nome,
              tipo_telefone.id_tipo_telefone,
              tipo_telefone.descricao
          FROM 
              telefone
          INNER JOIN
              contato
          ON contato.id_contato = telefone.id_contato
          INNER JOIN
              tipo_telefone
          ON tipo_telefone.id_tipo_telefone = telefone.id_tipo_telefone`,
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}
       
        return res.status(200).send(result)
      }
    )
  })
};

exports.getTelefone = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query( 
      `SELECT
        contato.id_contato, 
        telefone.id_telefone,
        tipo_telefone.id_tipo_telefone,
        grupo.id_grupo,
        contato.nome,
        telefone.numero,
        tipo_telefone.descricao,
        grupo.descricao AS grupo,
        contato.observacao
      FROM 
        telefone
      INNER JOIN
          contato
      ON contato.id_contato = telefone.id_contato
      INNER JOIN
        grupo
      ON grupo.id_grupo = contato.id_grupo
      INNER JOIN
        tipo_telefone
      ON tipo_telefone.id_tipo_telefone = telefone.id_tipo_telefone
      WHERE 
        numero = ?`,
      [req.params.numero],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Telefone não cadastrado.'
          })
        }       
       
        return res.status(200).send(result)
      }
    )
  })
};

exports.patchTelefone = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE telefone
          SET 
            numero = ?,
            id_tipo_telefone = ?
       WHERE id_telefone = ?;`,
      [
        req.body.numero,
        req.body.id_tipo_telefone,
        req.body.id_telefone
      ],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Telefone Atualizado com sucesso.',
         telefoneAtualizado: {
            id_telefone: req.body.id_telefone,
            numero: req.body.numero,
            id_tipo_telefone: req.body_id_tipo_telefone,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um telefone específico',
              url: 'http://localhost:3000/tipos-acesso/' + req.body.id_tipo_telefone
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });
};

exports.deleteTelefone = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'DELETE FROM telefone WHERE id_telefone = ?;',
      [req.body.id_telefone],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Telefone Excluídodo com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um Telefone',
            url: 'http://localhost:3000/telefones',
            body: {
              numero: 'String',
              id_tipo_telefone: 'int'
            }
          }
        }        
        return res.status(202).send(response);
      }
    )
  });
};

