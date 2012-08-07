/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * SpScroller class represents a scroller
 * constructor parameters
 * @param object actual scrollable content
 * @param width width of the actual scrollable content
 * @param height height of the actual scrollable content
 */
function SpScroller(object, width, height) {
  var self = this;
  
  /**
	* SpScroller.setPosition - sets the position of the scrollable content
	*/ 
  self.setPosition = function (x, y) {
		if (x < self.viewableWidth - self.totalWidth) 
			x = self.viewableWidth - self.totalWidth;
		if (x > 0) x = 0;
		if (y < self.viewableHeight - self.totalHeight) 
			y = self.viewableHeight - self.totalHeight;
		if (y > 0) y = 0;
		self.x = x;
		self.y = y;
		with (object.style) {
			left = self.x +"px";
			top  = self.y +"px";			
		}
	};
	
  /**
	* SpScroller.setPosition - resets the position of the scrollable content to (0,0)
	*/ 
	self.reset = function () {
		self.content = object;
		self.totalHeight = object.scrollHeight;
		self.totalWidth = object.scrollHeight;
		self.x = 0;
		self.y = 0;
		with (object.style) {
			left = "0px";
			top  = "0px";
		}
	};
	
	self.scrollBy = function (x, y) {
		self.setPosition(self.x + x, self.y + y);
	};
	
	self.scrollTo = function (x, y) {
		self.setPosition( -x, -y );
	};	
		
	self.content = object;
	self.viewableWidth = width;
	self.viewableHeight = height;
	self.totalWidth = object.scrollHeight;
	self.totalHeight = object.scrollHeight;	
	self.reset();
}
