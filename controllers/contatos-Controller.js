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
		  conn.release();
          if(error) { return res.status(500).send({ error: error })}
          return res.status(200).send(result)
        }
      )
    })
  };
  
  exports.getContatosLista = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `SELECT
			cont.id_contato,
			cont.nome,
			fone.numero,
			tipo.descricao as tipo,
			grup.descricao as grupo
		FROM
			telefone as fone
		INNER JOIN
			contato as cont
		ON
			cont.id_contato = fone.id_contato
		INNER JOIN
			tipo_telefone as tipo 
		ON
			tipo.id_tipo_telefone = fone.id_tipo_telefone  
		INNER JOIN
			grupo as grup 
		ON
			grup.id_grupo = cont.id_grupo  
		ORDER BY 
			cont.nome ASC`,
        (error, result, field) => {
		  conn.release();
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
			conn.release();
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
  
  exports.deleteTelefones = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'DELETE FROM telefone WHERE id_contato = ?;',
      [req.body.id_contato],
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

exports.deleteContato = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `DELETE FROM 
			contato
		WHERE
			id_contato = ?;`,
      [req.params.id_contato],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Contato exluídos com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um Contato',
            url: 'http://localhost:3000/contatos',
            body: {
              numero: 'String',
              id_contato: 'int'
            }
          }
        }        
        return res.status(202).send(response);
      }
    )
  });
};

  exports.deleteContatos = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `DELETE 
			telefone
		FROM 
			contato
		INNER JOIN 
			telefone ON contato.id_contato = telefone.id_contato			
		WHERE
			contato.id_contato = ?`,
      [req.params.id_contato],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Telefones e e-mails exluídos com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um Contato',
            url: 'http://localhost:3000/contatos',
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

exports.patchContato = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE 
		contato 
	SET 
		nome = ?,
		id_grupo = ?,
		observacao = ?
	WHERE
		id_contato = ?`,
      [
        req.body.nome,
        req.body.id_grupo,
        req.body.observacao,
		req.body.id_contato
      ],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Contato Atualizado com sucesso.',
         contatoAtualizado: {
            id_contato: req.body.id_contato,
            nome: req.body.nome,
            id_grupo: req.body.id_grupo,
			observacao: req.body.observacao,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um contato específico',
              url: 'http://localhost:3000/contatos/' + req.body.id_contato
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });
};

exports.deleteEmail = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `DELETE FROM 
			email
		WHERE
			id_contato = ?`,
      [req.params.id_contato],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Email exluídos com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um E-mail',
            url: 'http://localhost:3000/contatos',
            body: {
              numero: 'String',
              id_email: 'int'
            }
          }
        }        
        return res.status(202).send(response);
      }
    )
  });
};
  