
   
    function getImage() {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(uploadPhoto, function(message) {
        alert('get picture failed');
    },{
        quality: 50, 
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    }
        );

    }

    function uploadPhoto(imageURI) {
        $('#register #message').empty();
        $('.col-25').show();
        var options = new FileUploadOptions();
        options.fileKey="avatar";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload(imageURI, "http://54.69.118.223/server/upload.php", win, fail, options);
    }

    function win(r) {

        $('.col-25').hide();
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        $('#register #message').append(r.response);
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
    }

      


    
    
   