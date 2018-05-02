module.exports = {
	listaDivisao(callback) {
		var sql = 'SELECT * FROM dwpt_dai.v_contas';
		global.connection.query(sql, function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	readDivisao(id_division, callback) {
		var sql = "SELECT * FROM dwpt_dai.v_contas where id_division=?";	
		global.connection.query(sql, [id_division], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},

	readEmail(email, callback) {
		var sql = 'SELECT * FROM dwpt_dai.v_contas where email=?';
		global.connection.query(sql, [email], function(error, rows, fields) {
		  if (error) throw error;
		  callback(rows);
		});
	},	

	createDivisao(data, callback) {
		var sql = "INSERT INTO dwpt_dai.division (id_house, name, sensor_id) VALUES (?,?,?)"; 
		global.connection.query(
			sql, [data.id_house, data.name, data.sensor_id], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},

	updateDivisao(id_division, data, callback) {
		var sql = "UPDATE division SET id_house=?,name=?,sensor_id=? WHERE id_division=?"; 
		global.connection.query(
			sql, [data.id_house, data.name, data.sendor_id, id_division], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},
	


	//New

};