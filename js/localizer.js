/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */


/**
 * Localizer is an utility that updates the UI strings with localized
 * strings.
 */
Localizer = function() {
	 var self = this;
	 
    self.noLocalization = false; // for disabling localizations temporary
    
    /**
	  * Localizer.getTranslation gets the translated string based on the key parameter
	  * @param key key used to retrieve the localized string
	  */ 
    self.getTranslation = function(key) {
        var text = "";
        if (self.noLocalization) {				
            return text;
        }
        
        if (window.chrome && window.chrome.i18n) {
            text = chrome.i18n.getMessage(key);
        }        
        return text;
    }    
       
    
    // If localizations cannot be read for some reason, we turn localization off.
    if (self.getTranslation("all_moves").length == 0) {		
        self.noLocalization = true;
    }
    return self;
}
