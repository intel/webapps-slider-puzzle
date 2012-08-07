/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * FinishPopout class takes care of the finish popout settings and interaction
 * constructor parameters:
 * @param aDbManager reference to a database manager object
 * @param aLocalizer reference to a localizer object
 */
function FinishPopout(aDbManager, aLocalizer) {
  
  var self = this;
  self.dbManager = aDbManager;
  self.localizer = aLocalizer;
  
  self.RECORDS_LIMIT = 3;
  self._currMoves;
  self._currSeconds;
  self._scoreMovesArr = [];
  self._scoreSecondsArr = [];
  self._currMovesPlaced = false;
  self._currSecondsPlaced = false;
  
  /*
   * FinishPopout.localize() function is used to localize all texts on the PhotosPage
   */
  self.localize = function() {	 
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		$("#qsFpMovesTitleS").html(self.localizer.getTranslation("all_moves")+" ");	 
	 	$("#qsFpTimeTitleS").html(self.localizer.getTranslation("all_time")+" ");
		$("#qsFinishS").html(self.localizer.getTranslation("finish_finish"));
		$("#qsFpSaveResultS").html(self.localizer.getTranslation("finish_save"));
	 }
  }  
  self.localize();
  
  
  /**
	* FinishPopout.updateScoresMovesCallBack() callback gets invoked by the database manager after it retrieves the scores based
	* on the moves from the database
	* @param aDataset dataset returned by the database manager
	*/
  self.updateScoresMovesCallBack = function(aDataset) {	 
	 if(typeof aDataset != "undefined") {
		
		var moves1El = document.getElementById("qsFpMoves1S");
		var moves2El = document.getElementById("qsFpMoves2S");
		var moves3El = document.getElementById("qsFpMoves3S");
		
		self._scoreMovesArr = [];
		//current game result was placed
		self._currMovesPlaced = false;
						
		for(var i = 0; i < aDataset.length; i++) {
		  if((typeof aDataset.item(i)["username"] != "undefined") &&
			 (typeof aDataset.item(i)["moves"] != "undefined")) {	  
			 
			if((self._currMoves < aDataset.item(i)["moves"]) && !self._currMovesPlaced) {
			 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
				self._scoreMovesArr.push({"username": self.localizer.getTranslation("finish_your_game"), "moves": self._currMoves, "highlight": true});
			 else
				self._scoreMovesArr.push({"username": "Your Game", "moves": self._currMoves, "highlight": true});				  			  		 
			 self._currMovesPlaced = true;
			}
			self._scoreMovesArr.push({"username": aDataset.item(i)["username"], "moves": aDataset.item(i)["moves"], "highlight": false});					
		  }
		}
		
		if(aDataset.length < self.RECORDS_LIMIT && !self._currMovesPlaced) {
		  if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
			 self._scoreMovesArr.push({"username": self.localizer.getTranslation("finish_your_game"), "moves": self._currMoves, "highlight": true});
		  else
			 self._scoreMovesArr.push({"username": "Your Game", "moves": self._currMoves, "highlight": true})
		}
				
		if(self._scoreMovesArr.length > 0) {		  		 
		  moves1El.innerHTML = self._scoreMovesArr[0]["username"]+": "+self._scoreMovesArr[0]["moves"];
		  
		  if(self._scoreMovesArr[0]["highlight"] == true) {
			 moves1El.style.color = "#2bb9ee";
		  }
		  else {
			 moves1El.style.color = "#000000";
		  }
		}
		else {		  		  
		  moves1El.innerHTML = "-----";		  
		}
		
		if(self._scoreMovesArr.length > 1) {		  		 
		  moves2El.innerHTML = self._scoreMovesArr[1]["username"]+": "+self._scoreMovesArr[1]["moves"];
		  
		  if(self._scoreMovesArr[1]["highlight"] == true) {
			 moves2El.style.color = "#2bb9ee";
		  }
		  else {
			 moves2El.style.color = "#000000";
		  }
		}
		else {		  		  
		  moves2El.innerHTML = "-----";		  
		}
		
		if(self._scoreMovesArr.length > 2) {		  		 
		  moves3El.innerHTML = self._scoreMovesArr[2]["username"]+": "+self._scoreMovesArr[2]["moves"];
		  
		  if(self._scoreMovesArr[2]["highlight"] == true) {
			 moves3El.style.color = "#2bb9ee";
		  }
		  else {
			 moves3El.style.color = "#000000";
		  }
		}
		else {		  		  
		  moves3El.innerHTML = "-----";		  
		}		
	 }
  }
  
  
  /**
	* FinishPopout.updateScoresTimeCallBack() callback gets invoked by the database manager after it retrieves the scores based
	* on the time from the database
	* @param aDataset dataset returned by the database manager
	*/
  self.updateScoresTimeCallBack = function(aDataset) {
	 if(typeof aDataset != "undefined") {
		
		var time1El = document.getElementById("qsFpTime1S");
		var time2El = document.getElementById("qsFpTime2S");
		var time3El = document.getElementById("qsFpTime3S");
		
		self._scoreSecondsArr = [];
		//current game result was placed
		self._currSecondsPlaced = false;
				
		for(var i = 0; i < aDataset.length; i++) {
		  if((typeof aDataset.item(i)["username"] != "undefined") &&
			 (typeof aDataset.item(i)["time"] != "undefined")) {
			 
			if((self._currSeconds < aDataset.item(i)["time"]) && !self._currSecondsPlaced) {
				if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
				  self._scoreMovesArr.push({"username": self.localizer.getTranslation("finish_your_game"), "moves": self._currMoves, "highlight": true});
				else
				  self._scoreMovesArr.push({"username": "Your Game", "moves": self._currMoves, "highlight": true})			 
				self._currSecondsPlaced = true;
			}
			self._scoreSecondsArr.push({"username": aDataset.item(i)["username"], "time": aDataset.item(i)["time"], "highlight": false});					
		  }
		}
		
		if(aDataset.length < self.RECORDS_LIMIT && !self._currSecondsPlaced) {
		  if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
			 self._scoreMovesArr.push({"username": self.localizer.getTranslation("finish_your_game"), "moves": self._currMoves, "highlight": true});
		  else
			 self._scoreMovesArr.push({"username": "Your Game", "moves": self._currMoves, "highlight": true})
		}
				
		if(self._scoreSecondsArr.length > 0) {		  		 
		  time1El.innerHTML = self._scoreSecondsArr[0]["username"]+": "+SpUtil.secondsToTime(self._scoreSecondsArr[0]["time"]);	  
		  
		  if(self._scoreSecondsArr[0]["highlight"] == true) {
			 time1El.style.color = "#2bb9ee";
		  }
		  else {
			 time1El.style.color = "#000000";
		  }
		}
		else {		  		  
		  time1El.innerHTML = "-----";		  
		}
		
		if(self._scoreSecondsArr.length > 1) {		  		 
		  time2El.innerHTML = self._scoreSecondsArr[1]["username"]+": "+SpUtil.secondsToTime(self._scoreSecondsArr[1]["time"]);
		  
		  if(self._scoreSecondsArr[1]["highlight"] == true) {
			 time2El.style.color = "#2bb9ee";
		  }
		  else {
			 time2El.style.color = "#000000";
		  }
		}
		else {		  		  
		  time2El.innerHTML = "-----";		  
		}
		
		if(self._scoreSecondsArr.length > 2) {		  		 
		  time3El.innerHTML = self._scoreSecondsArr[2]["username"]+": "+SpUtil.secondsToTime(self._scoreSecondsArr[2]["time"]);
		  
		  if(self._scoreSecondsArr[2]["highlight"] == true) {
			 time3El.style.color = "#2bb9ee";
		  }
		  else {
			 time3El.style.color = "#000000";
		  }
		}
		else {		  		  
		  time3El.innerHTML = "-----";		  
		}		
	 }
  }
  
  /**
	* FinishPopout.updateScores() function is called before showing the score table. The score data based on moves and time is retrieved from the database.
	*/
  self.updateScores = function(level, imgUrl, currMoves, currSeconds) {
	 self._currMoves = currMoves;
	 self._currSeconds = currSeconds;
	 self.dbManager.lessMovesResults(self.updateScoresMovesCallBack, self.RECORDS_LIMIT, level, imgUrl);
	 self.dbManager.fastestResults(self.updateScoresTimeCallBack, self.RECORDS_LIMIT, level, imgUrl);	 
  } 
}
