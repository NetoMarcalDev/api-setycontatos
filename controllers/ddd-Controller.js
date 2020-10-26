const mysql = require('../mysql').pool;

  exports.getDdds = (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if(error) { return res.status(500).send({ error: error })}
      conn.query(
        `SELECT 
          id_codigo_area,
          ddd,
          uf,
          cidade
        FROM
          codigo_area
		ORDER BY 
			ddd ASC`,
        (error, result, field) => {
		  conn.release();
          if(error) { return res.status(500).send({ error: error })}
          return res.status(200).send(result)
        }
      )
    })
  };
  
  