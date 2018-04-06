module.exports = {
  list(callback) {
    var sql = 'SELECT * FROM dwpt_dai.utilizador';
    global.connection.query(sql, function(error, rows, fields) {
      if (error) throw error;
      callback(rows);
    });
  },

  readEmail(email, callback) {
    var sql = 'SELECT * FROM dwpt_dai.contas_v where email=?';
    global.connection.query(sql, [email], function(error, rows, fields) {
      if (error) throw error;
      callback(rows[0]);
    });
  },
  read(email, callback) {
    var sql = "SELECT * from utilizador where email=?";
    global.connection.query(sql, [email], function(error, rows, fields) {
      if (error) throw error;
      callback(rows[0]);
    });
  },


  create(data, callback) {
    var sql = "INSERT INTO utilizador (username, password, email) VALUES (?,?,?)";
    global.connection.query(
      sql, [data.username, data.password, data.email],
      function(error, rows, fields) {
        if (error) throw error;
        callback(rows[0]);
      });
  },

  update(username, data, callback) {
    var sql = "UPDATE users SET nome=?,password=? WHERE username=?";
    global.connection.query(
      sql, [data.nome, data.password, username],
      function(error, rows, fields) {
        if (error) throw error;
        callback(rows[0]);
      });
  },

  remove(username, callback) {
    var sql = "UPDATE users SET ativo=0 where username=?";
    global.connection.query(sql, [username], function(error, rows, fields) {
      if (error) throw error;
      callback(rows);
    });
  },

  //New
  areValidCredentials(email, password, callback) {
    var sql = "SELECT * from utilizador where email=?";
    global.connection.query(sql, [email], function(error, rows, fields) {
      if (error) throw error;
      if (rows.length == 1 && rows[0].password === password) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }
};
