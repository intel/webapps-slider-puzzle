/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * PauseBackground class takes care of the active game background creation ("pause" tiles)
 * constructor parameters:
 * @param level integer game level (1 - easy; 2 - hard; 3 - brutal) 
 * @param aLocalizer reference to a localizer object
 */
function PauseBackground( level, aLocalizer )
{
  var self = this;
    
  self.rows = level * 2;
  self.columns = level * 2;
    
  self.level = level;       
  self.img = new Image();
  self.parent = document.getElementById("puzzlePauseBackground");
  self.width = $("#puzzlePauseBackground").width();
  self.height = $("#puzzlePauseBackground").height();
  self.imageUrl = "images/photo-screen/popup-top-shadow.png";
  
  self.localizer = aLocalizer;
  self.localizedString = "";
  
  self.localize = function() {	 
	 if(typeof self.localizer != "undefined" && !self.localizer.noLocalization) {		
		self.localizedString = self.localizer.getTranslation("all_pause");
	 }
	 else {
		self.localizedString = "PAUSE";
	 }
  }  
  self.localize();
  
  
  self.release = function() {
		while (self.parent.children.length > 0)
		  self.parent.removeChild(self.parent.lastChild);
		self.tiles = new Array();
	}
	
  self.tiles = null;
  self.release();
	  
  for (var r = 0; r < self.rows; r++) {
		self.tiles.push(new Array());
		
		for (var c = 0; c < self.columns; c++) {
						
			var o = new Object();
			o.tile = document.createElement('div');
			$(o.tile).css('position', 'absolute');
			
			o.canvas = document.createElement('canvas');
			o.context = o.canvas.getContext('2d');

			o.size = function(width, height) {
				o.canvas.setAttribute('width', width);
				o.canvas.setAttribute('height', height);
			}
			o.size(self.width/self.columns, self.height/self.rows);
			
			o.tile.container = o;
			o.tile.dragging = false;		
			o.tile.appendChild(o.canvas);		
			
			o.parent = self.parent;
			o.move = function (row, column) {
				this.row = row;
				this.column = column;
				
				$(this.tile).css('left', this.column * this.canvas.width);
				$(this.tile).css('top', this.row * this.canvas.height);							
			}
			o.move(r, c);		
			
			self.parent.insertBefore(o.tile, self.parent.firstChild);
			self.tiles[r].push(o);
		}
	}
	
	self.drawBg = function(aHover) {
	   var scaledWidth, scaledHeight;
		scaledWidth = self.width;
		scaledHeight = self.height;

		for (var r = 0; r < self.tiles.length; r++) {
			for (var c = 0; c < self.tiles[r].length; c++) {
				var tile = self.tiles[r][c];				
				tile.context.drawImage(self.img, 0, 0, tile.canvas.width, tile.canvas.height);	
				if(!aHover)
				  tile.context.fillStyle = "#e1e1e1";				
				else
				  tile.context.fillStyle = "#00aeef";				
				tile.context.font         = "37px MolotCustom";
				tile.context.textAlign = "center";
				tile.context.textBaseline = "middle";
				tile.context.fillText(self.localizedString, tile.canvas.width/2, tile.canvas.height/2);
			}
		}
	}
	
	self.img.onload = function() {
	   self.drawBg(false);
	}
	
	self.img.src = self.imageUrl;
}