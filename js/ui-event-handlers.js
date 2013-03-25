$(document).ready(function () {

  window.addClickListeners = function (app) {
    // map DOM element ID to click handler
    var clickListeners = {
      'mpQuickStartS': app.startRandomGame,
      'mpLeaderBoardS': app.leaderBoard,
      'mpChoosePhotoS': app.photosPage,
      'helpButton': app.helpClicked,
      'puzzleContainer': app.pausePopout,
      'qsPause': app.pausePopout,
      'qsInfo': app.newPopout,
      'qsPopupScoresTableCellEasy': function () {
        app.newPopoutObj.switchDifficulty('1');
      },
      'qsPopupScoresTableCellHard': function () {
        app.newPopoutObj.switchDifficulty('2');
      },
      'qsPopupScoresTableCellBrutal': function () {
        app.newPopoutObj.switchDifficulty('3');
      },
      'qsNpPlayAgain': app.playAgain,
      'qsNpNewPhoto': app.newPhoto,
      'qsNpClose': app.closePopout,
      'qsPpClose': app.closePausePopout,
      'qsPpLeaderBoard': app.leaderBoardPause,
      'qsFpSaveResultS': app.saveResult,
      'qsFpCloseResultS': app.closeFinishNoSave,
      'lbMoves': function () {
        app.leaderBoardPageObj.switchView();
        return false;
      },
      'lbTimes': function () {
        app.leaderBoardPageObj.switchView();
        return false;
      },
      'lbCloseButton': app.closeLeaderBoard,
      'lbPopUpPlayButton': app.startGameLb,
      'lbPopUpCloseButton': app.closeLeaderBoardPagePopup,
      'ppGame': function () {
        app.photosPageObj.switchView();
        return false;
      },
      'ppCloseButton': app.closePhotosPage,
      'ppPopUpPlayButton': function () {
        app.startGame(2);
      },
      'ppPopUpCloseButton': app.closePhotosPagePopup,
      'closeHelpButton': app.closeHelp
    };

    for (var id in clickListeners) {
      document.getElementById(id)
              .addEventListener('click', clickListeners[id]);
    }
  };
});
