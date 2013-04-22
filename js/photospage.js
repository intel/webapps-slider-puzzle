/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * Photo class represents a photo in the game
 */
function Photo( portrait, imgUrl, credit ) {
  var self = this;
  self.portrait = portrait;
  self.imgUrl = imgUrl;
  self.credit = credit;
}

var thumbnailScroll;

/**
 * PhotosPage class takes care of the LeaderBoardPage settings and interaction
 * constructor parameters:
 * @param aLocalizer reference to a localizer object
 */
function PhotosPage( aLocalizer ) {

  var LANDSCAPE_WIDTH = 173;
  var LANDSCAPE_HEIGHT = 153;
  var PORTRAIT_WIDTH = 120;
  var PORTRAIT_HEIGHT = 173;
  var PHOTOS_PADDING = 15;
  var PHOTO_PADDING = 5;
  var PHOTOS_MAXCOLS = 5;

  var self = this;

  // true - from game; false - from pc.
  self.view = true;

  self.popUpShown = false;
  self.photos = [];
  //fixed list. TODO: implement dynamic photos loading from the images/puzzle_photos directory
  self.photos.push(new Photo(false, "images/puzzle_photos/mccun934-pumpkin-patch.jpg", "Mike McCune"));
  self.photos.push(new Photo(false, "images/puzzle_photos/StuSeeger-elephant-mother-child.jpg", "Stuart Seeger"));
  self.photos.push(new Photo(false, "images/puzzle_photos/ktylerconk-water-lily.jpg", "Kathleen Tyler Conklin"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ian_Sane-zoo-lion.jpg", "Ian Sane"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ian_Sane-railroad-bridge.jpg", "Ian Sane"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ian_Sane-forest-waterfall.jpg", "Ian Sane"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ian_Sane-brick-wall.jpg", "Ian Sane"));
  self.photos.push(new Photo(false, "images/puzzle_photos/mccun934-leaf-water.jpg", "Mike McCune"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ian_Sane-red-wall.jpg", "Ian Sane"));
  self.photos.push(new Photo(false, "images/puzzle_photos/kennymatic-rocky-beach.jpg", "Kenny Louie"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Ralphman-train-station.jpg", "Ralphman"));
  self.photos.push(new Photo(false, "images/puzzle_photos/JonoMueller-dirty-truck.jpg", "Jonathan Mueller"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Mason_Masteka-purple-carrots.jpg", "Mason Masteka"));
  self.photos.push(new Photo(false, "images/puzzle_photos/StuSeeger-fair-ride.jpg", "Stuart Seeger"));
  self.photos.push(new Photo(false, "images/puzzle_photos/pdxjeff-ferris-wheel.jpg", "Jeff Muceus"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Sideonecincy-bald-eagle.jpg", "Chris Miller"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Thomas_Good-zoo-tiger.jpg", "Tom Good"));
  self.photos.push(new Photo(false, "images/puzzle_photos/sam_churchill-daylight-train.jpg", "Sam Churchill"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Puerto_Rico_Vega_Baja_by_Ricardo_Mangual.jpg", "Ricardo Mangual"));
  self.photos.push(new Photo(false, "images/puzzle_photos/Tso_Moriri_Lake_by_Probhu_B_Doss.jpg", "Prabhu B Doss"));

  self.thumbs = [];
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/mccun934-pumpkin-patch.jpg", "Mike McCune"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/StuSeeger-elephant-mother-child.jpg", "Stuart Seeger"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/ktylerconk-water-lily.jpg", "Kathleen Tyler Conklin"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ian_Sane-zoo-lion.jpg", "Ian Sane"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ian_Sane-railroad-bridge.jpg", "Ian Sane"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ian_Sane-forest-waterfall.jpg", "Ian Sane"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ian_Sane-brick-wall.jpg", "Ian Sane"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/mccun934-leaf-water.jpg", "Mike McCune"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ian_Sane-red-wall.jpg", "Ian Sane"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/kennymatic-rocky-beach.jpg", "Kenny Louie"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Ralphman-train-station.jpg", "Ralphman"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/JonoMueller-dirty-truck.jpg", "Jonathan Mueller"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Mason_Masteka-purple-carrots.jpg", "Mason Masteka"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/StuSeeger-fair-ride.jpg", "Stuart Seeger"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/pdxjeff-ferris-wheel.jpg", "Jeff Muceus"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Sideonecincy-bald-eagle.jpg", "Chris Miller"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Thomas_Good-zoo-tiger.jpg", "Tom Good"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/sam_churchill-daylight-train.jpg", "Sam Churchill"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Puerto_Rico_Vega_Baja_by_Ricardo_Mangual.jpg", "Ricardo Mangual"));
  self.thumbs.push(new Photo(false, "images/puzzle_photos_thumbs/Tso_Moriri_Lake_by_Probhu_B_Doss.jpg", "Prabhu B Doss"));

  self.tiles = [];
  self.tilesCounter = 0;

  self.selectedPhotoUrl = "";
  self.selectedPhotoCredit = "";

  self.localizer = aLocalizer;

  /*
	* PhotosPage.localize() function is used to localize all texts on the PhotosPage
	*/
  self.localize = function() {
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {
		$("#ppHeader").html(self.localizer.getTranslation("photos_photos")+":");
		$("#ppGameS").html(self.localizer.getTranslation("photos_fromgame"));
		$("#ppPCS").html(self.localizer.getTranslation("photos_frompc"));

		//popout
		$("#ppPopUpPlayButtonS").html(self.localizer.getTranslation("all_play"));
	 }
  }
  self.localize();

  /**
	* PhotosPage.initAudio() function is used to initialize all the audio files needed for the PhotosPage
	*/
  self.initAudio = function() {
	 self.clickAudio = new Audio();
	 self.clickAudio.src = "audio/ButtonClick_02_Settings.ogg";
  }
  self.initAudio();

  /**
	* PhotosPage.switchView() function is used to switch between 2 views (photos that come with a game and user's photos from the PC)
	*/
  self.switchView = function() {

	 if(!self.view) {
		$("#ppGame").css("background-color", "#252525");
		$("#ppPC").css("background-color", "#b7b7b7");
	 }
	 else {
		$("#ppPC").css("background-color", "#252525");
		$("#ppGame").css("background-color", "#b7b7b7");
	 }
	 self.view = !self.view
  }

  /**
	* PhotosPage.createScrollBar() function creates a scrollbar that will be used to scroll the photo gallery
	* if it does not fit to the screen
	*/
  self.createScrollBar = function() {
	 self.scroller = new SpScroller(document.getElementById("ppContent"), 1024, 540);
	 self.scrollbar = new SpScrollBar(document.getElementById("ppScrollbarContainer"), self.scroller, false);
  }


  /**
	* PhotosPage.createDivs() function creates divs and canvases for each photo
	*/
  self.createDivs = function() {

	 //photos container
	 self.container = document.getElementById("ppContent");

	 for(var i = 0, j = 0; i < self.photos.length; i++) {
		  var o = new Object();
		  o.tile = document.createElement('div');
		  $(o.tile).css('position', 'absolute');		  ;
		  $(o.tile).css('padding', PHOTO_PADDING+'px');
		  $(o.tile).css('width', 'auto');
		  $(o.tile).css('box-shadow', '0px 0px 4px #252525');

		  o.canvas = document.createElement('canvas');
		  o.context = o.canvas.getContext('2d');

		  o.size = function(width, height) {
				o.canvas.setAttribute('width', width);
				o.canvas.setAttribute('height', height);
		  }

		  if(self.photos[i].portrait)
		  {
			 o.size(PORTRAIT_WIDTH+"px", PORTRAIT_HEIGHT+"px");
			 $(o.tile).css('height', PORTRAIT_HEIGHT+"px");
		  }
		  else
		  {
			 o.size(LANDSCAPE_WIDTH+"px", LANDSCAPE_HEIGHT+"px");
			 $(o.tile).css('height', LANDSCAPE_HEIGHT+"px");
		  }

		  if(i % PHOTOS_MAXCOLS == 0 && i != 0)
            j++;

		  o.tile.appendChild(o.canvas);

		  $(o.tile).css("left", (i%PHOTOS_MAXCOLS)*LANDSCAPE_WIDTH + (i%PHOTOS_MAXCOLS + 1)*PHOTOS_PADDING);
		  $(o.tile).css("top", j*PORTRAIT_HEIGHT + (j + 1)*PHOTOS_PADDING);

		  $(o.tile).bind("click", { imgPath: self.photos[i].imgUrl, isPortrait: self.photos[i].portrait, creditAuth: self.photos[i].credit },  self.showPopUp );

		  self.container.appendChild(o.tile);
		  self.tiles.push(o);
		  self.thumbs[i].image = new Image(o.canvas.width, o.canvas.height);
	 }

	 $(self.container).height(Math.floor(self.photos.length / PHOTOS_MAXCOLS) * PORTRAIT_HEIGHT + (Math.floor(self.photos.length / PHOTOS_MAXCOLS) + 1) * PHOTOS_PADDING);
  }

    /**
	* PhotosPage.drawImage() function draws a photo on a corresponding canvas. It was made recursive deliberately so that images are
	* drawn one by one in a sequence. In this case the UI is not getting stuck.
    */
  self.drawImage = function() {
      if (self.thumbs[self.tilesCounter] !== undefined) {
          self.thumbs[self.tilesCounter].image.onload = function () {
		  self.thumbs[self.tilesCounter].image.style.width = self.tiles[self.tilesCounter].canvas.width;
		  self.thumbs[self.tilesCounter].image.style.height = self.tiles[self.tilesCounter].canvas.height;
		  self.tiles[self.tilesCounter].context.drawImage(self.thumbs[self.tilesCounter].image, 0, 0, self.tiles[self.tilesCounter].canvas.width, self.tiles[self.tilesCounter].canvas.height);
		  self.thumbs[self.tilesCounter].image = null;
		  self.tilesCounter++;
		  self.drawImage();
		}
          self.thumbs[self.tilesCounter].image.src = self.thumbs[self.tilesCounter].imgUrl;

	 }
	 //loading of images has finished
	 else {
		$("#ppLoading").css("visibility", "hidden");
		$("#ppBlockInteraction").css("visibility", "hidden");
		if (thumbnailScroll)
		    thumbnailScroll.destroy();

		thumbnailScroll = null;
		thumbnailScroll = new iScroll('photosWrapper', { hScrollbar: false, vScrollbar: false });
		setTimeout(function () {
		    console.log("photosWrapper - refresh")
		    thumbnailScroll.refresh();
		}, 1000);
	 }
  }

    /**
	* PhotosPage.drawImages() invokes a process of drawing each photo on the corresponding canvas.
	*/
  self.drawImages = function () {
	 //loading of images has started
	 $("#ppLoading").css("visibility", "visible");
	 $("#ppBlockInteraction").css("visibility", "visible");
	 self.tilesCounter = 0;
	 self.drawImage();

  }

  /**
	* PhotosPage.showPopUp() callback gets invoked when any of the photos is clicked.
	*/
  self.showPopUp = function(event) {
	 self.selectedPhotoUrl = event.data.imgPath;
	 self.selectedPhotoCredit = event.data.creditAuth;

	 if(!event.data.isPortrait) {
		$("#ppPopUp").css("width", "400px");
		$("#ppPopUp").css("height", "420px");
		$("#ppPopUpCloseButton").css("top", "-22px");
		$("#ppPopUpCloseButton").css("left", "385px");

		//image settings
		$("#ppPopUpImage").css("top", "10px");
		$("#ppPopUpImage").css("left", "10px");
		$("#ppPopUpImage").css("width", "380px");
		$("#ppPopUpImage").css("height", "300px");
		$("#ppPopUpImage").css("background-image", "url('"+ event.data.imgPath +"')");

		$("#ppPopUpPlayButton").css("top", "10px");
		var playBtnLeft = ($("#ppPopUp").width() - $("#ppPopUpPlayButton").width()) /2;
		$("#ppPopUpPlayButton").css("left", playBtnLeft+"px");
		var playBtnTop = $("#ppPopUpImage").height() + $("#ppPopUpImage").position().top + 10;
		$("#ppPopUpPlayButton").css("top", playBtnTop+"px");

	 }
	 $("#ppPopUpBase").css("visibility", "visible");
	 self.popUpShown = true;
  }

  /**
	* PhotosPage.closePopUp() function closes the popup
	*/
  self.closePopUp = function(event) {
	 $("#ppPopUpBase").css("visibility", "hidden");
	 self.popUpShown = false;
  }

  /**
	* PhotosPage.initializePage function initializes the PhotosPage by creating the divs, canvases and drawing photos/images
	*/
  self.initializePage = function() {
	 self.createDivs();
	 self.drawImages();
	 setTimeout(function () {
	 	thumbnailScroll = new iScroll('photosWrapper', { hScrollbar: false, vScrollbar: false });
	 }, 0);
  }

  /**
	* PhotosPage.setInvisible() function makes PhotosPage invisible
	*/
  self.setInvisible = function() {
	 $("#ppLoading").css("visibility", "hidden");
	 $("#ppBlockInteraction").css("visibility", "hidden");
	 $("#ppPopUpBase").css("visibility", "hidden");
	 $("#ppPopUpBase").css("visibility", "hidden");
	 $("#photosPage").css("visibility", "hidden");
  }
}
