module.exports = {
	listaSensor(callback) {
		var sql = 'SELECT * FROM dwpt_dai.sensor';
		global.connection.query(sql, function(error, rows, fields){
			if (error) throw error;
			callback(rows);
		});
	},

	readSensor(id_sensor, callback) {
		var sql = "SELECT * from dwpt_dai.sensor where id_sensor=?";	
		global.connection.query(sql, [id_sensor], function(error, rows, fields) {
			if (error) throw error;
			callback(rows[0]);			
		});
	},	

	createSensor(data, callback) {
		var sql = "INSERT INTO dwpt_dai.sensor (id_sensor, id_tipo) VALUES (?,?)"; 
		global.connection.query(
			sql, [data.id_sensor, data.id_tipo], function(error, rows, fields) {
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
	


	//New

};
