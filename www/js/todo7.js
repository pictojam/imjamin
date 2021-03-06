// Initialize your app
var myApp = new Framework7({
    modalTitle: 'ToDo7'
});



var status_obj = {};

// Export selectors engine
var $$ = Dom7;

// Add views
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true

});

var todoData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];

var status;

$$('.popup').on('open', function () {
    $$('body').addClass('with-popup');
});
$$('.popup').on('opened', function () {
    $$(this).find('input[name="title"]').focus();
});
$$('.popup').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="title"]').blur().val('');
});

// Popup colors
$$('.popup .color').on('click', function () {
    $$('.popup .color.selected').removeClass('selected');
    $$(this).addClass('selected');
});

$('body').on('click', '.done.prompt-ok', function () {
    var number = $('#mobile').val();
    if( number == ''){
        myApp.alert('Please enter your mobile number in order to proceed.');   
        return false;           
    }
    else{
         var type = 'sign_in';
        $('input[type="radio"]').each(function(){
             var checkbox = $(this).is(':checked');
            if(checkbox){ num_code = $(this).val(); }
        });


        var mobile = num_code + number; 
        var data = {type:type, mobile:mobile};  
            ajaxCall(data);
            verification_code(mobile);
    }
});

function verification_code(mobile){
    console.log(mobile);
    myApp.prompt('Please enter the verification code sent to your device via SMS.', function (value) {
            var type = "verify";
            var code = value;
            data = {type:type, code:code, mobile:mobile};
            ajaxCall(data); 
        });
}


// Add Task
$$('.popup .add-task').on('click', function () {
    var title = $$('.popup input[name="title"]').val().trim();
    if (title.length === 0) {
        return;
    }
    var color = $$('.popup .color.selected').attr('data-color');
    todoData.push({
        title: title,
        color: color,
        checked: '',
        id: (new Date()).getTime()
    });
    localStorage.td7Data = JSON.stringify(todoData);
    buildTodoListHtml();
    myApp.closeModal('.popup');
});

$$('.toolbar .link').on('click', function () {
    $('.toolbar .link').removeClass('active');
    $(this).addClass('active');
});


// Build Todo HTML using Template7 template engine
var todoItemTemplateSource = $$('#todo-item-template').html();
var todoItemTemplate = Template7.compile(todoItemTemplateSource);
function buildTodoListHtml() {
    var renderedList = todoItemTemplate(todoData);
    $$('.todo-items-list').html(renderedList);
}
// Build HTML on App load
buildTodoListHtml();

// Mark checked
$$('.todo-items-list').on('change', 'input', function () {
    var input = $$(this);
    var item = input.parents('li');
    var checked = input[0].checked;
    var id = item.attr('data-id') * 1;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) todoData[i].checked = checked ? 'checked' : '';
    }
    localStorage.td7Data = JSON.stringify(todoData);
});

// Delete item
$$('.todo-items-list').on('delete', '.swipeout', function () {
    var id = $$(this).attr('data-id') * 1;
    var index;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) index = i;
    }
    if (typeof(index) !== 'undefined') {
        todoData.splice(index, 1);
        localStorage.td7Data = JSON.stringify(todoData);
    }
});

$('body').on('keypress', 'input[type="search"]', function(){
   console.log('search');
   var type = 'search_library';
   var keyword = $(this).val();
   var data = {type:type, keyword:keyword}
   ajaxCall(data);
});

$('body').on('click', '.status', function(){
    status = $(this).attr('data-user');
});



myApp.onPageAfterAnimation("home", function(){
   var type = "get_contacts";
   var data = {type:type}; 
    ajaxCall(data);
});


myApp.onPageAfterAnimation("user_status", function(){
   var type = "get_user_status";
   var data = {type:type}; 
    ajaxCall(data);
});





myApp.onPageAfterAnimation("status", function(){
   var type = "get_status";
   var data = {type:type, status:status}; 
    ajaxCall(data);
});



myApp.onPageInit("clip", function(page){
  var type = "get_track";
  var data = {type:type, page: page.url};
       ajaxCall(data);
});





    function ajaxCall(data){

       var postData = data;
     
       // console.log(postData);
       $.ajax({
          url: 'http://54.69.118.223/server/server.php',
          type: 'POST',
          data: postData,
          dataType: 'JSON',
          cache: false,
          beforeSend:function(){
             $('.loader-gif').show();
          },
          success: function(data){
              $('.loader-gif').hide();
             // console.log(data);
              eval(data.function)(data);
              // $('.media-list ul').html(data);
        
              // if(postData.type == 'verify'){
              //   if(data == 'success'){ 
              //       myApp.alert('Thank you for registering. Login?', function(){
              //              mainView.router.loadPage('http://54.69.118.223/imjamin/www/register.html');
              //      });
              //   }
              //   else{ myApp.alert('There was an error with your code! Try again.', function () {
              //              verification_code(postData.mobile);
              //       });  
              //   }
              //  }
          }
     
       }); 

    }

    function status_complete(data){
       mainView.router.loadPage('user_status.html');
    }

    function success(){
        console.log('success');
        mainView.router.loadPage('home.html');
    }
    
   


    function load_contacts(data){
           // Wait for Cordova to load
    //

    // Cordova is ready
    //
        // find all contacts with 'Bob' in any name field
        var options = new ContactFindOptions();
        navigator.contacts.find(
        ["*"], 
        onSuccess, 
        onError);

    // onSuccess: Get a snapshot of the current contacts
    //
    function onSuccess(contacts) {
        for (var i=0; i<contacts.length; i++) {
           
          if (contacts[i].phoneNumbers != null) {
              $.each(contacts[i].phoneNumbers, function(i ,v){
                    $.each(v, function(e, f){
                           

                          if (e == 'value') {
                              var number = f.replace(/-|\s/g,""); 
                              console.log(number);

                          }
                    });
              });
                   
                 
          }

        }
    }

    // onError: Failed to get the contacts
    //
    function onError(contactError) {
        alert('onError!');
    }

          $('.media-list ul').empty();
           $.each(data, function(index, value){
             console.log(value);
                    var status_user_id = value.status.user_id;
                    var status_quote = value.status.status;
                    var user_avatar = value.user.avatar;

                    var user_name = value.user.name;
                    var artist = value.track_info.artist;
                    var song = value.track_info.song;
                    
                    var iphone = "";  

                    if (user_avatar.indexOf("iphone") >= 0){
                             var iphone = "iphone";
                    }else{
                      iphone = "";
                    }

                    $('.media-list ul').append("<li>"+
                         "<a href='status.html' data-user='"+ status_user_id +"' class='item-link status item-content'>"+
                            " <div class='item-media "+ iphone +"' >" +
                                  "<img src='"+ user_avatar +"' width='60'  />" +
                             "</div>" +
                             "<div class='item-inner'>" +
                              "<div class='item-title-row'>" +
                                 "<div class='item-title'>"+ user_name +"</div>" +
                                 "<div class='item-after'> </div>" +
                              "</div>" +
                                  "<div class='item-subtitle'>Listening to <strong style='color:#73358B; font-size:15px;'>"+ song +"</strong> by <em>"+ artist +"</em></div>" +
                                  "<div class='item-text' style='line-height:120%; font-size:13px;'>"+ status_quote +"</div>" +
                             "</div>" +
                        "</a>" +
                    "</li>");    
           });    

      
    } 
    function load_search(data){
     console.log(data);
    $('.media-list.results ul').empty();
    $.each(data, function(index, value){
    var song = value.info.song;
    var artist = value.info.artist;
    var album = value.info.Album;
    var cover = value.info.cover;

    var id = value.info.id;
    $('.media-list.results ul').append("<li>" +
                "<a href='clip.html?t_id="+ id +"'  class='item-link media item-content'>"+
                " <div class='item-media'>" +
                              "<img src='"+ cover +"' width='60' />" +
                         "</div>" +
                         "<div class='item-inner'>" +
                          "<div class='item-title-row'>" +
                             "<div class='item-title'>"+ artist +"</div>" +
                             "<div class='item-after'> </div>" +
                          "</div>" +
                              "<div class='item-subtitle'><strong style='color:#73358B; font-size:15px;'>"+ song +"</strong></div>" +
                              "<div class='item-text' style='line-height:120%; font-size:13px;'>"+ album +"</div>" +
                         "</div>" +
                    "</a>" +
                "</li>");


    });
    }

    function load_status(data) {

        console.log(data);
        $('.loader-gif').show();
        var status = data.status_info.status;
        var track = 'http://54.69.118.223/media/' + data.track_info.file;
        var cover = data.track_info.cover;
        var song = data.track_info.song;
        var artist = data.track_info.artist;
        var album = data.track_info.Album;
        var avatar = data.user.avatar;
        var name = data.user.name;
        var start_time = parseInt(data.status_info.start);
        var end_time = parseInt(data.status_info.stop);

        var duration = (end_time - start_time) * 1000;     

        $('.status .content-block').html('<div class="upper">' +
        '<div class= "avatar left"><img src="'+ avatar +'" height="60" /><span class="u_name">'+ name +'</span></div>' +
        '<div class= "status right"><blockquote>'+ status +'</blockquote></div>' +                                      
        '</div>' +
        '<div class="bottom">'+
        '<div class="cover" style="background-image:url('+ cover +')">'+
               '<audio id="track"></audio>'+
             '<div class="pace hidden"><div class="pace-progress" style="transition: width '+ duration + 'ms linear;-webkit-transition: width '+ duration + 'ms linear;"> </div></div>'+
             '<div class="play_button icon icon-play " style="display:none;"></div>'+
        '</div>'+
        '<div class="track_info">' +
            '<div class="album">Album: '+ album +'</div>'+
            '<div class="song">Track: "'+ song +'"</div>'+
            '<div class="artist">Artist: '+ artist +'</div>'+
         '</div>'+  
        '</div><div class="wave-container" style="display:none;"><div id="waveform"></div></div>'); 
         

         $('#user_status .cover').append('<a href="edit_status.html" class="button edit-status">Edit Status</a>');
         var wavesurfer = Object.create(WaveSurfer);

          wavesurfer.init({
              container: '#waveform',
              waveColor: '#310D55',
              progressColor: 'purple'
          });
                                  
          wavesurfer.on('ready', function () {
              $('.loader-gif').hide();
              $('.play_button').show();
               wavesurfer.clearRegions();
               wavesurfer.addRegion({'start': start_time, 'end': end_time });
              $('wave > wave').remove();
               wavesurfer.play();
               wavesurfer.pause();
          });


          wavesurfer.on('play', function () {
               console.log('playing');
          });


           wavesurfer.load(track);

           $('.play_button').on('click', function(e){
                $('.play_button').hide();
                $('.pace').show();

                e.preventDefault();
                // $('.pace').show();
                // $('#track')[0].currentTime = start_time;
                // $('#track')[0].play();

                // var audio = document.getElementById('track');
                // audio.play();
                // // Sometime Later
                // audio.src = 'http://54.69.118.223/media/'+ track;
                // audio.addEventListener('canplay', function(){
                  
                //      audio.currentTime = start_time;
                //      audio.play();
                // }, false);

                // audio.addEventListener('playing', function(){
                //     $('.loader-gif').hide();
                //     $('.pace-progress').addClass('go');
                //         setTimeout(function(){
                //         $('.play_button').show();
                //         $('.pace').hide();
                //         $('.pace-progress').removeClass('go');
                //           audio.pause();
                //         }, duration);
                // }, false);

                setTimeout(function () {wavesurfer.play(start_time, end_time); $('.pace-progress').addClass('go'); }, 500);
        });
    }


    function load_track (data) {
        console.log(data);
        $('.loader-gif').show();
        var start, end;
        var track = 'http://54.69.118.223/media/' + data.track.file;

        var track_id = parseInt(data.track.id);
        var wavesurfer = Object.create(WaveSurfer);
       

        wavesurfer.init({
           container: '#waveform',
           waveColor: '#310D55',
           progressColor: 'purple'
        });

       

        wavesurfer.load(track);
        



        $('#waveform').bind('touchstart touchmove' , function(e) {

        e.preventDefault();

        wavesurfer.play();
        wavesurfer.pause();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        //CODE GOES HERE
        console.clear();
        var wrapper_width = $('#waveform').width();  
        var dur = wavesurfer.getDuration();
        var pageX = touch.pageX; 
        var ratio = (pageX/wrapper_width);
     

        var wrap_width = $('#waveform').offset().left;
        var start = (dur * ratio) - (wrap_width); 
        var end = start + 20;

        wavesurfer.clearRegions();
        wavesurfer.addRegion({'start': start, 'end': end, 'drag' : true, 'color' : "rgba(0, 0, 0, 0.3)"});
            $('.proceed.text').fadeOut(function(){
               $('#proceed').attr('id', 'play-back');
               $('.play.text').delay(500).fadeIn();   
            });
          
        
        });


        $('body').on('touchstart', '#play-back', function(){
             $('.play.text').fadeOut(function(){
                $('#play-back').attr('id', 'proceed');  
                $('.proceed.text').delay(500).fadeIn();    
              });       
    
              var start, end; 
              $.each(wavesurfer.regions.list, function(index, value){
                start =  value.start;
                end =  value.end;
              });

              wavesurfer.play(start, end);
        });

         $('body').on('touchstart', '#proceed', function(){
              var start, end; 
              $.each(wavesurfer.regions.list, function(index, value){
                  start =  value.start;
                  end =  value.end;
              });
                status_obj = { track_id:track_id, start:start, end:end};
                mainView.router.loadPage('set_status.html');
               
          });
      
        $('body').on('click', '#status-done', function(){
              var type = 'set_status';
              var status = $('textarea.status-input').val();
              status_obj['type'] = type;
              status_obj['status'] = status;
              var data = status_obj;
              console.log(data);
              ajaxCall(data);

        });
           

    }
     
    function load_user_status(data){
          load_status(data);
      
    }

    function load_new_status(data){
      mainView.router.loadPage('new_status.html');
    }

// Update app when manifest updated 
// http://www.html5rocks.com/en/tutorials/appcache/beginner/
// Check if a new cache is available on page load.
window.addEventListener('load', function (e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            myApp.confirm('A new version of ToDo7 is available. Do you want to load it right now?', function () {
                window.location.reload();
            });
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
}, false);

