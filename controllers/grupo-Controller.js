const mysql = require('../mysql').pool;

exports.postGrupo =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO grupo (descricao) VALUES (?);`,
        [req.body.descricao],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'Grupo Cadastrado com sucesso.',
            grupoCriado: {
              id_grupo: result.insertId,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Grupos',
                url: 'http://localhost:3000/grupos'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };

  exports.getGrupos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'SELECT id_grupo, descricao FROM grupo;',
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            grupos: result.map(grup => {
              return {              
                id_grupo: grup.id_grupo,
                descricao: grup.descricao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um Grupo específico.',
                  url: 'http://localhost:3000/grupos/' + grup.id_grupo
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

  exports.getGrupo = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
      `SELECT 
          id_grupo, 
          descricao 
        FROM 
          grupo 
        WHERE 
          id_grupo = ?;
      `,
        [req.params.id_grupo],
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}        
          if (result.length == 0) {
            return res.status(404).send({
              mensagem: 'ID não encontrado.'
            })
          }        
          const response = {
            grupo: {
              id_grupo: result[0].id_grupo,
              descricao: result[0].descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Grupos',
                url: 'http://localhost:3000/grupos'
              }
            }
          }
          return res.status(200).send(response);
        }
      )
    })
  };

  exports.patchGrupo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE grupo
            SET descricao = ?
         WHERE id_grupo = ?;`,
        [
          req.body.descricao,
          req.body.id_grupo
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'Grupo Atualizado com sucesso.',
           grupoAtualizado: {
              id_grupo: req.body.id_grupo,
              descricao: req.body.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um Grupo específico',
                url: 'http://localhost:3000/grupos/' + req.body.id_grupo
              }
            }
          }
          return res.status(202).send(response);
        }
      )
    });
  };

  exports.deleteGrupo = (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'DELETE FROM grupo WHERE id_grupo = ?;',
        [req.params.id_grupo],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: ' Grupo Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um Grupo',
              url: 'http://localhost:3000/grupo',
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
   