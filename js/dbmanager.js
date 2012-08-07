/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * DBManager class is responsible for communicating with the game's database 
 */
function DBManager() {
  
  var self = this;
  
  //SQL statement used to create users table
  self.createUsersStatement = "CREATE TABLE IF NOT EXISTS users (_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username TEXT NOT NULL UNIQUE )";
  //SQL statement used to create scores table
  self.createScoresStatement = "CREATE TABLE IF NOT EXISTS scores (_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, " +
										 "name_id INTEGER, moves INTEGER, time INTEGER, level INTEGER, img_url TEXT, FOREIGN KEY(name_id) REFERENCES users(_id))";
  
  //SQL statement used to insert new record into the users table
  self.insertUserStatement = "INSERT INTO users (_id, username) VALUES (NULL, ?)";
  //SQL statement used to insert new record into the scores table
  self.insertScoresStatement = "INSERT INTO scores (_id, name_id, moves, time, level, img_url) VALUES (NULL, ?, ?, ?, ?, ?)";
  
  //SQL statement used to delete the users table
  self.dropUsersStatement = "DROP TABLE users";
  //SQL statement used to delete the scores table
  self.dropScoresStatement = "DROP TABLE scores";
  
  //SQL statement used to get all records from the users table
  self.selectAllUsersStatement = "SELECT * FROM users";
  //SQL statement used to get a specific user from the users table
  self.selectUserStatement = "SELECT * FROM users WHERE username = ?";
  
  //SQL statement used to get best results based on the number of moves
  self.selectLessMovesResultsStatement = "SELECT users.username, scores.moves FROM users, scores WHERE scores.name_id = users._id AND scores.level = ? AND scores.img_url = ? ORDER BY scores.moves ASC LIMIT ?";
  //SQL statement used to get best results based on time
  self.selectFastestResultsStatement = "SELECT users.username, scores.time FROM users, scores WHERE scores.name_id = users._id AND scores.level = ? AND scores.img_url = ? ORDER BY scores.time ASC LIMIT ?";
  
  //SQL statement used to get best results based on the number of moves
  self.selectLessMovesResultsLbStatement = "SELECT users.username, scores.moves, scores.img_url FROM users, scores WHERE scores.name_id = users._id AND scores.level = ? ORDER BY scores.moves ASC LIMIT ?";
  //SQL statement used to get best results based on time
  self.selectFastestResultsLbStatement = "SELECT users.username, scores.time, scores.img_url FROM users, scores WHERE scores.name_id = users._id AND scores.level = ? ORDER BY scores.time ASC LIMIT ?";
  
  //SQL statement used to get best results based on the number of moves
  self.selectPictureLessMovesStatement = "SELECT users.username, scores.moves FROM users, scores WHERE scores.img_url = ? AND scores.level = ? ORDER BY scores.moves ASC LIMIT ?";
  //SQL statement used to get best results based on time
  self.selectPictureFastestStatement = "SELECT users.username, scores.time FROM users, scores WHERE scores.img_url = ? AND scores.level = ? ORDER BY scores.time ASC LIMIT ?";
  
  self.db = openDatabase("SliderPuzzleDb", "1.1", "Slider Puzzle DB", 200000);
  
  /**
	* DBManager.onError callback is invoked when SQL error occurs
	*/ 
  self.onError = function(tx, error) {
	 console.log("[ERR] DBmanager: "+error.message);
  }
  
  /**
	* DBManager.onSuccess callback is invoked when SQL statement is successfully executed
	*/
  self.onSuccess = function(tx, error) {	 
  }
  
  /**
	* DBManager.createTables function creates database tables (users and scores)
	*/
  self.createTables = function() {
	 self.db.transaction(function(tx) {
		tx.executeSql(self.createUsersStatement, [], self.onSuccess, self.onError);
		tx.executeSql(self.createScoresStatement, [], self.onSuccess, self.onError);		
	 });
  }
  
  /**
	* DBManager.insertUser inserts new user into the users table
	* @param username user name
	*/
  self.insertUser = function(username) {	 
	 self.db.transaction(function(tx) {
	 tx.executeSql(self.insertUserStatement, [username], null, self.onError);
	});
  }
  
  /**
	* DBManager.insertUserUpdateScores inserts new user into the users table and new score result into the scores table.
	* @param username user name
	* @param moves number of moves needed to complete the game
	* @param time time in seconds needed to complete the game
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.insertUserUpdateScores = function(username, moves, time, level, imageUrl) {
	 self.db.transaction(function(tx) {
	 tx.executeSql(self.insertUserStatement, [username], 
		function(tx, resultSet) {
		  if(!resultSet.rowsAffected)  {			 
			 //insert failed			 
			 return false;
		  }
		  else {			 
			 self.insertScores(resultSet.insertId, moves, time, level, imageUrl);	 
			 return true;
		  }
		},
		self.onError);
	});
  }
  
  /**
	* DBManager.insertScores inserts a new score result into the scores table.
	* @param userid id of the user taken from the users table
	* @param moves number of moves needed to complete the game
	* @param time time in seconds needed to complete the game
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.insertScores = function(userid, moves, time, level, imgUrl) {
	 self.db.transaction(function(tx) {
	 tx.executeSql(self.insertScoresStatement, [userid, moves, time, level, imgUrl], null, self.onError);
	});
  }  
  
  
  /**
	* DBManager.pictureFastestResults gets records from the scores table based on the fastest time
	* @param callback function that is invoked when the results are retrieved from the database
	* @param limit limitation on the number of the returned records
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.pictureFastestResults = function(callback, limit, level, imgUrl) {	 
	 if(imgUrl != "") {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectPictureFastestStatement, [imgUrl, level, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset);
			 }) });
	 }
  }
  
  /**
	* DBManager.pictureLessMovesResults gets records from the scores table based on the number of moves
	* @param callback function that is invoked when the results are retrieved from the database
	* @param limit limitation on the number of the returned records
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.pictureLessMovesResults = function(callback, limit, level, imgUrl) {	 
	 if(imgUrl != "") {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectPictureLessMovesStatement, [imgUrl, level, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset);
			 }) });
	 }
  }
  
  /**
	* DBManager.fastestResults gets records from the scores table based on the fastest time
	* @param callback function that is invoked when the results are retrieved from the database
	* @param limit limitation on the number of the returned records
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.fastestResults = function(callback, limit, level, imgUrl) {	 
	 if(imgUrl != "") {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectFastestResultsStatement, [level, imgUrl, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset);
			 }) });
	 }
	 else {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectFastestResultsLbStatement, [level, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset, level);
			 }) });
	 }
  }
  
   /**
	* DBManager.lessMovesResults gets records from the scores table based on the number of moves
	* @param callback function that is invoked when the results are retrieved from the database
	* @param limit limitation on the number of the returned records
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.lessMovesResults = function(callback, limit, level, imgUrl) {	 
	 if(imgUrl != "") {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectLessMovesResultsStatement, [level, imgUrl, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset);
			 }) });
	 }
	 else {
		self.db.transaction(function(tx) {
		  tx.executeSql(self.selectLessMovesResultsLbStatement, [level, limit], function(tx, result) {
			 var dataset = result.rows;
			 callback(dataset, level);
			 }) });
	 }
  }
  
   /**
	* DBManager.saveUserAndResult function is called to save the game result to the database.
	* New user is inserted into the users table if a user with the specified username does not exist in the users table.
	* @param username user name
	* @param moves number of moves needed to complete the game
	* @param time time in seconds needed to complete the game
	* @param level level(difficulty) used to play the game
	* @param imageUrl url to the image that was used in the game
	*/
  self.saveUserAndResult = function(username, moves, time, level, imageUrl) {	 
	 self.db.transaction(function(tx) {
		tx.executeSql(self.selectUserStatement, [username], function(tx, result) {
		  var dataset = result.rows;
		  
		  //such user already exists
		  if(dataset.length > 0)
		  {
			 var userid = dataset.item(0)["_id"];
			 self.insertScores(userid, moves, time, level, imageUrl);	
		  }
		  else
		  {
			 self.insertUserUpdateScores(username, moves, time, level, imageUrl);
		  }		  
	 }) });
  }    
  
  /**
	* DBManager.dropTableUsers deletes the users table
	*/
  self.dropTableUsers = function() {
	 db.transaction(function(tx) {
		tx.executeSql(self.dropUsersStatement, [], null, self.onError);
	 });
  }
  
  /**
	* DBManager.dropTableScores deletes the scores table
	*/
  self.dropTableScores = function() {
	 db.transaction(function(tx) {
		tx.executeSql(self.dropScoresStatement, [], null, self.onError);
	 });
  }
  
  self.createTables();    
}