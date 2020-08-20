const mysql = require('../mysql').pool;

exports.postHistorico =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO historico (data, descricao, id_contato) VALUES (?,?,?);`,
        [ req.body.data =  new Date(), 
          req.body.descricao, 
          req.body.id_contato 
        ],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Histórico Cadastrado com sucesso.',
            telefoneCriado: {
              id_historico: result.insertId,
              data: req.body.data,
              id_contato: req.body.id_contato,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Históricos',
                url: 'http://localhost:3000/historicos'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };
  
  exports.getHistoricos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'SELECT id_historico, data, descricao FROM historico;',
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            historicos: result.map(hist => {
              return {              
                id_hisrorico: hist.id_hisrorico,
                descricao: hist.descricao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um histórico específico.',
                  url: 'http://localhost:3000/historicos/' + hist.id_historico
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

  exports.getHistorico = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
      `SELECT 
          id_historico,
          data, 
          descricao 
        FROM 
          historico 
        WHERE 
          id_historico = ?;
      `,
        [req.params.id_historico],
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}        
          if (result.length == 0) {
            return res.status(404).send({
              mensagem: 'ID não encontrado.'
            })
          }        
          const response = {
            historico: {
              id_historico: result[0].id_historico,
              descricao: result[0].descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Históricos',
                url: 'http://localhost:3000/historicos'
              }
            }
          }
          return res.status(200).send(response);
        }
      )
    })
  };

  exports.patchHistorico = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE historico
            SET descricao = ?
         WHERE id_historico = ?;`,
        [
          req.body.descricao,
          req.body.id_historico
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Histórico Atualizado com sucesso.',
           historicoAtualizado: {
              id_historico: req.body.id_historico,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um Histórico específico',
                url: 'http://localhost:3000/historicos/' + req.body.id_historico
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
        'DELETE FROM historico WHERE id_historico = ?;',
        [req.body.id_historico],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: ' Histórico Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um Histórico',
              url: 'http://localhost:3000/historico',
              body: {
                descricao: 'String',
                id_contato: 'Int'
              }
            }
          }        
          return res.status(202).send(response);
        }
      )
    });
  };