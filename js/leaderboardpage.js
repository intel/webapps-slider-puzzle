/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * LeaderBoardPage class takes care of the LeaderBoardPage settings and interaction
 * constructor parameters:
 * @param aDbManager reference to a database manager object
 * @param aLocalizer reference to a localizer object
 */
function LeaderBoardPage(aDbManager, aLocalizer) {  
  var self = this;
  
  self.dbManager = aDbManager;
  self.localizer = aLocalizer;
  
  //returned records limit for the popup
  self.PICTURE_RECORDS_LIMIT = 3;
  //returned records limit for each level of the leaderboard (for each column)
  self.RECORDS_LIMIT = 6;
  
  self.HIGHEST_LEVEL = 3;
  
  // true - moves; false - times.
  self.view = true;
  
  self.imageObjsCounter = 0;
  
  self.currentLevel = 0;
  self.currentImage = "";
  
  self.imagesLoading = false;
  
  self.popUpShown = false;
  
  self.imageObjs = [];
  
  /**
	* LeaderBoardPage.localize() function is used to localize all texts on the LeaderBoardPage
	*/
  self.localize = function() {	 
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		$("#lbTitle").html(self.localizer.getTranslation("leaderboard_leaderboard")+":");	 
	 	$("#lbscoresTableEasyColS").html(self.localizer.getTranslation("all_easy"));
		$("#lbscoresTableHardColS").html(self.localizer.getTranslation("all_hard"));
		$("#lbscoresTableBrutalColS").html(self.localizer.getTranslation("all_brutal"));
		
		$("#lbMovesS").html(self.localizer.getTranslation("all_moves_cap"));
		$("#lbTimesS").html(self.localizer.getTranslation("all_time_cap"));
		
		//popout
		$("#lbPopUpPlayButtonS").html(self.localizer.getTranslation("all_play"));
	 }
  }  
  self.localize();
  
  /**
	* LeaderBoardPage.initAudio() function is used to initialize all the audio files needed for the LeaderBoardPage
	*/
  self.initAudio = function() {
	 self.clickAudio = new Audio();
	 self.clickAudio.src = "audio/ButtonClick_02_Settings.ogg";	 
  }
  self.initAudio();
  
  /**
	* LeaderBoardPage.switchView() function is used to switch between 2 views (scores according to the number of moves and
	* scores according to the time needed to complete the game)
	*/
  self.switchView = function() {
	 if(self.imagesLoading)
		return;
	 
	 //clear canvases
	 for(var i = 0; i < self.RECORDS_LIMIT; i++) {
		var canvas = document.getElementById("tableEasy"+(i+1).toString()+"ContentsCanvas");		  		  
		if(typeof canvas != "undefined") {
		  canvas.width = canvas.width;
		}
	 }
	 for(var i = 0; i < self.RECORDS_LIMIT; i++) {
		var canvas = document.getElementById("tableHard"+(i+1).toString()+"ContentsCanvas");		  		  
		if(typeof canvas != "undefined") {
		  canvas.width = canvas.width;
		}
	 }
	 for(var i = 0; i < self.RECORDS_LIMIT; i++) {
		var canvas = document.getElementById("tableBrutal"+(i+1).toString()+"ContentsCanvas");		  		  
		if(typeof canvas != "undefined") {
		  canvas.width = canvas.width;
		}
	 }	 
	 
	 if(!self.view) {
		self.updateScores();
		$("#lbMoves").css("background-color", "#252525");
		$("#lbTimes").css("background-color", "#b7b7b7");
	 }
	 else {		
		self.updateScoresTime();
		$("#lbMoves").css("background-color", "#b7b7b7");
		$("#lbTimes").css("background-color", "#252525");
	 }	 
	 self.view = !self.view;
  }
  
  /**
	* LeaderBoardPage.drawImage() function is used to draw an image on the canvas (inside the scores table)
	*/
  self.drawImage = function() {
	 if(typeof self.imageObjs[self.imageObjsCounter] != "undefined" && self.imageObjsCounter < self.imageObjs.length && self.imageObjs[self.imageObjsCounter]["image"] != null) {
		self.imageObjs[self.imageObjsCounter]["image"].onload = function() {
		  var canvas = document.getElementById(self.imageObjs[self.imageObjsCounter]["canvasId"]);		  
		  
		  if(typeof canvas != "undefined" && self.imageObjs[self.imageObjsCounter]["image"] != null) {
			 self.imageObjs[self.imageObjsCounter]["image"].style.width = canvas.width;
			 self.imageObjs[self.imageObjsCounter]["image"].style.height = canvas.height;
			 
			 var context = canvas.getContext("2d");
			 context.drawImage(self.imageObjs[self.imageObjsCounter]["image"], 0, 0, canvas.width, canvas.height);		  		  		  		  
			 self.imageObjs[self.imageObjsCounter]["image"] = null;
			 self.imageObjsCounter++;		  
			 self.drawImage();
		  }
		}
		
		self.imageObjs[self.imageObjsCounter]["image"].src = self.imageObjs[self.imageObjsCounter]["imgUrl"];
	 }
	 //loading of images has finished
	 else {
		self.imagesLoading = false;
	 }
  }
  
  /**
	* LeaderBoardPage.drawImages() function is used to draw all images on the canvases (inside the scores table)
	*/
  self.drawImages = function() {
	 self.imagesLoading = true;
	 self.imageObjsCounter = 0;
	 self.drawImage();
  }   
   
  /**
	* LeaderBoardPage.updateScoresMovesCallBack() callback gets invoked by the database manager after it retrieves the scores based
	* on the moves from the database
	* @param aDataset dataset returned by the database manager
	* @param aLevel dataset is returned for this level (can be 1 - easy, 2 - hard or 3 - brutal)
	*/
  self.updateScoresMovesCallBack = function(aDataset, aLevel) {	 
	 self.updateLeaderBoardUI(aLevel, aDataset, true);	 
  } 

  /**
	* LeaderBoardPage.updateScoresTimeCallBack() callback gets invoked by the database manager after it retrieves the scores based
	* on the time from the database
	* @param aDataset dataset returned by the database manager
	* @param aLevel dataset is returned for this level (can be 1 - easy, 2 - hard or 3 - brutal)
	*/
  self.updateScoresTimeCallBack = function(aDataset, aLevel) {	 
	 self.updateLeaderBoardUI(aLevel, aDataset, false);
  }
  
  
  self.updateLeaderBoardUI = function(aLevel, aDataset, aMovesView) {
	 var levelString = "tableEasy";
	 switch(aLevel) {
		case 1:
		  levelString = "tableEasy";
		  break;
		case 2:
		  levelString = "tableHard";
		  break;
		default:
		  levelString = "tableBrutal";
		  break;
	 }	
		
	 for(var i = 0; i < aDataset.length; i++) {
		if(aMovesView && typeof aDataset.item(i)["moves"] == "undefined") {
		  return;
		}		
		if(!aMovesView && typeof aDataset.item(i)["time"] == "undefined") {
		  return;
		}	
		
		var spanEl = document.getElementById(levelString+(i+1).toString()+"ContentsText");
		var divEl = document.getElementById(levelString+(i+1).toString()+"Contents");
	 
		if(typeof spanEl != "undefined") {
		  if(aMovesView)
			 spanEl.innerHTML = aDataset.item(i)["username"]+": "+aDataset.item(i)["moves"];
		  else
			 spanEl.innerHTML = aDataset.item(i)["username"]+": "+SpUtil.secondsToTime(aDataset.item(i)["time"]);
		}				
		
		var image = new Image();
		self.imageObjs.push({"image": image, "imgUrl": aDataset.item(i)["img_url"], "canvasId": levelString+(i+1).toString()+"ContentsCanvas"});		
	 
		$(divEl).bind("click", { imgPath: aDataset.item(i)["img_url"], level: aLevel },  self.showPopUp );
					
	 }
	 
	 if(aDataset.length < self.RECORDS_LIMIT) {
		for(var i = aDataset.length; i < self.RECORDS_LIMIT;i++) {		  
		  var spanEl = document.getElementById(levelString+(i+1).toString()+"ContentsText");
		
		  if(typeof spanEl != "undefined") {
			 spanEl.innerHTML = "-----";
		  }
		}
	 }
	 
	 if(aLevel == self.HIGHEST_LEVEL) {
		self.drawImages();
	 }
  }
  
  /**
	* LeaderBoardPage.pictureLessMovesCallback() callback gets invoked by the database manager after it retrieves the scores based
	* on the moves from the database (this function is used for the popup)
	* @param aDataset dataset returned by the database manager
	*/
  self.pictureLessMovesCallback = function(aDataset) {	 
	 self.updateLeaderBoardPopupUI(aDataset, true);
  }
  
  /**
	* LeaderBoardPage.pictureFastestCallback() callback gets invoked by the database manager after it retrieves the scores based
	* on the time from the database (this function is used for the popup)
	* @param aDataset dataset returned by the database manager
	*/
  self.pictureFastestCallback = function(aDataset) {
	 self.updateLeaderBoardPopupUI(aDataset, false);
  }
  
  self.updateLeaderBoardPopupUI = function(aDataset, aMovesView) {	 
	 for(var i = 0; i < aDataset.length; i++) {
		if(aMovesView && typeof aDataset.item(i)["moves"] == "undefined") {
			 return;
		}		
		if(!aMovesView && typeof aDataset.item(i)["time"] == "undefined") {
		  return;
		}
		
		if((typeof aDataset.item(i)["username"] != "undefined")) {	  
		  var spanEl = document.getElementById("lbPopupScoresTableRowRecords"+(i+1).toString()+"S");
		  
		  if(typeof spanEl != "undefined" && spanEl != null) {
			 if(aMovesView)
				spanEl.innerHTML = aDataset.item(i)["username"]+": "+aDataset.item(i)["moves"];
			 else
				spanEl.innerHTML = aDataset.item(i)["username"]+": "+SpUtil.secondsToTime(aDataset.item(i)["time"]);
		  }		  
		}
	 }
	 
	 if(aDataset.length < self.PICTURE_RECORDS_LIMIT) {
		for(var i = aDataset.length; i < self.RECORDS_LIMIT; i++) {
		  var spanEl = document.getElementById("lbPopupScoresTableRowRecords"+(i+1).toString()+"S");
		
		  if(typeof spanEl != "undefined" && spanEl != null) {
			 spanEl.innerHTML = "-----";
		  }
		}
	 }	 
  }
  
  /**
	* LeaderBoardPage.showPopUp() callback gets invoked when any of the leaderboard cells is clicked.
	*/
  self.showPopUp = function(event) {	 	 	 
	 $("#lbPopUpImage").css("background-image", "url('"+ event.data.imgPath +"')");	 
	 if(event.data.level == 1) {
		if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {	
		  $("#lbPopUpLevelText").html(self.localizer.getTranslation("all_level")+": "+self.localizer.getTranslation("all_easy"));
		}
		else {
		  $("#lbPopUpLevelText").html("LEVEL: EASY");
		}
	 }
	 else if(event.data.level == 2) {
		if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {	
		  $("#lbPopUpLevelText").html(self.localizer.getTranslation("all_level")+": "+self.localizer.getTranslation("all_hard"));
		}
		else {
		  $("#lbPopUpLevelText").html("LEVEL: HARD");
		}
	 }
	 else if(event.data.level == 3) {
		if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {	
		  $("#lbPopUpLevelText").html(self.localizer.getTranslation("all_level")+": "+self.localizer.getTranslation("all_brutal"));
		}
		else {
		  $("#lbPopUpLevelText").html("LEVEL: BRUTAL");
		}
	 }	 
	 
	 self.currentLevel = event.data.level;
	 self.currentImage = event.data.imgPath;
	 
	 if(self.view) {
		self.dbManager.lessMovesResults(self.pictureLessMovesCallback, self.PICTURE_RECORDS_LIMIT, event.data.level, event.data.imgPath);	 
	 }
	 else {
		self.dbManager.fastestResults(self.pictureFastestCallback, self.PICTURE_RECORDS_LIMIT, event.data.level, event.data.imgPath);	
	 }
	 
	 $("#lbPopUpBase").css("visibility", "visible");	  
	 self.popUpShown = true;
  }
  
  /**
	* LeaderBoardPage.closePopUp() function closes the popup
	*/
  self.closePopUp = function(event) {
	 $("#lbPopUpBase").css("visibility", "hidden");	  
	 self.popUpShown = false;
  }
  
  /**
	* LeaderBoardPage.setInvisible() function makes leaderboard page invisible
	*/
  self.setInvisible = function() {	 	 	 
	 $("#lbPopUpBase").css("visibility", "hidden");	 
	 $("#leaderboardPage").css("visibility", "hidden");
  }
 
  /**
	* LeaderBoardPage.updateScores() function is called before showing the score table. The score data based on moves is retrieved from the database
	* and LeaderBoardPage.updateScoresMovesCallBack() callback is called
	*/
  self.updateScores = function() {
	 self.imageObjs = [];
	 //level 1
	 self.dbManager.lessMovesResults(self.updateScoresMovesCallBack, self.RECORDS_LIMIT, 1, "");	 
	 //level 2
	 self.dbManager.lessMovesResults(self.updateScoresMovesCallBack, self.RECORDS_LIMIT, 2, "");	 	 
	 //level 3
	 self.dbManager.lessMovesResults(self.updateScoresMovesCallBack, self.RECORDS_LIMIT, 3, "");	 
  } 
  
  /**
  * LeaderBoardPage.updateScoresTime() function is called before showing the score table. The score data based on time is retrieved from the database
  * and LeaderBoardPage.updateScoresTimeCallBack() callback is called
  */
  self.updateScoresTime = function() {
	 self.imageObjs = [];
	 //level 1
	 self.dbManager.fastestResults(self.updateScoresTimeCallBack, self.RECORDS_LIMIT, 1, "");	 
	 //level 2
	 self.dbManager.fastestResults(self.updateScoresTimeCallBack, self.RECORDS_LIMIT, 2, "");	 	 
	 //level 3
	 self.dbManager.fastestResults(self.updateScoresTimeCallBack, self.RECORDS_LIMIT, 3, "");	 
  } 
}
