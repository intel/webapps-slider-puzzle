/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * SliderPuzzle class takes care of the game logic and interaction as well as tiles creation and shuffling
 * constructor parameters
 * @param level integer game level (1 - easy; 2 - hard; 3 - brutal) 
 * @param aImageUrl url of the currently selected image (image that is currently used in the game)
 * @param aGameFinishedCallback function pointer to the function that will be invoked when the user completes the game
 * @param aLocalizer reference to a localizer object
 */
function SliderPuzzle(level, aImageUrl, aGameFinishedCallback, aLocalizer )
{
  var self = this;
    
  self.rows = level * 2;
  self.columns = level * 2;
  self.imageUrl = aImageUrl;
  self.level = level;     
  self.moves = 0;
  self.seconds = 0;
  
  self.tiles = null;
  self.cells = null;
  self.timer = null;
  
  self.img = new Image();
  self.parent = document.getElementById("puzzleContainer");  
  
   
  self.width = $("#puzzleContainer").width();
  self.height = $("#puzzleContainer").height();
  self.gameFinishedCallback = aGameFinishedCallback;
  
  self.localizer = aLocalizer;
  
  /**
	* SliderPuzzle.release deletes all tiles and cells
	*/ 
  self.release = function() {
		while (self.parent.children.length > 0)
		  self.parent.removeChild(self.parent.lastChild);
		self.tiles = new Array();
		self.cells = new Array();
		
		if(self.timer != null) {
		  clearInterval(self.timer);
		}
	}
  
  self.release();  
  
  /**
	* SliderPuzzle.initAudio function is used to initialize all the audio files needed for the active game
	*/
  self.initAudio = function() {
	 self.shuffleAudio = new Audio();
	 self.shuffleAudio.src = "audio/Shuffle.ogg";
	 self.moveAudio = new Audio();
	 self.moveAudio.src = "audio/MovePiece.ogg";
  }
  self.initAudio();
  
  
  self.pauseBackground = new PauseBackground(level, self.localizer);
  self.pauseFullImage = new PuzzlePauseFullImage(aImageUrl);  
   
  self._incrementSeconds = function() {
	 self.seconds++; 
  }
	
  self._incrementMoves = function() {
	 self.moves++;
  }
  
  /**
	* SliderPuzzle.stopGameTimerUpdateUi function is used to update the UI based on seconds and moves used in the current game.
	* It also stops the game timer (used when pause is pressed or game is completed)
	*/
  self.stopGameTimerUpdateUi = function() {
	 clearInterval(self.timer);
	 //update UI
	 document.getElementById("qsPpTimeS").innerHTML = SpUtil.secondsToTime(self.seconds).toString(); 
	 document.getElementById("qsPpMovesS").innerHTML = self.moves.toString();
	 document.getElementById("qsFpTimeS").innerHTML = SpUtil.secondsToTime(self.seconds).toString(); 
	 document.getElementById("qsFpMovesS").innerHTML = self.moves.toString();
  }
  
  /**
	* creating the game tiles. Number of tiles depends on the game level
	*/
  for (var r = 0; r < self.rows; r++) {
		self.tiles.push(new Array());
		self.cells.push(new Array());
		for (var c = 0; c < self.columns; c++) {
			if ((self.rows - 1 == r) && (self.columns - 1 == c)) {
				this.cells[r].push(false);
				continue;
			}
			this.cells[r].push(true);
			
			var o = new Object();
			o.tile = document.createElement('div');
			$(o.tile).css('position', 'absolute');
			
			o.canvas = document.createElement('canvas');
			o.context = o.canvas.getContext('2d');
			
			o.hoverTile = document.createElement("div");
			$(o.hoverTile).css("position", "absolute");
			$(o.hoverTile).css("background-image", "url(images/active-puzzle/pointer-right.png)");
			$(o.hoverTile).css("background-position", "center"); 
			$(o.hoverTile).css("background-repeat", "no-repeat");
			$(o.hoverTile).css("left", "0px");
			$(o.hoverTile).css("top", "0px");
			$(o.hoverTile).css("visibility", "hidden");

			o.size = function(width, height) {
				o.canvas.setAttribute('width', width);
				o.canvas.setAttribute('height', height);
				$(o.hoverTile).css("width", width);
				$(o.hoverTile).css("height", height);
			}
			o.size(self.width/self.columns, self.height/self.rows);
			
			o.tile.container = o;
			o.tile.dragging = false;
			//handling click event for each tile
			o.tile.addEventListener('click', function(event) {			  			  
				//make pause "tiles" work!
				event.stopPropagation();
				self.moveAudio.play();
				
				if (this.container.column > 0 && !self.cells[this.container.row][this.container.column - 1]) {
					this.container.move(this.container.row, this.container.column - 1, true);
					self._incrementMoves();
				} else if (this.container.column < self.columns - 1 && !self.cells[this.container.row][this.container.column + 1]) {
					this.container.move(this.container.row, this.container.column + 1, true);						
					self._incrementMoves();
				} else if (this.container.row > 0 && !self.cells[this.container.row - 1][this.container.column]) {
					this.container.move(this.container.row - 1, this.container.column, true);		
					self._incrementMoves();
				} else if (this.container.row < self.rows - 1 && !self.cells[this.container.row + 1][this.container.column]) {
					this.container.move(this.container.row + 1, this.container.column, true);		
					self._incrementMoves();
				} else {
					return;
				}
				
				for (var r = 0; r < self.rows; r++) {
					for (var c = 0; c < self.columns; c++) {
						try {
							var t = self.tiles[r][c];
							if (t.row != t.solutionRow || t.column != t.solutionColumn)
								// found at least one tile that is not in
								// its solution position
								return;
						} catch(err) {} // trying to check the empty tile
					}
				}
				
				// If you get here then the puzzle was solved				
				self.gameFinishedCallback();
			});
			
			//handling hover event for each tile
			o.tile.addEventListener('mouseover', function(event) {			   
			   event.stopPropagation();
				if (this.container.column > 0 && !self.cells[this.container.row][this.container.column - 1]) {
					$(this.container.hoverTile).css("background-image", "url(images/active-puzzle/pointer-left.png)");
				} else if (this.container.column < self.columns - 1 && !self.cells[this.container.row][this.container.column + 1]) {
					$(this.container.hoverTile).css("background-image", "url(images/active-puzzle/pointer-right.png)");
				} else if (this.container.row > 0 && !self.cells[this.container.row - 1][this.container.column]) {
					$(this.container.hoverTile).css("background-image", "url(images/active-puzzle/pointer-up.png)");
				} else if (this.container.row < self.rows - 1 && !self.cells[this.container.row + 1][this.container.column]) {
					$(this.container.hoverTile).css("background-image", "url(images/active-puzzle/pointer-down.png)");
				} else {
					return;
				}
								
				$(this.container.hoverTile).css("visibility", "visible");
				
			}, false);
			
			//handling mouse out event for each tile
			o.tile.addEventListener('mouseout', function(event) {
				event.stopPropagation();				
				$(this.container.hoverTile).css("visibility", "hidden");
				
			}, false);
			
			
			o.tile.appendChild(o.canvas);
			o.tile.appendChild(o.hoverTile);
			
			o.parent = self.parent;
			o.solutionRow = r;
			o.solutionColumn = c;
			//moving the tile with an animation
			o.move = function (row, column, animate) {
				if (this.row != undefined && this.column != undefined)
					self.cells[this.row][this.column] = false;
				this.row = row;
				this.column = column;
				self.cells[row][column] = true;
				
				if (animate) {
					$(this.tile).animate({left: this.column * this.canvas.width}, 250, null);
					$(this.tile).animate({top: this.row * this.canvas.height}, 250, null);
				} else {
					$(this.tile).css('left', this.column * this.canvas.width);
					$(this.tile).css('top', this.row * this.canvas.height);
				}
			}
			o.move(r, c, false);
			
			self.parent.appendChild(o.tile);
			self.tiles[r].push(o);
		}
	}
	
	/**
	* SliderPuzzle.scramble function is used to scramble the tiles
	*/
	self.scramble = function() {
		self.shuffleAudio.play();
		// Half of the possible tile combinations are unsolvable, so instead of
		// just randomly generating a combination of tiles, actually walk through
		// a set of valid moves.		
		var lastEmpty = {row: this.rows - 1, column: this.columns - 1};
		var empty = {row: this.rows - 1, column: this.columns - 1};
		
		function validMove(m) {

			 // slide in from the left
			 if (0 == m && (empty.column == 0 || lastEmpty.column == empty.column - 1)) {
				return false;
			 }			 
			 // slide in from the right
			 if (1 == m && (empty.column == self.columns - 1 || lastEmpty.column == empty.column + 1)) {
				return false;
			 }
			 // slide in from the top
			 if (2 == m && (empty.row == 0 || lastEmpty.row == empty.row - 1)) {
				return false;
			 }
			 
			 // slide in from the bottom
			 if (3 == m && (empty.row == self.rows - 1 || lastEmpty.row == empty.row + 1)) {
				return false;
			 }

			 return true;
		}

		for (var i = 0; i < this.rows * this.columns - 1; i++) {
			 // There are four possible moves, slide into the empty space from the:
			 // left, right, top, or bottom
			 var move;
			 
			 do {
				move = Math.floor(Math.random() * 4);
			 } while (!validMove(move));
			 
			 lastEmpty.row = empty.row;
			 lastEmpty.column = empty.column;
			 if (move == 0) {
				// left
				empty.column = empty.column - 1;
			 } else if (move == 1) {
				// right
				empty.column = empty.column + 1;
			 } else if (move == 2) {
				// top
				empty.row = empty.row - 1;
			 } else {
				// bottom
				empty.row = empty.row + 1;
			 }
			 
			 for (var row = 0; row < this.rows; row++) {
				for (var column = 0; column < this.columns; column++) {
					 try {
						var tile = this.tiles[row][column];
						if (tile.row == empty.row && tile.column == empty.column) {
							 tile.move(lastEmpty.row, lastEmpty.column);
							 break;
						}
					 } catch (err) {} // ignore empty cell
				}
			 }
		}
	}
	
	self.img.onload = function() {
	  var scaledWidth, scaledHeight;
		scaledWidth = self.width;
		scaledHeight = self.height;

		for (var r = 0; r < self.tiles.length; r++) {
			for (var c = 0; c < self.tiles[r].length; c++) {
				var tile = self.tiles[r][c];
				var sx = tile.column * this.width/self.columns;
				var sy = Math.floor(tile.row * this.height/self.rows);
				tile.context.drawImage(this, sx, sy, this.width/self.columns, this.height/self.rows, 0, 0, tile.canvas.width, tile.canvas.height);
				tile.context.strokeStyle = "black";
				tile.context.strokeRect(0, 0, tile.canvas.width, tile.canvas.height);
			}
		}
		self.scramble();
	}
	
	self.img.src = self.imageUrl;	
		
	self.startGameTimer = function () {
	  self.timer = setInterval(self._incrementSeconds, 1000);
	}
	
	//game timer is started
	self.startGameTimer();	
	
}
