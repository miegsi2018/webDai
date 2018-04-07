module.exports = {
	listaDivisao(callback) {
		var sql = 'SELECT * FROM dwpt_dai.contas_v';
		global.connection.query(sql, function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	readDivisao(id_divisao, callback) {
		var sql = "SELECT * FROM dwpt_dai.contas_v where id_divisao=?";	
		global.connection.query(sql, [id_divisao], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},

	readEmail(email, callback) {
		var sql = 'SELECT * FROM dwpt_dai.contas_v where email=?';
		global.connection.query(sql, [email], function(error, rows, fields) {
		  if (error) throw error;
		  callback(rows);
		});
	},	

	createDivisao(data, callback) {
		var sql = "INSERT INTO dwpt_dai.divisao (id_casa, nome, id_sensor) VALUES (?,?,?)"; 
		global.connection.query(
			sql, [data.id_casa, data.nome, data.id_sensor], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},

	updateDivisao(id_divisao, data, callback) {
		var sql = "UPDATE divisao SET id_casa=?,nome=?,id_sensor=? WHERE id_divisao=?"; 
		global.connection.query(
			sql, [data.id_casa, data.nome, id_divisao], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},
	


	//New

};