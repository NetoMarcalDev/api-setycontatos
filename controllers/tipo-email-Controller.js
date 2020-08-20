const mysql = require('../mysql').pool;

exports.postTipoEmail =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO tipo_email (descricao) VALUES (?);`,
        [req.body.descricao],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Tipo de e-mail Cadastrado com sucesso.',
            tipoAcessoCriado: {
              id_tipo_email: result.insertId,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de email.',
                url: 'http://localhost:3000/tipos-email'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };

  exports.getTiposEmail = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'SELECT id_tipo_email, descricao FROM tipo_email;',
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            tipos_email: result.map(tipo => {
              return {              
                id_tipo_email: tipo.id_tipo_email,
                descricao: tipo.descricao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um Tipo de e-mail específico.',
                  url: 'http://localhost:3000/tipos-email/' + tipo.id_tipo_email
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

  exports.getTipoEmail = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
      `SELECT 
            id_tipo_email, 
            descricao 
          FROM tipo_email 
        WHERE 
          id_tipo_email = ?;
      `,
        [req.params.id_tipo_email],
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}        
          if (result.length == 0) {
            return res.status(404).send({
              mensagem: 'ID não encontrado.'
            })
          }        
          const response = {
            tipoEmail: {
              id_tipo_email: result[0].id_tipo_email,
              descricao: result[0].descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de e-mail',
                url: 'http://localhost:3000/tipos-email'
              }
            }
          }
          return res.status(200).send(response);
        }
      )
    })
  };

  exports.patchTipoEmail = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE tipo_email
            SET descricao = ?
         WHERE id_tipo_email = ?;`,
        [
          req.body.descricao,
          req.body.id_tipo_email
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de e-amil Atualizado com sucesso.',
           tipoEmailAtualizado: {
              id_tipo_email: req.body.id_tipo_email,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um Tipo de e-mail específico',
                url: 'http://localhost:3000/tipos-email/' + req.body.id_tipo_email
              }
            }
          }
          return res.status(202).send(response);
        }
      )
    });
  };

  exports.deleteTipoEmail = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'DELETE FROM tipo_email WHERE id_tipo_email = ?;',
        [req.body.id_tipo_email],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de e-mail Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um Tipo de E-mail',
              url: 'http://localhost:3000/tipos-telefone',
              body: {
                descricao: 'String'
              }
            }
          }        
          return res.status(202).send(response);
        }
      )
    });
  };