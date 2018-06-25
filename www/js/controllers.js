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

    $scope.getRgb = function (id) {
        console.log('iki GetRgb')
        var rgb = $scope.getAvgRgb(document.getElementById(id));
        console.log('iki rgb');
        console.log(rgb);
        // var hsv = convert(rgb.r, rgb.g, rgb.b);
        // console.log(hsv); 
    };

    $scope.getGrayscale = function(){
      console.log('iki grayscale');
      var img = new Image();
          img.src = $scope.pictureUrl;
      console.log(img);
      var canvas = document.getElementById('process_tempCanvas1');
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
      var imagePixels = ctx.getImageData(0, 0, width, height);

      for (var i = 0; i < imagePixels.height; i++){
        for (var j = 0; j < imagePixels.width; j++){
          var x = (i * 4) * imagePixels.width + j * 4;
          var avg = (imagePixels.data[x] + imagePixels.data[x + 1] + imagePixels.data[x + 2]) / 3;

          imagePixels.data[x] = avg;
          imagePixels.data[x + 1] = avg;
          imagePixels.data[x + 2] = avg;

          if (imagePixels.data[x] > 155){
            imagePixels.data[x] = 300;
          } else {
            imagePixels.data[x] = 0;
          }

          if (imagePixels.data[x + 1] > 155) {
            imagePixels.data[x + 1] = 300;
          } else {
            imagePixels.data[x + 1] = 0;
          }

          if (imagePixels.data[x + 2] > 155) {
            imagePixels.data[x + 2] = 300;
          } else {
            imagePixels.data[x + 2] = 0;
          }
        }
      }
    console.log("iki image pixcel ");
    console.log(imagePixels);

    return ctx.putImageData(imagePixels, 0, 0, 0, 0, imagePixels.width, imagePixels.height);
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
