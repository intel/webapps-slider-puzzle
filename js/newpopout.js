/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * NewPopout class takes care of the new game popout settings and interaction
 * constructor parameters: 
 * @param aLocalizer reference to a localizer object
 */
function NewPopout(aLocalizer) {
  var self = this;
  self.difficulty = 2;
  
  self.localizer = aLocalizer;
  
  self.localize = function() {	 
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		$("#qsNpTitleS").html(self.localizer.getTranslation("new_choose_level"));
		$("#qsPopupScoresTableCellEasyS").html(self.localizer.getTranslation("all_easy"));
		$("#qsPopupScoresTableCellHardS").html(self.localizer.getTranslation("all_hard"));
		$("#qsPopupScoresTableCellBrutalS").html(self.localizer.getTranslation("all_brutal"));
		$("#qsNpPlayAgainS").html(self.localizer.getTranslation("new_play_again"));
		$("#qsNpNewPhotoS").html(self.localizer.getTranslation("new_new_photo"));
	 }
  }  
  self.localize();
  
  self.initAudio = function() {
	 self.clickAudio = new Audio();
	 self.clickAudio.src = "audio/ButtonClick_02_Settings.ogg";	 
  }
  self.initAudio();
  
  self.setDifficulty = function(aDifficulty) {	 
	 if(aDifficulty == 1) {
		$("#qsPopupScoresTableCellEasy").removeClass("qsPopupScoresTableCellEasyNotSelected");
		$("#qsPopupScoresTableCellEasy").addClass("qsPopupScoresTableCellEasySelected");
		$("#qsPopupScoresTableCellHard").removeClass("qsPopupScoresTableCellHardSelected");
		$("#qsPopupScoresTableCellHard").addClass("qsPopupScoresTableCellHardNotSelected");
		$("#qsPopupScoresTableCellBrutal").removeClass("qsPopupScoresTableCellBrutalSelected");
		$("#qsPopupScoresTableCellBrutal").addClass("qsPopupScoresTableCellBrutalNotSelected");
		
		$("#qsDifficultiesTableImgEasy").attr("src","images/new-screen/pointer-right_active.png");
		$("#qsDifficultiesTableImgHard").attr("src","images/new-screen/pointer-right-new.png");
		$("#qsDifficultiesTableImgBrutal").attr("src","images/new-screen/pointer-right-new.png");

		
		self.difficulty = 1;
	 }
	 else if(aDifficulty == 2) {
		$("#qsPopupScoresTableCellEasy").removeClass("qsPopupScoresTableCellEasySelected");
		$("#qsPopupScoresTableCellEasy").addClass("qsPopupScoresTableCellEasyNotSelected");
		$("#qsPopupScoresTableCellHard").removeClass("qsPopupScoresTableCellHardNotSelected");
		$("#qsPopupScoresTableCellHard").addClass("qsPopupScoresTableCellHardSelected");
		$("#qsPopupScoresTableCellBrutal").removeClass("qsPopupScoresTableCellBrutalSelected");
		$("#qsPopupScoresTableCellBrutal").addClass("qsPopupScoresTableCellBrutalNotSelected");
		
		$("#qsDifficultiesTableImgEasy").attr("src","images/new-screen/pointer-right-new.png");
		$("#qsDifficultiesTableImgHard").attr("src","images/new-screen/pointer-right_active.png");
		$("#qsDifficultiesTableImgBrutal").attr("src","images/new-screen/pointer-right-new.png");
		
		self.difficulty = 2;
	 }
	 else {
		$("#qsPopupScoresTableCellEasy").removeClass("qsPopupScoresTableCellEasySelected");
		$("#qsPopupScoresTableCellEasy").addClass("qsPopupScoresTableCellEasyNotSelected");
		$("#qsPopupScoresTableCellHard").removeClass("qsPopupScoresTableCellHardSelected");
		$("#qsPopupScoresTableCellHard").addClass("qsPopupScoresTableCellHardNotSelected");
		$("#qsPopupScoresTableCellBrutal").removeClass("qsPopupScoresTableCellBrutalNotSelected");
		$("#qsPopupScoresTableCellBrutal").addClass("qsPopupScoresTableCellBrutalSelected");
		
		$("#qsDifficultiesTableImgEasy").attr("src","images/new-screen/pointer-right-new.png");
		$("#qsDifficultiesTableImgHard").attr("src","images/new-screen/pointer-right-new.png");
		$("#qsDifficultiesTableImgBrutal").attr("src","images/new-screen/pointer-right_active.png");
		
		self.difficulty = 3;
	 }
  }
  
  self.switchDifficulty = function(aDifficulty) {
	 self.clickAudio.play();
	 self.setDifficulty(aDifficulty);
  }
}
