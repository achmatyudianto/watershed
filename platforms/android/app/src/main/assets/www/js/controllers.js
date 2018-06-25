var tempGambar = null;

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicActionSheet, $cordovaCamera) {
    $scope.pictureUrl = 'img/sel-darah.png';
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
                {text: '<i class="icon ion-camera"> Camera</i>.'},
                {text: '<i class="icon ion-image"> Gallery</i>.'}
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

.controller('cameraCtrl', function ($scope, $cordovaCamera, $ionicActionSheet, $timeout) {
    console.log('ikiCameraCtrl');
    $scope.pictureUrl = tempGambar
    $scope.textOverlay = ""
    $scope.createOverlay = function () {
        var canvas = document.getElementById('process_tempCanvas1');

        var context = canvas.getContext('2d');

        // Create Image
        var tempImage = new Image();
        tempImage.src = $scope.pictureUrl;
        console.log('tempImage');
        console.log(tempImage);

        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        
        // Create Canvas
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = tempImage.width;
        tempCanvas.height = tempImage.height;
        console.log('tempCanvas');
        console.log(tempCanvas);
        // // get Canvas Context
        // var tempContext = tempCanvas.getContext("2d");
        // tempContext.drawImage(tempImage, 0, 0);
        // console.log('tempContext');
        // console.log(tempContext);
        // // Calculate Padding
        // var imagePaddingX = (tempCanvas.width - canvas.width) / 2;
        // console.log("imagePaddingX");
        // console.log(imagePaddingX);
        // var imagePaddingY = (tempCanvas.height - canvas.height) / 2;
        // console.log("imagePaddingY");
        // console.log(imagePaddingY);
        context.drawImage(
                tempImage, 0, 0, tempCanvas.width, tempCanvas.height,
                0, 0, canvas.width, canvas.height);
        // Get the CanvasPixelArray from the given coordinates and dimensions.
    };

    $scope.getAvgRgb = function (img) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var width = canvas.width = img.naturalWidth || img.width;
        console.log(width);
        var height = canvas.height = img.naturalHeight || img.height;
        console.log(height);
        try {
            ctx.drawImage(img, 0, 0);
        } catch (e) {
            console.log(e);
        }
        var imageData = ctx.getImageData(0, 0, width, height);
        var data = imageData.data;
        var r = 0;
        var g = 0;
        var b = 0;
        var jarakPx = 4;
        for (var i = 0, l = data.length; i < l; i += jarakPx) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        r = Math.floor(r / (data.length / jarakPx));
        g = Math.floor(g / (data.length / jarakPx));
        b = Math.floor(b / (data.length / jarakPx));

        return {r: r, g: g, b: b};
    };

    $scope.getWarna = function (id) {
        var rgb = $scope.getAvgRgb(document.getElementById(id));
        console.log('iki rgb')
        console.log(rgb);
        //document.getElementById(bgid).style.backgroundColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        // document.getElementById('r').innerHTML = 'R : ' + rgb.r;
        // document.getElementById('g').innerHTML = 'G : ' + rgb.g;
        // document.getElementById('b').innerHTML = 'B : ' + rgb.b;
        var hsv = convert(rgb.r, rgb.g, rgb.b);
        console.log(hsv);
        // var hsv = convert(133, 118, 117);
        // document.getElementById('h').innerHTML = 'H : ' + hsv.h.toFixed(2);
        // document.getElementById('s').innerHTML = 'S : ' + hsv.s.toFixed(2);
        // document.getElementById('v').innerHTML = 'V : ' + hsv.v.toFixed(2);
//        
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
