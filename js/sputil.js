/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * SpUtil is a static utility class which contains useful utility functions that can be used application-wide
 */
function SpUtil() {}

SpUtil._pad = function(number) {
	return (number < 10 ? '0' : '') + number
}

/**
 * SpUtil.secondsToTime is used to format second to minutes and seconds string (e.g. 1000 seconds is 16:40)
 * @param seconds number of seconds
 * @return minutes:seconds formatted string
 */ 
SpUtil.secondsToTime = function(seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = seconds % 60;
  return SpUtil._pad(minutes)+":"+ SpUtil._pad(seconds);
}     
