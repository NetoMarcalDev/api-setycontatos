const mysql = require('../mysql').pool;

exports.postEmail =  (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `INSERT INTO email (email, id_contato, id_tipo_email) VALUES (?,?,?);`,
        [req.body.email, req.body.id_contato, req.body.id_tipo_email],
        (error, result, field) => {
          conn.release();
          if(error) {        
            return res.status(500).send({ error: error })
          }
          const response = {
            mensagem: 'E-mail Cadastrado com sucesso.',
            emailCriado: {
              id_email: result.insertId,
              email: req.body.nome,
              id_tipo_email: req.body.id_tipo_email,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os Emails',
                url: 'http://localhost:3000/emails'
              }
            }
          }  
          return res.status(201).send(response);
        }
      )
    });    
  };

  exports.getEmails = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `SELECT
          email.id_email,
          email.email,
          email.id_contato,
          email.id_tipo_email,
          tipoEmail.descricao
        FROM
          email
        INNER JOIN
          tipo_email as tipoEmail
        ON tipoEmail.id_tipo_email = email.id_tipo_email
        `,
        (error, result, field) => {
          if(error) { return res.status(500).send({ error: error })}
          const response = {     
            quantidade: result.length,     
            contatos: result.map(ema => {
              return {              
                id_email: ema.id_email,
                email: ema.email,
                id_contato: ema.id_contato,
                tipoEmail: {
                  id_tipo_email: ema.id_tipo_email,
                  descricao: ema.descricao
                },
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna detalhes de um Email específico.',
                  url: 'http://localhost:3000/emails/' + ema.id_email
                }
              }
            })
          }    
          return res.status(200).send(response)
        }
      )
    })
  };

   exports.getEmailContato = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
         `SELECT
        email.id_email,
        email.email,
        email.id_contato,
        email.id_tipo_email,
        tipoEmail.descricao
      FROM
        email
      INNER JOIN
        tipo_email as tipoEmail
      ON tipoEmail.id_tipo_email = email.id_tipo_email
	  WHERE	
		email.id_contato = ? `,
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
  


  exports.patchEmail = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `UPDATE email
            SET 
              email = ?,
              id_tipo_email = ?
         WHERE 
            id_email = ?;`,
        [
          req.body.email,
          req.body.id_tipo_email,
          req.body.id_email
        ],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'E-mail Atualizado com sucesso.',
           emailAtualizado: {
              id_email: req.body.id_email,
              email: req.body.email,
              id_tipo_email: req.body.id_tipo_email,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um E-mail específico',
                url: 'http://localhost:3000/emails/' + req.body.id_email
              }
            }
          }
          return res.status(202).send(response);
        }
      )
    });
  };

  exports.deleteEmail= (req, res, next) => {  
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        'DELETE FROM email WHERE id_email = ?;',
        [req.body.id_email],
        (error, result, field) => {
          conn.release();
          if(error) { return res.status(500).send({ error: error })}
          const response = {
            mensagem: 'E-mail Excluídodo com sucesso.',
            request: {
              tipo: 'POST',
              descricao: 'Insere um E-mail',
              url: 'http://localhost:3000/emails',
              body: {
                email: 'String',
                id_contato: 'Int',
                id_tipo_email: 'Int'
              }
            }
          }        
          return res.status(202).send(response);
        }
      )
    });
  };
   