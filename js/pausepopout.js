/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * PausePopout class takes care of the pause popout creation, setings and interaction
 * constructor parameters:
 * @param aDbManager reference to a database manager object
 * @param aLocalizer reference to a localizer object
 */
function PausePopout(aDbManager, aLocalizer) {
  
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
	* PausePopout.localize() function is used to localize all texts on the PausePopout
	*/
  self.localize = function() {	 
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		$("#qsPpMovesTitleS").html(self.localizer.getTranslation("all_moves")+" ");	 
	 	$("#qsPpTimeTitleS").html(self.localizer.getTranslation("all_time")+" ");
		$("#qsPausedS").html(self.localizer.getTranslation("all_paused"));
		$("#qsPpLeaderBoardS").html(self.localizer.getTranslation("pause_leaderboard"));
	 }
  }  
  self.localize();   
  
  /*
	* PausePopout.localizePhotoCredit() function is used to localize the photo credit string
	*/
  self.localizePhotoCredit = function(aString) {	 		
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		$("#qsPpCreditStrS").html(self.localizer.getTranslation("pause_photo_credit")+" "+aString+", Flickr");
	 }
	 else {
		$("#qsPpCreditStrS").html("Photo Credit: "+aString+", Flickr");
	 }
  } 
  
  
  /*
	* PausePopout.updateScoresMovesCallBack() is a callback that gets invoked after data is retrieved from the database
	*/
  self.updateScoresMovesCallBack = function(aDataset) {	 
	 if(typeof aDataset != "undefined") {
		self.updateScoresUI(aDataset, true);
	 }
  }  
  
  /*
	* PausePopout.updateScoresTimeCallBack() is a callback that gets invoked after data is retrieved from the database
	*/
  self.updateScoresTimeCallBack = function(aDataset) {
	 if(typeof aDataset != "undefined") {
		self.updateScoresUI(aDataset, false);
	 }
  }
  
  /*
	* PausePopout.formatString() is used to format an output string (seconds to time, e.g. 1 to 00:01)
	*/
  self.formatString = function(aMoves, aString) {
	 if(aMoves) {
		return aString;
	 }
	 else {
		return SpUtil.secondsToTime(aString);
	 }
  }
  
   /*
	* PausePopout.updatePpTableCell() is used to update Pausepopout elements with new data (used as a helper function by PausePopout.updateScoresUI())
	*/
  self.updatePpTableCell = function(aMoves, aCellInfo, aElement) {	 
	 if(aElement == null || aCellInfo == null)
		return;  
	 	 
	 aElement.innerHTML = aCellInfo["username"]+": "+self.formatString(aMoves, aCellInfo["score"]);	 
		
	 if(aCellInfo["highlight"] == true) {
		aElement.style.color = "#2bb9ee";
	 }
	 else {
		aElement.style.color = "#000000";
	 }
  }
  
  /*
	* PausePopout.updateScoresUI() is used to update Pausepopout UI with a new data from the database
	*/
  self.updateScoresUI = function(aDataset, aMoves) { 
	 var scoreArr = [];	 
	 var currPlaced = false;
	 var el1 = null;
	 var el2 = null;
	 var el3 = null;	
	 var currIndex = 0;
	 
	 if( aMoves ) {
		el1 = document.getElementById("qsPpMoves1S");
		el2 = document.getElementById("qsPpMoves2S");
		el3 = document.getElementById("qsPpMoves3S");
		currIndex = self._currMoves;
	 }
	 else {
		el1 = document.getElementById("qsPpTime1S");
		el2 = document.getElementById("qsPpTime2S");
		el3 = document.getElementById("qsPpTime3S");
		currIndex = self._currSeconds;
	 }
	 	 
	 for(var i = 0; i < aDataset.length; i++) {	
		var score = 0;
		if(aMoves) {
		  score = aDataset.item(i)["moves"];
		}
		else {		  
		  score = aDataset.item(i)["time"];
		}		
		
		if((typeof aDataset.item(i)["username"] != "undefined") &&
		  (typeof score != "undefined")) {		  
		  
		  if((currIndex < score) && !currPlaced) {
			 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
				scoreArr.push({"username": self.localizer.getTranslation("pause_your_game"), "score": currIndex, "highlight": true});
			 else
				scoreArr.push({"username": "Your Game", "score": currIndex, "highlight": true});			 			 
			 currPlaced = true;
		  }
		 scoreArr.push({"username": aDataset.item(i)["username"], "score": score, "highlight": false});	
		}
	 }
	 
	 if(aDataset.length < self.RECORDS_LIMIT && !currPlaced) {
		if(typeof self.localizer != "undefined" && !self.localizer.noLocalization)
		  scoreArr.push({"username": self.localizer.getTranslation("pause_your_game"), "score": currIndex, "highlight": true});
		else
		  scoreArr.push({"username": "Your Game", "score": currIndex, "highlight": true});
	 }
	 
	 if(scoreArr.length > 0) {		  			
		self.updatePpTableCell( aMoves, scoreArr[0], el1 );		
	 }
	 else {		  		  
		el1.innerHTML = "-----";		  
	 }
	 
	 if(scoreArr.length > 1) {		  		 
		self.updatePpTableCell( aMoves, scoreArr[1], el2 );
	 }
	 else {		  		  
		el2.innerHTML = "-----";		  
	 }
	 
	 if(scoreArr.length > 2) {		  		 
		self.updatePpTableCell( aMoves, scoreArr[2], el3 );
	 }
	 else {		  		  
		el3.innerHTML = "-----";		  
	 }
  }
  
  /**
	* PausePopout.updateScores is used to get new scores data from the database that is needed to update Pausepopout UI
	*/ 
  self.updateScores = function(level, imgUrl, currMoves, currSeconds) {	 
	 self._currMoves = currMoves;
	 self._currSeconds = currSeconds;
	 self.dbManager.lessMovesResults(self.updateScoresMovesCallBack, self.RECORDS_LIMIT, level, imgUrl);
	 self.dbManager.fastestResults(self.updateScoresTimeCallBack, self.RECORDS_LIMIT, level, imgUrl);	 
  } 
}
