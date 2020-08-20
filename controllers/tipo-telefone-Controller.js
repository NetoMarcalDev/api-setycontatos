const mysql = require('../mysql').pool;

exports.postTipoTelefone =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO tipo_telefone (descricao) VALUES (?);`,
        [req.body.descricao],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Tipo de telefone Cadastrado com sucesso.',
            tipoAcessoCriado: {
              id_tipo_telefone: result.insertId,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de telefone.',
                url: 'http://localhost:3000/tipos-telefone'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };

  exports.getTiposTelefone = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'SELECT id_tipo_telefone, descricao FROM tipo_telefone;',
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            tipos_telefone: result.map(tipo => {
              return {              
                id_tipo_telefone: tipo.id_tipo_telefone,
                descricao: tipo.descricao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um Tipo de telefone específico.',
                  url: 'http://localhost:3000/tipos-telefone/' + tipo.id_tipo_telefone
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

  exports.getTipoTelefone = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
      `SELECT 
          id_tipo_telefone, 
          descricao FROM tipo_telefone 
        WHERE 
          id_tipo_telefone = ?;
      `,
        [req.params.id_tipo_telefone],
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}        
          if (result.length == 0) {
            return res.status(404).send({
              mensagem: 'ID não encontrado.'
            })
          }        
          const response = {
            tipoTelefone: {
              id_tipo_telefone: result[0].id_tipo_telefone,
              descricao: result[0].descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Tipos de telefone',
                url: 'http://localhost:3000/tipos-telefone'
              }
            }
          }
          return res.status(200).send(response);
        }
      )
    })
  };

  exports.patchTipoTelefone = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE tipo_telefone
            SET descricao = ?
         WHERE id_tipo_telefone = ?;`,
        [
          req.body.descricao,
          req.body.id_tipo_telefone
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de telegone Atualizado com sucesso.',
           tipoTelefoneAtualizado: {
              id_tipo_telefone: req.body.id_tipo_telefone,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um Tipo de telefone específico',
                url: 'http://localhost:3000/tipo-telefone/' + req.body.id_tipo_telefone
              }
            }
          }
          return res.status(202).send(response);
        }
      )
    });
  };

  exports.deleteTipoTelefone = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'DELETE FROM tipo_telefone WHERE id_tipo_telefone = ?;',
        [req.body.id_tipo_telefone],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Tipo de telefone Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um Tipo de Telefone',
              url: 'http://localhost:3000/tipo-telefone',
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