/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

//Slider Puzzle Application object
SliderPuzzleApp = {};

(function () {
  /**
  * quickStart() function is used to show the main screen of the game (screen where the actual puzzle is displayed)
  */
  function quickStart() {
   SliderPuzzleApp.buttonClickStartAudio.play();
   $("#mainPage").css("visibility", "hidden");
   $("#leaderboardPage").css("visibility", "hidden");
   if(SliderPuzzleApp.photosPageObj !== null && SliderPuzzleApp.photosPageObj !== undefined) {
    SliderPuzzleApp.photosPageObj.setInvisible();
   }
   if(SliderPuzzleApp.leaderBoardPageObj !== null && SliderPuzzleApp.leaderBoardPageObj !== undefined) {
    SliderPuzzleApp.leaderBoardPageObj.setInvisible();
   }
   $("#quickStartPage").css("visibility", "visible");
   return false;
  }

  /**
  * closePausePopoutNoAnim() closes the pause popout without sliding animation (just hides it)
  */
  function closePausePopoutNoAnim() {
   SliderPuzzleApp.pauseScreen = false;
   $("#qsPaused").css("visibility", "hidden");
   $("#pausePopout").addClass("closePausePopoutAnimClass");
   $("#pausePopout").css("visibility", "hidden");
   $("#pausePopout").css("visibility", "hidden");
   $("#pausePopout").removeClass("pausePopoutAnimClass");
   $("#pausePopout").removeClass("closePausePopoutAnimClass");
   $("#puzzlePauseFullImage").css("visibility", "hidden");
   return false;
  }

  /**
  * leaderBoard() function is used to show the leaderboard screen
  */
  function leaderBoard() {
   SliderPuzzleApp.buttonClickAudio.play();
   $("#mainPage").css("visibility", "hidden");
   $("#leaderboardPage").css("visibility", "visible");
   $("#quickStartPage").css("visibility", "hidden");
   if(SliderPuzzleApp.photosPageObj !== null && typeof SliderPuzzleApp.photosPageObj != "undefined" &&
    SliderPuzzleApp.leaderBoardPageObj != null && typeof SliderPuzzleApp.leaderBoardPageObj != "undefined") {
    SliderPuzzleApp.photosPageObj.setInvisible();;
    SliderPuzzleApp.leaderBoardPageObj.updateScores();
   }
   return false;
  }

  /**
  * closeLeaderBoard() function is used to hide/close the leaderboard screen
  */
  function closeLeaderBoard() {
   $("#mainPage").css("visibility", "visible");
   $("#leaderboardPage").css("visibility", "hidden");
   $("#quickStartPage").css("visibility", "hidden");
   if(SliderPuzzleApp.photosPageObj !== null && SliderPuzzleApp.photosPageObj !== undefined) {
    SliderPuzzleApp.photosPageObj.setInvisible();
   }
   return false;
  }

  /**
  * leaderBoardPause() function is used to show the leaderboard screen when it is requested from the pause
  * popout. It hides the pause popout.
  */
  function leaderBoardPause() {
   SliderPuzzleApp.buttonClickAudio.play();
   closePausePopoutNoAnim();
   $("#mainPage").css("visibility", "hidden");
   $("#leaderboardPage").css("visibility", "visible");
   $("#qsPause").css("visibility", "");
   $("#qsInfo").css("visibility", "");
   $("#quickStartPage").css("visibility", "hidden");

   if(SliderPuzzleApp.photosPageObj !== null && typeof SliderPuzzleApp.photosPageObj != "undefined" &&
    SliderPuzzleApp.leaderBoardPageObj != null && typeof SliderPuzzleApp.leaderBoardPageObj != "undefined") {
    SliderPuzzleApp.photosPageObj.setInvisible();
    SliderPuzzleApp.leaderBoardPageObj.updateScores();
   }
   return false;
  }

  /**
  * photosPage() function is used to show the photos selection screen
  */
  function photosPage() {
   SliderPuzzleApp.buttonClickAudio.play();
   $("#mainPage").css("visibility", "hidden");
   $("#leaderboardPage").css("visibility", "hidden");
   $("#quickStartPage").css("visibility", "hidden");
   $("#photosPage").css("visibility", "visible");
   SliderPuzzleApp.photosPageObj.initializePage();
   return false;
  }

  /**
  * closePhotosPage() function is used to close/hide the photos selection screen
  */
  function closePhotosPage() {
   $("#mainPage").css("visibility", "visible");
   $("#leaderboardPage").css("visibility", "hidden");
   $("#quickStartPage").css("visibility", "hidden");
   if(SliderPuzzleApp.photosPageObj !== null && SliderPuzzleApp.photosPageObj !== undefined) {
    SliderPuzzleApp.photosPageObj.setInvisible();
   }
   return false;
  }

  /**
  * closePhotosPagePopup() function is used to close/hide the popup on the photos selection screen
  */
  function closePhotosPagePopup() {
   if(SliderPuzzleApp.photosPageObj !== null && SliderPuzzleApp.photosPageObj !== undefined) {
    SliderPuzzleApp.photosPageObj.closePopUp();
   }
  }

  /**
  * closeLeaderBoardPagePopup() function is used to close/hide the popup on the leaderboard screen
  */
  function closeLeaderBoardPagePopup() {
   if(SliderPuzzleApp.leaderBoardPageObj !== null && typeof SliderPuzzleApp.leaderBoardPageObj != "undefined") {
    SliderPuzzleApp.leaderBoardPageObj.closePopUp();
   }
  }

  /**
  * newPopout() function is used to show the right popout (change difficulty, change photo, restart game, etc)
  */
  function newPopout() {
   //pause screen is opened
   if( SliderPuzzleApp.pauseScreen || SliderPuzzleApp.startScreen )
    return false;

   SliderPuzzleApp.startScreen = true;

   SliderPuzzleApp.buttonClickAudio.play();

   $("#qsInfo").css("visibility", "hidden");
   $("#newPopout").css("visibility", "visible");
   $("#newPopout").addClass("newPopoutAnimClass");

   if(typeof SliderPuzzleApp.sliderPuzzle != "undefined" && typeof SliderPuzzleApp.newPopoutObj != "undefined") {
    SliderPuzzleApp.newPopoutObj.setDifficulty(SliderPuzzleApp.sliderPuzzle.level);
   }


   if(SliderPuzzleApp.sliderPuzzle != null && SliderPuzzleApp.sliderPuzzle !== undefined) {
    $("#puzzlePauseFullImage").css("visibility", "visible");

    //change moves and time; stop game timer;
    SliderPuzzleApp.sliderPuzzle.stopGameTimerUpdateUi();
   }

   return false;
  }

  /**
  * closePopout() function is used to close/hide the right popout (change difficulty, change photo, restart game, etc)
  */
  function closePopout() {
   var eventName = "webkitTransitionEnd";
   var onTransitionEnd = function ( e ){
    $("#qsInfo").css("visibility", "visible");
    $("#newPopout").css("visibility", "hidden");
    $("#newPopout").removeClass("newPopoutAnimClass");
    $("#newPopout").removeClass("closePopoutAnimClass");
    $("#newPopout").unbind( eventName );
    SliderPuzzleApp.startScreen = false;
    }

   SliderPuzzleApp.buttonClickAudio.play();

   $("#newPopout").bind( eventName, onTransitionEnd );
   $("#newPopout").addClass("closePopoutAnimClass");
   $("#puzzlePauseFullImage").css("visibility", "hidden");

   //resume game timer
   SliderPuzzleApp.sliderPuzzle.startGameTimer();

   return false;
  }

  /**
  * closePopoutNoAnim() function is used to close/hide the right popout without the sliding animation
  */
  function closePopoutNoAnim() {
    $("#qsInfo").css("visibility", "");
    $("#newPopout").css("visibility", "hidden");
    $("#newPopout").removeClass("newPopoutAnimClass");
    SliderPuzzleApp.startScreen = false;
   return false;
  }

  /**
  * pausePopout() function is used to show the left popout (when game is paused)
  */
  function pausePopout() {
    // new screen is opened
    if (SliderPuzzleApp.startScreen || SliderPuzzleApp.pauseScreen)
      return false;

    SliderPuzzleApp.buttonClickAudio.play();

    if (SliderPuzzleApp.pausePopoutObj != null &&
        typeof SliderPuzzleApp.pausePopoutObj != "undefined" &&
        SliderPuzzleApp.sliderPuzzle != null &&
        typeof SliderPuzzleApp.sliderPuzzle.imageUrl != "undefined") {
      SliderPuzzleApp.pausePopoutObj.updateScores(
        SliderPuzzleApp.level,
        SliderPuzzleApp.sliderPuzzle.imageUrl,
        SliderPuzzleApp.sliderPuzzle.moves,
        SliderPuzzleApp.sliderPuzzle.seconds
      );
    }

    SliderPuzzleApp.pauseScreen = true;
    $("#puzzlePauseFullImage").one('click', SliderPuzzleApp.closePausePopout);
    $("#qsPausedS").one('click', SliderPuzzleApp.closePausePopout);

    $("#qsPause").css("visibility", "hidden");
    $("#pausePopout").css("visibility", "visible");
    $("#qsPaused").css("visibility", "visible");
    $("#pausePopout").addClass("pausePopoutAnimClass");

    if (SliderPuzzleApp.sliderPuzzle != null && SliderPuzzleApp.sliderPuzzle !== undefined) {
      $("#puzzlePauseFullImage").css("visibility", "visible");

      //change moves and time; stop game timer;
      SliderPuzzleApp.sliderPuzzle.stopGameTimerUpdateUi();
    }

    return false;
  }

  /**
  * closePausePopout() function is used to close/hide the left popout (when game is resumed)
  */
  function closePausePopout() {
   $("#puzzlePauseFullImage").attr("onClick", null);
   $("#qsPausedS").attr("onClick", null);

   var eventName = "webkitTransitionEnd";
   var onTransitionEnd = function ( e ){
    $("#qsPause").css("visibility", "visible");
    $("#pausePopout").css("visibility", "hidden");
    $("#pausePopout").removeClass("pausePopoutAnimClass");
    $("#pausePopout").removeClass("closePausePopoutAnimClass");
    $("#pausePopout").unbind(eventName);
    SliderPuzzleApp.pauseScreen = false;
    }

   SliderPuzzleApp.buttonClickAudio.play();

   $("#qsPaused").css("visibility", "hidden");
   $("#pausePopout").bind(eventName, onTransitionEnd);
   $("#pausePopout").addClass("closePausePopoutAnimClass");
   $("#puzzlePauseFullImage").css("visibility", "hidden");

   //resume game timer
   SliderPuzzleApp.sliderPuzzle.startGameTimer();

   return false;
  }

  /**
  * finishPopout() function is used to show the finish popout (when game is finished)
  */
  function finishPopout() {
   $("#qsInfo").css("visibility", "hidden");
   $("#qsPause").css("visibility", "hidden");
   $("#finishScreenPopout").css("visibility", "visible");
   $("#qsFinish").css("visibility", "visible");

   if(SliderPuzzleApp.sliderPuzzle != null && SliderPuzzleApp.sliderPuzzle !== undefined) {
    $("#puzzlePauseFullImage").css("visibility", "visible");
    SliderPuzzleApp.sliderPuzzle.stopGameTimerUpdateUi();
    SliderPuzzleApp.winAudio.play();
   }

   if( SliderPuzzleApp.finishPopoutObj != null && typeof SliderPuzzleApp.finishPopoutObj != "undefined" &&
    SliderPuzzleApp.sliderPuzzle != null && typeof SliderPuzzleApp.sliderPuzzle.imageUrl != "undefined") {
    SliderPuzzleApp.finishPopoutObj.updateScores( SliderPuzzleApp.level, SliderPuzzleApp.sliderPuzzle.imageUrl, SliderPuzzleApp.sliderPuzzle.moves, SliderPuzzleApp.sliderPuzzle.seconds);
   }
  }

  /**
  * closeFinishPopout() function is used to close/hide the finish popout
  */
  function closeFinishPopout() {
   $("#qsInfo").css("visibility", "");
   $("#qsPause").css("visibility", "");
   $("#qsFinish").css("visibility", "");
   $("#finishScreenPopout").css("visibility", "hidden");
   if(SliderPuzzleApp.sliderPuzzle != null && SliderPuzzleApp.sliderPuzzle !== undefined) {
    $("#puzzlePauseFullImage").css("visibility", "hidden");
   }

   return false;
  }

  /**
  * mainPage() function is used to show the initial screen of the game
  */
  function mainPage() {
   $("#mainPage").css("visibility", "visible");
   $("#leaderboardPage").css("visibility", "hidden");
   if(SliderPuzzleApp.photosPageObj !== null && SliderPuzzleApp.photosPageObj !== undefined) {
    SliderPuzzleApp.photosPageObj.setInvisible();
   }
   $("#quickStartPage").css("visibility", "hidden");
  }

  /**
  * saveResult() function is used to save the game result to the database
  */
  function saveResult() {
   var finishUserInputElem = document.getElementById("usernameinput");
   //user didn't input a username
   if(finishUserInputElem.value == "") {
    return true;
   }
   else {
    SliderPuzzleApp.db.saveUserAndResult(finishUserInputElem.value,
      SliderPuzzleApp.sliderPuzzle.moves,
      SliderPuzzleApp.sliderPuzzle.seconds,
      SliderPuzzleApp.sliderPuzzle.level,
      SliderPuzzleApp.sliderPuzzle.imageUrl);

    closeFinishPopout();
    mainPage();

    return false;
   }
  }
  /**
  * closeFinishNoSave() function is used to exit finished game wihtout saving results
  */
  function closeFinishNoSave() {
      closeFinishPopout();
      mainPage();
  }

  function resize() {
    // main container size
    var mwidth = $("#mainPage").width();
    var mheight = $("#mainPage").height();

    var offsetX = mwidth * 0.05;
    var offsetY = mheight * 0.05;

    $("#puzzleContainer").width(mwidth - offsetX * 2);
    $("#puzzleContainer").height(mheight - offsetY * 2);
    $("#puzzleContainer").css("-webkit-transform", "translate("+offsetX+"px, "+offsetY+"px)");

    $("#puzzlePauseBackground").width(mwidth - offsetX * 2);
    $("#puzzlePauseBackground").height(mheight - offsetY * 2);
    $("#puzzlePauseBackground").css("-webkit-transform", "translate("+offsetX+"px, "+offsetY+"px)");

    $("#puzzlePauseFullImage").width(mwidth - offsetX * 2);
    $("#puzzlePauseFullImage").height(mheight - offsetY * 2);
    $("#puzzlePauseFullImage").css("-webkit-transform", "translate("+offsetX+"px, "+offsetY+"px)");

    $("#puzzleContainer").width(mwidth - offsetX * 2);
    $("#puzzleContainer").height(mheight - offsetY * 2);
  }

  /**
  * startGame() function is called when the game is started
  * @param level difficulty level used to play the game (1 - easy, 2 - hard, 3 - brutal)
  */
  function startGame(level) {
    if(SliderPuzzleApp.photosPageObj != null && SliderPuzzleApp.photosPageObj !== undefined) {
     SliderPuzzleApp.quickStart();


     //set photo credit if any
     if(SliderPuzzleApp.photosPageObj.selectedPhotoCredit.length != 0) {
      SliderPuzzleApp.pausePopoutObj.localizePhotoCredit(SliderPuzzleApp.photosPageObj.selectedPhotoCredit);
     }
     else {
      $("#qsPpCreditStrS").html("");
     }

     SliderPuzzleApp.currentImgUrl = SliderPuzzleApp.photosPageObj.selectedPhotoUrl;
     SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(level, SliderPuzzleApp.photosPageObj.selectedPhotoUrl, SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    }
    return false;
  }

  /**
  * startGameLb() function is called when the game is started from the leaderboard screen (from the popup)
  * @param level difficulty level used to play the game (1 - easy, 2 - hard, 3 - brutal)
  */
  function startGameLb() {
    if(SliderPuzzleApp.leaderBoardPageObj != null && typeof SliderPuzzleApp.leaderBoardPageObj != "undefined") {
     if(SliderPuzzleApp.leaderBoardPageObj.currentLevel != 0 && SliderPuzzleApp.leaderBoardPageObj.currentImage != "") {
      SliderPuzzleApp.quickStart();
      SliderPuzzleApp.currentImgUrl = SliderPuzzleApp.leaderBoardPageObj.currentImage;
      SliderPuzzleApp.level = SliderPuzzleApp.leaderBoardPageObj.currentLevel;
      SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.leaderBoardPageObj.currentLevel, SliderPuzzleApp.leaderBoardPageObj.currentImage, SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
     }
    }
    return false;
  }

  /**
  * startRandomGame() function is called when the game is started from the initial screen (quick game); random image is selected for the game
  * The level of the game is either hard (which is default) or taken from the user preference (last played game level if any).
  */
  function startRandomGame() {
   if(SliderPuzzleApp.photosPageObj != null && typeof SliderPuzzleApp.photosPageObj != "undefined") {
    SliderPuzzleApp.quickStart();
    var photosIndex = Math.floor(Math.random()*19);

     if(SliderPuzzleApp.photosPageObj.photos[photosIndex].credit.length != 0) {
       SliderPuzzleApp.pausePopoutObj.localizePhotoCredit(SliderPuzzleApp.photosPageObj.photos[photosIndex].credit);
     }
     else {
      $("#qsPpCreditStrS").html("");
     }

    SliderPuzzleApp.currentImgUrl = SliderPuzzleApp.photosPageObj.photos[photosIndex].imgUrl;
    SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.level, SliderPuzzleApp.photosPageObj.photos[photosIndex].imgUrl, SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    return false;
   }
  }

  /**
  * initNewPopout() function creates new object of the NewPopout class
  */
  function initNewPopout() {
   SliderPuzzleApp.newPopoutObj = new NewPopout(SliderPuzzleApp.localizerObj);
  }

  /**
  * playAgain() function is called when "Play again" button is pressed on the right popout
  */
  function playAgain() {
   if(SliderPuzzleApp.newPopoutObj != null && SliderPuzzleApp.newPopoutObj !== undefined ) {
    closePopout();
    SliderPuzzleApp.quickStart();
    //save preferred difficulty
    SliderPuzzleApp.level = SliderPuzzleApp.newPopoutObj.difficulty;
    SliderPuzzleApp.saveLevel();
    if(SliderPuzzleApp.currentImgUrl != "") {
      SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.newPopoutObj.difficulty, SliderPuzzleApp.currentImgUrl, SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    }
    else {
      SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.newPopoutObj.difficulty, "images/puzzle_photos/Ian_Sane-zoo-lion.jpg", SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    }
    return false;
   }
   else {
    SliderPuzzleApp.quickStart();
    if(SliderPuzzleApp.currentImgUrl != "") {
      SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.newPopoutObj.difficulty, SliderPuzzleApp.currentImgUrl, SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    }
    else {
      SliderPuzzleApp.sliderPuzzle = new SliderPuzzle(SliderPuzzleApp.level, "images/puzzle_photos/Ian_Sane-zoo-lion.jpg", SliderPuzzleApp.finishPopout, SliderPuzzleApp.localizerObj);
    }
    return false;
   }
  }

  /**
  * playAgain() function is called when "New photo" button is pressed on the right popout
  */
  function newPhoto() {
   closePopoutNoAnim();
   $("#mainPage").css("visibility", "hidden");
   $("#leaderboardPage").css("visibility", "hidden");
   $("#quickStartPage").css("visibility", "hidden");
   $("#puzzlePauseFullImage").css("visibility", "hidden");
   $("#qsPause").css("visibility", "");
   $("#qsInfo").css("visibility", "");
   photosPage();
  }

  /**
  * loadLevel() function loads the value of the level property from the local storage.
  */
  function loadLevel() {
   var level = localStorage.getItem("level");
   if((typeof level != "undefined") &&
    (level != null) && (level != "NaN")) {
    return parseInt(level);
   }
   else {
    return 2;
   }
  }

  function saveLevel() {
   localStorage.setItem("level",SliderPuzzleApp.level);
  }

  function localize() {
   if(typeof SliderPuzzleApp.localizerObj != "undefined" && !SliderPuzzleApp.localizerObj.noLocalization) {
    $("#mpQuickStartS").html(SliderPuzzleApp.localizerObj.getTranslation("open_quickstart"));
    $("#mpLeaderBoardS").html(SliderPuzzleApp.localizerObj.getTranslation("open_leaderboard"));
    $("#mpChoosePhotoS").html(SliderPuzzleApp.localizerObj.getTranslation("open_choosephoto"));
   }
  }

  function helpClicked() {
    var dialog = document.getElementById("helpDialog").style.opacity= 1;
    document.getElementById("helpDialog").style.display="inline";
    document.getElementById("smokeScreen").style.display="inline";
  }

  function closeHelp() {
    var dialog = document.getElementById("helpDialog").style.opacity= 0;
    document.getElementById("helpDialog").style.display="none";
    document.getElementById("smokeScreen").style.display="none";
  }

  // void main()
  function init() {
    SliderPuzzleApp.introAudio = new Audio();
    SliderPuzzleApp.introAudio.src = "audio/Intro.ogg";
    SliderPuzzleApp.introAudio.play();

    SliderPuzzleApp.startScreen = false;
    SliderPuzzleApp.pauseScreen = false;
    SliderPuzzleApp.localizerObj = new Localizer();
    SliderPuzzleApp.quickStart = quickStart;
    SliderPuzzleApp.leaderBoard = leaderBoard;
    SliderPuzzleApp.leaderBoardPause = leaderBoardPause;
    SliderPuzzleApp.closeLeaderBoard = closeLeaderBoard;
    SliderPuzzleApp.photosPage = photosPage;
    SliderPuzzleApp.closePhotosPage = closePhotosPage;
    SliderPuzzleApp.newPopout = newPopout;
    SliderPuzzleApp.closePopout = closePopout;
    SliderPuzzleApp.pausePopout = pausePopout;
    SliderPuzzleApp.closePausePopout = closePausePopout;
    SliderPuzzleApp.closePhotosPagePopup = closePhotosPagePopup;
    SliderPuzzleApp.closeLeaderBoardPagePopup = closeLeaderBoardPagePopup;
    SliderPuzzleApp.startGame = startGame;
    SliderPuzzleApp.startGameLb = startGameLb;
    SliderPuzzleApp.startRandomGame = startRandomGame;
    SliderPuzzleApp.finishPopout = finishPopout;
    SliderPuzzleApp.closeFinishPopout = closeFinishPopout;
    SliderPuzzleApp.saveResult = saveResult;
    SliderPuzzleApp.closeFinishNoSave = closeFinishNoSave;
    SliderPuzzleApp.playAgain = playAgain;
    SliderPuzzleApp.newPhoto = newPhoto;
    SliderPuzzleApp.createDB = createDB;
    SliderPuzzleApp.saveLevel = saveLevel;
    SliderPuzzleApp.loadLevel = loadLevel;
    SliderPuzzleApp.db = null;
    SliderPuzzleApp.level = SliderPuzzleApp.loadLevel();
    SliderPuzzleApp.helpClicked = helpClicked;
    SliderPuzzleApp.closeHelp = closeHelp;

    SliderPuzzleApp.currentImgUrl = "";

    SliderPuzzleApp.saveLevel();

    // load remaining HTML, and init the UI elements and handlers when done
    $.ajax({
      url: './pages.html'
    })
    .done(function (html) {
      $('body').append(html);
    })
    .always(lazyInit);
  }

  // NB we init the intro audio as soon as possible in the init() function
  function initAudio() {
    SliderPuzzleApp.cheerAudio = new Audio();
    SliderPuzzleApp.cheerAudio.src = "audio/cheer.ogg";
    SliderPuzzleApp.buttonClickStartAudio = new Audio();
    SliderPuzzleApp.buttonClickStartAudio.src = "audio/ButtonClick_01_Start.ogg";
    SliderPuzzleApp.buttonClickAudio = new Audio();
    SliderPuzzleApp.buttonClickAudio.src = "audio/ButtonClick_02_Settings.ogg";
    SliderPuzzleApp.winAudio = new Audio();
    SliderPuzzleApp.winAudio.src = "audio/Win.ogg";
  }

  /**
  * createDB() function creates new object of the DBManager class
  */
  function createDB() {
    SliderPuzzleApp.db = new DBManager();
  }

  // initialize other parts of the app which can wait until after the intro
  // screen is visible, then make the app "live"
  function lazyInit() {
    license_init("license", "mainPage");

    initAudio();
    createDB();

    SliderPuzzleApp.localize = localize;
    SliderPuzzleApp.localize();

    initNewPopout();

    SliderPuzzleApp.pausePopoutObj = new PausePopout(SliderPuzzleApp.db, SliderPuzzleApp.localizerObj);
    SliderPuzzleApp.leaderBoardPageObj = new LeaderBoardPage(SliderPuzzleApp.db, SliderPuzzleApp.localizerObj);
    SliderPuzzleApp.finishPopoutObj = new FinishPopout(SliderPuzzleApp.db, SliderPuzzleApp.localizerObj);
    SliderPuzzleApp.photosPageObj = new PhotosPage(SliderPuzzleApp.localizerObj);

    addClickListeners(SliderPuzzleApp);

    resize();

    $(window).bind('resize', resize);
  };

  window.addEventListener('load', function () {
    init();
  });

})();
