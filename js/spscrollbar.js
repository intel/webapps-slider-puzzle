/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * SpScrollBar class represents a scrollbar
 * constructor parameters
 * @param scrContainer reference to the div element that contains a scroller
 * @param scroller reference to SpScroller object
 */
function SpScrollBar (scrContainer, scroller) {
	var self = this;
	
	/**
	 * SpScrollBar.reset - resets the state of the scrollbar.
	 */ 
	self.reset = function () {		
		self.parent = scrContainer;
		self.scroller = scroller;		
		self.scrHandle = document.getElementById("ppScrollbarHandle");
		self.scrContainer = document.getElementById("ppScrollbarContainer");			
		self.trackHeight  = $(self.scrContainer).height();
		self.handleHeight = $(self.scrHandle).height();
		self.x = 0;
		self.y = 0;
		
		self.scrollDist  = 3;		
		self.selectFunc  = null;
		self.grabPoint   = null;
		self.disabled    = false;		
		self.ratio = (self.scroller.totalHeight - self.scroller.viewableHeight)/(self.trackHeight - self.handleHeight);
		self.trackTop = self.findOffsetTop(self.scrContainer);
			
		self.addEvent(self.scroller.content, "mousewheel", self.scrollbarWheel);
		self.removeEvent(self.parent, "mousedown", self.scrollbarClick);
		self.addEvent(self.parent, "mousedown", self.scrollbarClick);
		
		self.scroller.reset();
		with (self.scrHandle.style) {
			top  = "0px";
			left = "0px";
		}
		self.moveContent();
		
		if (self.scroller.totalHeight < self.scroller.viewableHeight) {
			self.disabled = true;
			self.scrHandle.style.visibility = "hidden";			
		} 
		else {
			self.disabled = false;
			self.scrHandle.style.visibility = "visible";
			this.parent.style.visibility  = "visible";
		}
	};
	
	/**
	 * SpScrollBar.stopScroll - stops scrolling the content
	 */ 
	self.stopScroll = function () {
		self.removeEvent(document, "mousemove", self.scrollbarDrag, false);
		self.removeEvent(document, "mouseup", self.stopScroll, false);
		
		if (self.selectFunc) document.onselectstart = self.selectFunc;
		else document.onselectstart = function () { return true; };		
		
	};
	
	self.addEvent = function (obj, event, func) {
		if (obj.addEventListener) obj.addEventListener(event, func, false);
		else if (obj.attachEvent) obj.attachEvent('on'+ event, func);
		else obj['on'+ event] = func;
	};
	
	self.removeEvent = function (obj, event, func) {
		if (obj.removeEventListener) obj.removeEventListener(event, func, false);
		else if (obj.detachEvent) obj.detachEvent('on'+ event, func);
		else o['on'+ event] = null;
	};
	
	/**
	 * SpScrollBar.scrollbarClick - invoked when the scrollbar is clicked
	 */	
	self.scrollbarClick = function (e) {	  
		if (self.disabled) return false;
				
		e = e ? e : event;
		if (!e.target) e.target = e.srcElement;		
		else if (e.target.id == "ppScrollbarContainer") {		  
		  self.scrollTrack(e);
		}
		else if (e.target.id == "ppScrollbarHandle") {		  
		  self.scrollHandle(e);
		}
				
		self.selectFunc = document.onselectstart;
		document.onselectstart = function () {return false;};		
		self.addEvent(document, "mouseup", self.stopScroll, false);		
		
		return false;
	};
	
	self.findOffsetTop = function(obj) {		
		return $(obj).offset().top;
	};
	
	self.scrollbarDrag = function (e) {
		e = e ? e : event;
		var t = parseInt(self.scrHandle.style.top);
		var v = e.clientY + document.body.scrollTop - self.trackTop;
		with (self.scrHandle.style) {
			if (v >= self.trackHeight - self.handleHeight + self.grabPoint)
				top = self.trackHeight - self.handleHeight +"px";
			else if (v <= self.grabPoint) top = "0px";
			else top = v - self.grabPoint +"px";
			self.y = parseInt(top);
		}
		
		self.moveContent();
	};
	
	self.scrollbarWheel = function (e) {
		e = e ? e : event;
		var dir = 0;
		if (e.wheelDelta >= 120) dir = -1;
		if (e.wheelDelta <= -120) dir = 1;
		
		self.scrollBy(0, dir * 20);
		e.returnValue = false;
	};
		
	
	self.scrollTrack = function (e) {
		var curY = e.clientY + document.body.scrollTop;
		self.scroll(0, curY - self.trackTop - self.handleHeight/2);
	};
	
	self.scrollHandle = function (e) {
		var curY = e.clientY + document.body.scrollTop;		
		self.grabPoint = curY - self.findOffsetTop(self.scrHandle);
		self.addEvent(document, "mousemove", self.scrollbarDrag, false);
	};
	
	self.scroll = function (x, y) {
		if (y > self.trackHeight - self.handleHeight) 
			y = self.trackHeight - self.handleHeight;
		if (y < 0) y = 0;
		
		self.scrHandle.style.top = y +"px";
		self.y = y;
		
		self.moveContent();
	};
	
	self.moveContent = function () {			  
		self.scroller.scrollTo(0, Math.round(self.y * self.ratio));
	};
	
	self.scrollBy = function (x, y) {
		self.scroll(0, (-self.scroller.y + y)/self.ratio);
	};
	
	self.scrollTo = function (x, y) {
		self.scroll(0, y/self.ratio);
	};
	
	this.reset();
}
