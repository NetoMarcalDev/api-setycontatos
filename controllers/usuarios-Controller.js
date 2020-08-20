const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if(err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE descricao = ?', [req.body.descricao], (error, results) => {
      if(error){ return res.status(500).send({ error: error }) }
      if(results.length > 0){
        res.status(409).send({ mensagem: 'Usário já cadastrado' })
      }else{
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if(errBcrypt){  return res.status(500).send({ error: errBcrypt }) }
          conn.query(
            `INSERT INTO usuario (descricao, senha, id_tipo_acesso) VALUES(?,?,?)`,
            [ req.body.descricao, 
              hash,
              req.body.id_tipo_acesso
            ],
            (error, result) => {
              conn.release();
              if(error){ return res.status(500).send({ error: error }) }
              response = {
                mensagem: 'Usuário cadastrado com sucesso.',
                usuarioCriado: {
                  id_usuario: result.insertId,
                  descricao: req.body.descricao, 
                  request: {
                    tipo: 'POST',
                    descricao: 'Insere um usuário',
                    "url": 'http://localhost:3000/usuarios'
                  }             
                }
              }
              return res.status(201).send(response);
            })
        });
      }
    })
  });
};

exports.getUsuarios = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'SELECT id_usuario, descricao FROM usuario;',
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}
        const response = {     
          quantidade: result.length,     
          usuario: result.map(user => {
            return {              
              id_usuario: user.id_usuario,
              descricao: user.descricao,
              request: {
                tipo: 'GET',
                descricao: 'Retorna alista detalhada dos usuários.',
                url: 'http://localhost:3000/usuarios/Consulta'
              }
            }
          })
        }    
        return res.status(200).send(response)
      }
    )
  })
};

exports.getUsuario = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'SELECT id_usuario, descricao FROM usuario WHERE id_usuario = ?;',
      [req.params.id_usuario],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}        
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'ID não encontrado.'
          })
        }        
        const response = {
          usuario: {
            id_usuario: result[0].id_usuario,
            descricao: result[0].descricao,
            request: {
              tipo: 'GET',
              descricao: 'Retorna usuário específico por ID',
              url: 'http://localhost:3000/usuarios'
            }
          }
        }
        return res.status(200).send(response);
      }
    )
  })
};


exports.pathUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if(err) { return res.status(500).send({ error: error }) }    
      bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
        if(errBcrypt){  return res.status(500).send({ error: errBcrypt }) }
        conn.query(
          `UPDATE usuario SET 
            descricao = ?, 
            senha = ?, 
            id_tipo_acesso = ?
          WHERE id_usuario = ?`,
          [ req.body.descricao, 
            hash,
            req.body.id_tipo_acesso,
            req.body.id_usuario
          ],
          (error, result) => {
            conn.release();
            response = {
              mensagem: 'Usuário atualizado com sucesso.',
              usuarioAtualizado: {
                id_usuario: req.body.insertId,
                descricao: req.body.descricao, 
                request: {
                  tipo: 'GET',
                  descricao: 'Retorno detalhes do usuário específico',
                  "url": 'http://localhost:3000/usuarios/consulta/' + req.body.id_usuario
                }             
              }
            }
            return res.status(202).send(response);
          })
      });
  });
};

exports.deleteUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if(err) { return res.status(500).send({ error: error }) }
        conn.query(
          `DELETE FROM usuario WHERE id_usuario = ?`,
          [ 
            req.body.id_usuario
          ],
          (error, results) => {
            conn.release();
            if(error){ return res.status(500).send({ error: error }) }
            response = {
              mensagem: 'Usuário excluído com sucesso.',
              request: {
                tipo: 'POST',
                descricao: 'Insere um usuário',
                url: 'http://localhost:3000/usuarios/cadastro',
                body: {
                  descricao: 'String',
                  senha: 'String',
                  id_tipo_acesso: 'Int'
                }           
              }
            }
            return res.status(202).send(response);
          })
  });
};

exports.Login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    const query = `SELECT * from usuario WHERE descricao = ?`;
    conn.query(query, [req.body.descricao], (error, results, fields) => {
      conn.release();
      if(error) { return res.status(500).send({ error: error }) }
      if(results.length < 1) {
        return res.status(401).send({ mensagem: 'Usuário inexistente.' });
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if(err){
          return res.status(500).send({ error: error })
        }
        if(result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            descricao: results[0].descricao,
          }, 
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          });
          return res.status(200).send({ 
            mensagem: 'Autenticado com sucesso.' ,
            token: token,
            id_usuario: results[0].id_usuario,
            descricao: results[0].descricao,
          });
        }
        return res.status(401).send({ mensagem: 'Senha inválida.' });
      });
    });
  });
}