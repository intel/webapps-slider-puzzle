/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * PuzzlePauseFullImage class takes care of the displaying full image when the game is paused
 * constructor parameters
 * @param aImageUrl url of the currently selected image (image that is currently used in the game)
 */
function PuzzlePauseFullImage(aImageUrl) {
  var self = this;
  self.img = new Image();  
  
  
  self.parent = document.getElementById("puzzlePauseFullImage");
  self.width = $("#puzzlePauseFullImage").width();
  self.height = $("#puzzlePauseFullImage").height();
  
  self.imageUrl = aImageUrl;
  self.release = function() {
		while (self.parent.children.length > 0)
		  self.parent.removeChild(self.parent.lastChild);
		self.tile = null;
	}
  self.release();
  
  var o = new Object();
  o.tile = document.createElement('div');
  $(o.tile).css('position', 'absolute');
  
  o.canvas = document.createElement('canvas');
  o.context = o.canvas.getContext('2d');

  o.size = function(width, height) {
	 o.canvas.setAttribute('width', width);
	 o.canvas.setAttribute('height', height);
  }
  o.size(self.width, self.height);
  
  o.tile.container = o;
  o.tile.dragging = false;		
  o.tile.appendChild(o.canvas);		
  
  o.parent = self.parent;
  $(o.tile).css('left', self.parent.offsetLeft);
  $(o.tile).css('top', self.parent.offsetTop);							
  
  
  self.parent.appendChild(o.tile);
  self.tile = o;
   
	
	self.img.onload = function() {
		var scaledWidth, scaledHeight;
		scaledWidth = self.width;
		scaledHeight = self.height;
		
		self.tile.context.drawImage(this, 0, 0, self.tile.canvas.width, self.tile.canvas.height);						
	}
	
	self.img.src = self.imageUrl;
}
