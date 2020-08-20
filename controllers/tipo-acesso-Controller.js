const mysql = require('../mysql').pool;

exports.postTipoAcesso =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO tipo_acesso (descricao) VALUES (?);`,
        [req.body.descricao],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Tipo de acesso Cadastrado com sucesso.',
            tipoAcessoCriado: {
              id_tipo_acesso: result.insertId,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de acesso.',
                url: 'http://localhost:3000/tipos-acesso'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };

  exports.getTiposAcesso = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'SELECT id_tipo_acesso, descricao FROM tipo_acesso;',
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            tipos_acesso: result.map(tipo => {
              return {              
                id_tipo_acesso: tipo.id_tipo_acesso,
                descricao: tipo.descricao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um Tipo de acesso específico.',
                  url: 'http://localhost:3000/tipos-email/' + tipo.id_tipo_acesso
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

  exports.getTipoAcesso = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
      `SELECT 
            id_tipo_acesso, 
            descricao 
          FROM tipo_acesso 
        WHERE 
          id_tipo_acesso = ?;
      `,
        [req.params.id_tipo_acesso],
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}        
          if (result.length == 0) {
            return res.status(404).send({
              mensagem: 'ID não encontrado.'
            })
          }        
          const response = {
            tipoAcesso: {
              id_tipo_acesso: result[0].id_tipo_acesso,
              descricao: result[0].descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de acesso',
                url: 'http://localhost:3000/tipos-acesso'
              }
            }
          }
          return res.status(200).send(response);
        }
      )
    })
  };

  exports.patchTipoAcesso = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE tipo_acesso
            SET descricao = ?
         WHERE id_tipo_acesso = ?;`,
        [
          req.body.descricao,
          req.body.id_tipo_acesso
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de acesso Atualizado com sucesso.',
           tipoAcessoAtualizado: {
              id_tipo_acesso: req.body.id_tipo_acesso,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um Tipo de acesso específico',
                url: 'http://localhost:3000/tipos-acesso/' + req.body.id_tipo_acesso
              }
            }
          }
          return res.status(202).send(response);
        }
      )
    });
  };

  exports.deleteTipoAcesso = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'DELETE FROM tipo_acesso WHERE id_tipo_acesso = ?;',
        [req.body.id_tipo_acesso],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de acesso Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um Tipo de Aacesso',
              url: 'http://localhost:3000/tipos-acesso',
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