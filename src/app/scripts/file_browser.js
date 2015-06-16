"use strict";

var file_browser = angular.module('dttv.file_browser', []);

file_browser.config(function($routeProvider){
	$routeProvider
		.when('/file_browser', {
    	templateUrl : 'views/file_browser.html',
    })
});

var file_browser_controller = file_browser.controller('file_browser_controller', ['$scope', '$routeParams',function ($scope, $routeParams) {
		//--------------------------------
		$scope.cur ={};
		$scope.cd = function(){

		}

		// get file list and bind to html element
		bind_files();
		//--------------------------------
}]);


global.$ = $;
var abar = require('address_bar');
var folder_view = require('folder_view');
var nwGui = require('nw.gui');

// append default actions to menu for OSX
var initMenu = function () {
  try {
    var nwGui = require('nw.gui');
    var nativeMenuBar = new nwGui.Menu({type: "menubar"});
    if (process.platform == "darwin") {
      nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("FileExplorer");
    }
    nwGui.Window.get().menu = nativeMenuBar;
  } catch (error) {
    console.error(error);
    setTimeout(function () { throw error }, 1);
  }
};

var App = {
  // show "about" window
  about: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 120, width: 350};
    var aboutWindow = nwGui.Window.open('views/about.html', params);
    aboutWindow.on('document-end', function() {
      aboutWindow.focus();
      // open link in default browser
      $(aboutWindow.window.document).find('a').bind('click', function (e) {
        e.preventDefault();
        nwGui.Shell.openExternal(this.href);
      });
    });
  },
  play: function (path) {
    var uri = path;
    var params = {toolbar: false, resizable: false, show: true, height: 480, width: 720};

    var playWindow = nwGui.Window.open('play.html', params);
    playWindow.on('document-end', function() {
      playWindow.focus();
    });
    location.href="play.html";
    var video_path=document.getElementById("video_path");
    video_path.text("Hello");
    $('p').text('world');

    wGui.Window.get().onload() = function () {
      $('p').text('world');
    };

  },
  // change folder for sidebar links
  cd: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setPath(anchor.attr('nw-path'));
  },

  // set path for file explorer
  setPath: function (path) {
    if (path.indexOf('~') == 0) {
      path = path.replace('~', process.env['HOME']);
    }
    this.folder.open(path);
    this.addressbar.set(path);
  }
};

var bind_files = function() {
  //initMenu();

  var folder = new folder_view.Folder($('#files'));
  var addressbar = new abar.AddressBar($('#addressbar'));

  folder.open(process.cwd());
  addressbar.set(process.cwd());

  App.folder = folder;
  App.addressbar = addressbar;

  folder.on('navigate', function(dir, mime) {
    if (mime.type == 'folder') {
      addressbar.enter(mime);
    } else {
      //Here to locate playing html
      //nwGui.Shell.openItem(mime.path);
      App.play(mime.path)
    }
  });

  addressbar.on('navigate', function(dir) {
    folder.open(dir);
  });

  // sidebar favorites
  $('[nw-path]').bind('click', function (event) {
    event.preventDefault();
    App.cd(this);
  });
}