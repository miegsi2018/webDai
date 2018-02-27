module.exports = {
	list(callback) {
		var sql = 'SELECT * from users WHERE ativo=1';
		global.connection.query(sql, function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	read(username, callback) {
		var sql = "SELECT * from users where username=?";	
		global.connection.query(sql, [username], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},	

	create(data, callback) {
		var sql = "INSERT INTO users (username, nome, password,ativo) VALUES (?,?,?,?,?,?,?,1)"; 
		global.connection.query(
			sql, [data.username, data.nome, data.password], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},

	update(username, data, callback) {
		var sql = "UPDATE users SET nome=?,password=? WHERE username=?"; 
		global.connection.query(
			sql, [data.nome, data.password, username], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},
	
	remove(username, callback) {
		var sql = "UPDATE users SET ativo=0 where username=?"; 
		global.connection.query(sql, [username], function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	//New
	areValidCredentials(username, password, callback) {
		var sql = "SELECT * from users where ativo=1 AND username=?";
		global.connection.query(sql, [username], function(error, rows, fields){
			if (error) throw error;
			if (rows.length == 1 && rows[0].password === password) {
				callback(true);
			}else{
				callback(false);
			}
		});
	}
};
