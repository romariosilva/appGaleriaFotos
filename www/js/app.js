// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

//Mudar a posisão das tabs, indepedente da plataforma
.config(function($ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom');
})

//Directive será chamada na Tag <filter-bar> tendo como referencia o filterBar
.directive("filterBar", function(){
  return {
    //E informa que pegará a tag <filter-bar> referenciando para a url abaixo.
    restrict: "E",
    templateUrl: "components/filter-bar.html"
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//Controle utilizado somente na tab HOME
.controller("HomeController", function($scope, FileUtil, $ionicModal){
  ionic.Platform.ready(function(){
    FileUtil.load();
    $scope.images = FileUtil.images;
  })

  $ionicModal.fromTemplateUrl("image-modal.html", {
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal){
    $scope.modal = modal;
  })

  $scope.showModal = function(image){
    $scope.imageModal = image;
    $scope.modal.show();
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
  }
})

//Controle utilizado somente na tab Camera
.controller('CameraController', function($scope, ImageUtil, FileUtil, $ionicTabsDelegate){
  //Função será ativado quando a aba camera for selecionado
  $scope.onTabSelect = function(){
    //Para sempre limpar a imagem, se tirar a imagem ele trás a imagem, caso não, não irá trazer nenhuma foto.
    $scope.imageCamera = undefined;

    ImageUtil.getImage(ImageUtil.cameraOptions.CAMERA, function(imageData){
      console.log("sucesso");
      $scope.imageCamera = "data:image/jpeg;base64, "+ imageData;
      ImageUtil.filterImage("imageCamera", 0);
    },
    function(err){
      console.log(err);
      $ionicTabsDelegate.select(0); 
    });
  }

  //Funcção chamada ao clicar nos botões dos filtros
  $scope.onFilter = function(option){
    ImageUtil.filterImage("imageCamera", option)
  }

  $scope.onSave =  function(){
    var canvas = document.getElementById("imageCamera");
    var dataUrl = canvas.toDataURL();
    FileUtil.save(dataUrl);
    $ionicTabsDelegate.select(0);
  }
})

//Controle utilizado somente na tab Gallery
.controller('GalleryController', function($scope, ImageUtil, FileUtil, $ionicTabsDelegate){
  //Função será ativado quando a aba gallery for selecionado
  $scope.onTabSelect = function(){
    //Para sempre limpar a imagem, se tirar a imagem ele trás a imagem, caso não, não irá trazer nenhuma foto.
    $scope.imageGallery = undefined;

    ImageUtil.getImage(ImageUtil.cameraOptions.GALLERY, function(imageData){
      console.log("sucesso");
      $scope.imageGallery = "data:image/jpeg;base64, "+ imageData;
      ImageUtil.filterImage("imageGallery", 0);
    },
    function(err){
      console.log(err);
      $ionicTabsDelegate.select(0); 
    });
  }

  //Funcção chamada ao clicar nos botões dos filtros
  $scope.onFilter = function(option){
    ImageUtil.filterImage("imageGallery", option)
  }

  $scope.onSave =  function(){
    var canvas = document.getElementById("imageGallery");
    var dataUrl = canvas.toDataURL();
    FileUtil.save(dataUrl);
    $ionicTabsDelegate.select(0);
  }    
})