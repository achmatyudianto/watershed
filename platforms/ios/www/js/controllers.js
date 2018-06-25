var tempGambar = null;

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicActionSheet, $cordovaCamera) {
    $scope.pictureUrl = 'img/no-image.png';
    tempGambar = $scope.pictureUrl;
    console.log($scope.pictureUrl);

    $scope.takeCamera = function () {
        $scope.takePicture(Camera.PictureSourceType.CAMERA);
    }

    $scope.takeGallery = function () {
        $scope.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
    }

    $scope.show = function () {
        console.log("iki ActionSheet");
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {text: '<i class="icon ion-camera"></i>Camera'},
                {text: '<i class="icon ion-image"></i>Gallery'}
            ],
            titleText: 'Choose one',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                console.log(index);
                hideSheet();
                switch (index) {
                    case 0:
                        $scope.takePicture(Camera.PictureSourceType.CAMERA);
                        break;
                    case 1:
                        $scope.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
                        break;
                }
                return index;
            }
        });
    };

    $scope.takePicture = function (type) {
        var options = {
            // destinationType: Camera.DestinationType.DATA_URL/FILE_URL,
            // encodingType: Camera.EncodingType.JPEG
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: type,
            saveToPhotoAlbum: false,
            targetWidth: 500,
            targetHeight: 500
        };

        $cordovaCamera.getPicture(options).then(
                function (data) {
                    console.log('camera data: ' + angular.toJson(data));
                    $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
                    tempGambar = $scope.pictureUrl;
                    //console.log('gambar e :'+ $scope.pictureUrl);
                    if ($scope.pictureUrl == "" || $scope.pictureUrl == 'img/woman.jpg') { //pict "" or same = btn_pros hiden
                        angular.element(document.querySelector("#proccess_btn")).addClass('hidden');
                        //createOverlay();
                    } else {
                        angular.element(document.querySelector("#proccess_btn")).removeClass('hidden');
                       // angular.element(document.querySelector("#proccess_btn")).addClass('hidden');

                    }
                },
                function (error) {
                    console.log('camera error: ' + angular.toJson(data));
                }
        );
    };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
