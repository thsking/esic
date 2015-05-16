'use strict';

/* Controllers */



myApp.controller('appCtrl', function($scope, $location, $http){


    // Verifiy if user is connected 
    checkUserIsConnect();

    var backInfo = [];






    // Se tsome useful var 
    $scope.annonceId; $scope.profilId;


    // Hundle page changement
	$scope.$on('$routeChangeSuccess', function(){


        // set the active page to local url
		$scope.activePage = $location.url();

        // go top with main
        angular.element('main').scrollTop(0);

        // set page name
        var pages = {
            '/users-list' : 'Alentours',
            '/messages-list' : 'Messages',
            '/annonces-list' : 'Annonces',
            '/annonce' : 'Annonce',
            '/new-annonce' : 'Nouvelle annonce',
            '/profil': 'Profil',
            '/message': 'Message',
            '/connect': 'Connect',
            '/edit-profil': 'Éditer mon profil',
            '/gestion-annonces': 'Mes annonces'
        };

        $scope.activePageName = pages[$scope.activePage];



        if(Object.keys(backInfo).length>0){

            var i = backInfo.length,
                idBack = backInfo.length-1;

            while(backInfo[idBack] == undefined){
                idBack = idBack -1;
            }

            if($scope.activePage != backInfo[idBack]['page']){

                if($scope.activePage == '/annonce'){

                    backInfo[i] = {
                        'page':$scope.activePage,
                        'id':$scope.annonceId
                    }

                }else if($scope.activePage=='/profil'){
                    backInfo[i] = {
                        'page':$scope.activePage,
                        'id':$scope.profilId
                    }
                }else{
                    backInfo[i] = {
                        'page':$scope.activePage
                    }
                }

            }



        }else{
            backInfo[0] = {
                'page':$scope.activePage
            }
        }

	});





    // set var of header element   
    $scope.filterOpen = false;
    $scope.menuOpen = false;


    jQuery(window).on('hashchange', function(){
        
        if($scope.filterOpen){
            $scope.filterOpen = false;
        }
        if($scope.menuOpen){
            $scope.menuOpen = false;
        }
    })


    $scope.instruments = [
        { id:0, name: 'Voix'},
        { id:1, name: 'Guitare'},
        { id:2, name: 'Piano'},
        { id:3, name: 'Saxophone'},
        { id:4, name: 'Compositeur'}
    ];


    $scope.musicStyles = [
        { id:0, name: 'Classic'},
        { id:1, name: 'Pop/Rock'},
        { id:2, name: 'Hip-hop/Rap'},
        { id:3, name: 'Variété'},
        { id:3, name: 'Électro'},
        { id:4, name: 'Jazz'}
    ];

            
    $scope.instrumentSelected = 'Instrument';
    $scope.musicStyleSelected = 'Style Musical';

    $scope.filterInstrumentUpdate = function(){

        if($scope.filterInstrument == '' 
            || $scope.filterInstrument == null ){

            $scope.instrumentSelected = 'vide';

        }else{

            $scope.instrumentSelected = 
                $scope.filterInstrument.name;

        }
             
    }

    $scope.filterMusicStyleUpdate = function(){

        if($scope.filterMusicStyle == '' 
            || $scope.filterMusicStyle == null ){

            $scope.musicStyleSelected = 'vide';

        }else{

            $scope.musicStyleSelected = 
                $scope.filterMusicStyle.name;

        }
             
    }


    // toggle var
    $scope.filterToggle = function(){

        if($scope.filterOpen){

            $scope.filterOpen = false;

        }else{

            $scope.filterOpen = true;

        }

    }
    $scope.menuToggle = function(){

        if($scope.menuOpen){
            $scope.menuOpen = false;
        }else{
            $scope.menuOpen = true;
        }

    }
    $scope.menuClose = function(){
    	$scope.menuOpen = false;
    }


    $scope.goto = function(location){
        
        window.location.href='#'+location;

    }


    $scope.editAnnonceId = function(id){
        $scope.annonceId = id;
    };

    $scope.editProfilId = function(id){
        $scope.profilId = id;
        
    }

    $scope.editConversId = function(id){
        $scope.conversId = id;
    }

    $scope.changePageName = function(name){
        $scope.activePageName = name;
    }


    $scope.userIsConnect = function(){
        var user = cookieGet('user');
        var sc_user = cookieGet('sc_user_cookie');

        user = JSON.parse(user);
        sc_user = JSON.parse(sc_user);

        // if user cookie  exist
        if(user){
            return true;
        }else{
            return false;
        }
    }

    function checkUserIsConnect(){

        var user = cookieGet('user');
        var sc_user = cookieGet('sc_user_cookie');

        user = JSON.parse(user);
        sc_user = JSON.parse(sc_user);

        // if user cookie  exist
        if(!user){ 

            $http.get('php/connect.php').
                success(function(data){

                    if(data.do=='connection'){
                        
                        cookiePut('user', JSON.stringify(data.user));
                        


                    }else if(data.do=='inscription'){

                        cookiePut('user', JSON.stringify(data.user));
                        

                    }else{
                        window.location.href = "./";
                    }
                }).
                error(function(){
                    
                });

        }
        else if(user['Name']=='Visitor'){
            
            jQuery(".show-visitor.visitor-message .btn-cancel").
                click(function(){
                   jQuery(".show-visitor.visitor-message").removeClass("show") ;
                })

        }else if(user['ID']!=''){
            jQuery(".show-visitor").hide();
        }

    }

    $scope.isTheSame= function(a,b){
        if(a==b){
            return true;
        }else{
            return false;
        }
    }

    $scope.logout = function(){
        cookieRemove('user');
        cookieRemove('sc_user_cookie');
        window.location.href = "./";
    }

    $scope.clearBackInfo = function(){
        backInfo = [];
    }

    $scope.goBack = function(){

        var idBack = Object.keys(backInfo).length-2;

        while(backInfo[idBack] == undefined || backInfo[idBack]['page']==$scope.activePage){
            idBack = idBack -1;
        }

        delete backInfo[Object.keys(backInfo).length-1];

        window.location.href = '#'+backInfo[idBack]['page'];

    }



    $scope.openMessage = function(id){

        var user = JSON.parse(cookieGet('user'));

        if(id != undefined){
            if(user['Name']!='Visitor'){
                $.get('php/get-conversations.php?userAId='+user['ID']+'&userBId='+id)
                    .success(function(conversId){

                        $scope.editConversId(conversId);
                        window.location.href = "#message";

                    })
            }
        }

        

        if(user['Name']=='Visitor'){
            visitorShowMessage();
        }
    }


    function visitorShowMessage(){
        jQuery(".show-visitor.visitor-message")
            .addClass("show");
    }

    $scope.classInstrument = function(instrument){
        var out = '';
        if(
            instrument=='Piano' ||
            instrument=='Guitare' ||
            instrument=='Saxophone'
            )
        {

            out = instrument.toLowerCase();

        }else if( instrument == 'Voix'){

            out = 'voice';

        }else if( instrument == 'Compositeur'){

            out = 'song-writer'
        }

        return out;
    }

})




myApp.run(function ($rootScope, $location, $route, $timeout){


    $rootScope.layout = {};
    $rootScope.layout.loading = false;

    $rootScope.$on('$routeChangeStart', function () {

        //show loading gif
        $timeout(function(){
          $rootScope.layout.loading = true;
        });


    });
    $rootScope.$on('$routeChangeSuccess', function () {

        //hide loading gif
        $timeout(function(){
          $rootScope.layout.loading = false;
        }, 200);
    });
    $rootScope.$on('$routeChangeError', function () {

        //hide loading gif
        window.location.href = "./esic.html"
        // $rootScope.layout.loading = false;

    });

})




myApp.controller('profilCtrl', ['$scope','$http', function($scope,$http){

    $scope.getNumber = function(num) {
        return new Array(num);   
    }

    var user = cookieGet('user');
    user = JSON.parse(user);

    $scope.user = user;







    var userTracks = [];
    $scope.songsToPlay = [];

    if($scope.profilId != undefined && $scope.profildId != ''){

        $http.get('php/get-users.php?to=only&userId='+$scope.profilId+'&pos='+user['Last_Position'])
            .success(function(data){

                $scope.profil = data;
                $scope.changePageName(data.Name);
                

                SC.get('/users/'+data.ID_Soundcloud+'/tracks', function(tracks,error){
                    if(error){
                        
                    }else{
                        var i = 0;
                        if(tracks != null){
                            jQuery(".no-song").addClass('hide');
                            while(i<tracks.length){

                                var artwork;


                                if( tracks[i].artwork_url != null ){

                                    artwork = tracks[i].artwork_url;

                                }else{

                                    artwork = './img/artwork_empty.jpg';

                                }

                                userTracks[i] = {
                                    'id':tracks[i].id,
                                    'title':tracks[i].title,
                                    'artwork':artwork
                                }
                                i++;

                            }

                            var max_song = 3;
                            i = 0;

                            // 

                            if(userTracks.length<3){
                                max_song = userTracks.length;
                            }


                            while(i<max_song){
                                $scope.songsToPlay[i] = userTracks[i];
                                i++;    
                            }

                        }

                    }
                })

        });

    }else{
        window.location.href = '#users-list';
    }




    

    $scope.songIsPlayed = {
        'played':false,
        'id_song':'',
        'index':''
    }

    $scope.$on('$destroy', function(){
        
        $scope.songIsPlayed = {
            'played':false,
            'id_song':'',
            'index':''
        }

        if(typeof soundManager != 'undefined'){
            streamStopAll();            
        }

    })

    $scope.play = function(index, id_song){

        if( $scope.songIsPlayed['played'] ){

            if(id_song!=$scope.songIsPlayed['id_song']){

                streamStopAll();

                stream(index, id_song);

            }else{

                streamStopAll();

            }


        }else{
            
            stream(index, id_song);

        }

    }

    var stream = function(index, id_song){

    

        SC.stream('/tracks/'+id_song, {
                autoPlay:true,
                whileplaying: function(){
                    // get ratio of song progression
                    var ratioTime = ( this.position / this.duration )*100;
                    jQuery('.user-distance-play.index'+index+' .user-play-progress-bar-played')
                        .css('width',ratioTime+"%");
                },
                onfinish: function(){
                    streamStopAll();
                }
            },

            function(){

                jQuery('.user-distance-play.index'+index+' .btn-play-pause')
                    .addClass("pause");
                jQuery('.user-distance-play.index'+index+' .user-play-progress-bar-container')
                    .addClass('show');  
                
            }

        )



        $scope.songIsPlayed = {
            'played':true,
            'id_song':id_song,
            'index':index
        }

    }

    var streamStopAll = function(){

        soundManager.stopAll();

        jQuery('.user-distance-play .btn-play-pause.pause')
            .removeClass("pause");
        jQuery('.user-distance-play .user-play-progress-bar-played.style')
            .removeAttr('style');
        jQuery('.user-distance-play .user-play-progress-bar-container.show')
            .removeClass('show');


        $scope.songIsPlayed = {
            'played':false,
            'id_song':'',
            'index':''
        }
        
    }
    


}])





myApp.controller('usersListCtrl', ['$scope','$http', function($scope,$http){


    var userC = JSON.parse(cookieGet('user'));

    var mainData = [];
    $http.get('php/get-users.php?to=list&pos='+userC['Last_Position'])
        .success(function(data){
            $scope.users = data;
            mainData = data;

        });




    $scope.songIsPlayed = {
        'played':false,
        'id_user':'',
        'index':''
    }

    $scope.$on('$destroy', function(){
        
        $scope.songIsPlayed = {
            'played':false,
            'id_user':'',
            'index':''
        }

        if(typeof soundManager != 'undefined'){
            streamStopAll();            
        }

    })


    $scope.play = function(index, id_user){
        
        

        if( $scope.songIsPlayed['played'] ){

            if(id_user!=$scope.songIsPlayed['id_user']){
                

                streamStopAll();

                getTrackId(index, id_user);

            }else{

                streamStopAll();
                

            }


        }else{
            
            getTrackId(index, id_user);
            

        }

    }

    var getTrackId = function(index, id_user){

        SC.get('/users/'+id_user+'/tracks/', function(tracks,error){
            
            if(error){
                
                alert(error);                                

            }else{

                var id_song = tracks[0].id;
                
                stream(index, id_song);


            }

        });

        

        $scope.songIsPlayed = {
            'played':true,
            'id_user':id_user,
            'index':index
        }

    }

    var stream = function (index, id_song){


        SC.stream('/tracks/'+id_song, {
                        autoLoad:true,
                        autoPlay:true,
                        stream:true,
                        volume:100,
                        whileplaying: function(){
                            // get ratio of song progression
                            var ratioTime = ( this.position / this.duration )*100;
                            jQuery('.user-distance-play.index'+index+' .user-play-progress-bar-played')
                                .css('width',ratioTime+"%");                               
                        },
                        onfinish: function(){
                            streamStopAll();
                        }
                    },

                    function(sound, error){
                        

                        if(error){
                            alert(error);   
                        }else{

                            jQuery('.user-distance-play.index'+index+' .btn-play-pause')
                                .addClass("pause");
                            jQuery('.user-distance-play.index'+index+' .user-play-progress-bar-container')
                                .addClass('show');  

                        }
                        
                    }

                )





    }

    var streamStopAll = function(){

        soundManager.stopAll();

        jQuery('.user-distance-play .btn-play-pause.pause')
            .removeClass("pause");
        jQuery('.user-distance-play .user-play-progress-bar-played.style')
            .removeAttr('style');
        jQuery('.user-distance-play .user-play-progress-bar-container.show')
            .removeClass('show');


        $scope.songIsPlayed = {
            'played':false,
            'id_user':'',
            'index':''
        }
        
    }

    $scope.filter = function(instrumentSelected, musicStyleSelected){

        var dataOut = [], i = 0, iOut = 0, finalCondition;

        

        if(instrumentSelected != 'Instrument_Favorit' || musicStyleSelected != 'Style Musical'){

            

            if(instrumentSelected != 'Instrument_Favorit' && musicStyleSelected == 'Style Musical'){

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Instrument_Favorit'] == instrumentSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }

            }else if(instrumentSelected == 'Instrument_Favorit' && musicStyleSelected != 'Style Musical'){

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Style'] == musicStyleSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }
                
            }else {

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Style'] == musicStyleSelected && mainData[i]['Instrument_Favorit'] == instrumentSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }

            }

            $scope.users = dataOut;

        }
            
        $scope.filterToggle();


    }

    $scope.filterReset = function(){
        $scope.users = mainData;
        $scope.filterToggle();
    }

}])






myApp.controller('annoncesListCtrl', ['$scope','$http', function($scope,$http){
	
    var mainData;   
    $http.get('php/get-annonces.php?to=list&pos=[50.461977499999996,4.8571596]').success(function(data){
        
        $scope.annonces = data;
        mainData = data;
    });



    $scope.filter = function(instrumentSelected, musicStyleSelected){

        var dataOut = [], i = 0, iOut = 0, finalCondition;

        if(instrumentSelected != 'Instrument' || musicStyleSelected != 'Style Musical'){

            

            if(instrumentSelected != 'Instrument' && musicStyleSelected == 'Style Musical'){

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Instrument'] == instrumentSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }

            }else if(instrumentSelected == 'Instrument' && musicStyleSelected != 'Style Musical'){

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Style'] == musicStyleSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }
                
            }else {

                for(i=0;i<mainData.length;i++){

                    if(mainData[i]['Style'] == musicStyleSelected && mainData[i]['Instrument'] == instrumentSelected){
                        dataOut[iOut] = mainData[i];
                        iOut++;
                    }
                }

            }

            $scope.annonces = dataOut;

        }
            
        $scope.filterToggle();


    }

    $scope.filterReset = function(){
        $scope.annonces = mainData;
        $scope.filterToggle();
    }

}])






myApp.controller('annonceCtrl',['$scope','$http', function($scope, $http){

    if($scope.annonceId && $scope.annonceId!=''){

        $http.get('php/get-annonces.php?to=only&annonceId='+$scope.annonceId+'&pos=[50.461977499999996,4.8571596]').
            success(function(annonce){
            $scope.annonce = annonce;

   
            $http.get('php/get-users.php?to=only&userId='+annonce.ID_User+'&pos=[50.461977499999996,4.8571596]')
                .success(function(user){
                    $scope.user = user;
                });


            $scope.songIsPlayed = {
                'played':false,
                'id_user':''    
            }

            $scope.$on('$destroy', function(){
                
                $scope.songIsPlayed = {
                    'played':false,
                    'id_user':''
                }

                if(typeof soundManager != 'undefined'){
                    streamStopAll();            
                }

            })

            $scope.play = function(id_user){

                if( $scope.songIsPlayed['played'] ){

                    if(id_user!=$scope.songIsPlayed['id_user']){

                        streamStopAll();

                        stream(id_user);

                    }else{

                        streamStopAll();

                    }


                }else{
                    
                    stream(id_user);

                }

            }

            var stream = function(id_user){

                SC.get('/users/'+id_user+'/tracks/', function(tracks,error){
                    
                    if(error){
                        
                    }else{

                        SC.stream('/tracks/'+tracks[0].id, {
                                autoPlay:true,
                                whileplaying: function(){
                                    // get ratio of song progression
                                    var ratioTime = ( this.position / this.duration )*100;
                                    jQuery('.user-distance-play .user-play-progress-bar-played')
                                        .css('width',ratioTime+"%");
                                },
                                onfinish: function(){
                                    streamStopAll();
                                }
                            },

                            function(){

                                jQuery('.user-distance-play .btn-play-pause')
                                    .addClass("pause");
                                jQuery('.user-distance-play .user-play-progress-bar-container')
                                    .addClass('show');  
                                
                            }

                        )

                    }

                });



                $scope.songIsPlayed = {
                    'played':true,
                    'id_user':id_user
                }

            }

            var streamStopAll = function(){

                soundManager.stopAll();

                jQuery('.user-distance-play .btn-play-pause.pause')
                    .removeClass("pause");
                jQuery('.user-distance-play .user-play-progress-bar-played.style')
                    .removeAttr('style');
                jQuery('.user-distance-play .user-play-progress-bar-container.show')
                    .removeClass('show');


                $scope.songIsPlayed = {
                    'played':false,
                    'id_user':''
                }
                
            }

        }).
        error(function(){
            window.location.href="#annonces-list";            
        });

    }else{
        window.location.href="#annonces-list";
    }

}])







myApp.controller('newAnnonceCtrl', ['$scope','$http', function($scope,$http){
	

    jQuery(".btn-submit-container").click(function(){

        // check if all input
        if(
            $scope.instrumentSelected != 'Instrument' &&
            $scope.musicStyleSelected != 'Style Musical' &&
            $scope.description!=undefined &&
            $scope.description!=''
            ){            

            $http.post('php/post-annonce.php',
                {
                    instrument:$scope.instrumentSelected,
                    music_style:$scope.musicStyleSelected,
                    description:$scope.description
                }).
                success(function(data){
                    $scope.goto('gestion-annonces');
                }).
                error(function(data){
                    $scope.goto('gestion-annonces');
                })

        }else{

            jQuery(".alert").addClass('show');
            jQuery(".alert .btn-cancel").click(function(){
                jQuery(".alert").removeClass("show");
            })

        }


    })
	        
	$scope.instrumentSelected = 'Instrument';
	$scope.musicStyleSelected = 'Style Musical';

    $scope.filterInstrumentUpdate = function(){

        if($scope.filterInstrument == '' 
            || $scope.filterInstrument == null ){

            $scope.instrumentSelected = 'vide';

        }else{

            $scope.instrumentSelected = 
                $scope.filterInstrument.name;

        }
             
    }

    $scope.filterMusicStyleUpdate = function(){

        if($scope.filterMusicStyle == '' 
            || $scope.filterMusicStyle == null ){

            $scope.musicStyleSelected = 'vide';

        }else{

            $scope.musicStyleSelected = 
                $scope.filterMusicStyle.name;

        }
             
    }
}])









myApp.controller('messagesListCtrl', function($scope,$http){



    var user = JSON.parse(cookieGet('user'));

    if(user['Name']!='Visitor'){
        getMessages(user['ID'], false);

        var getMessageInterval = setInterval(function(){
            getMessages(user['ID'], true)
        }, 2000);

        $scope.$on('$destroy', function(){
            clearInterval(getMessageInterval);
        })
    }

    function getMessages(userId, refresh){

        $http.get('php/get-messages.php?to=list&userId='+userId+"&refresh="+refresh)
            .success(function(data){

                    if(data.length>0){
                        $scope.convers = data;
                        
                    }else{
                        jQuery('#messages-list .no-message')
                            .addClass('show');
                    }
                });

    }

    $scope.messageWarp = function(msg){

        if(msg.length>55){
            msg = msg.substring(0,55)+"...";
        }

        return msg;
    }

})

myApp.controller('messageCtrl', ['$scope','$http', function($scope,$http){


    var user = JSON.parse(cookieGet('user'));

    var userId = user['ID'];

    $scope.thisUserId = userId;




    if($scope.conversId != undefined && $scope.conversId!=''){


        $.get('php/get-conversations.php?to=otherUser&conversId='+$scope.conversId+'&userId='+userId)
            .success(function(user){

                user = JSON.parse(user);

                $scope.changePageName(user['Name']);
            })


        // REFRESH VIEW

        var getMsgInterval = setInterval(function(){


            if($scope.messages==undefined){
                

                $http.get('php/get-messages.php?to=only&conversId='+$scope.conversId+'&userId='+userId+'&refresh=true')
                    .success(function(data){

                        

                        if(Object.keys(data).length>0){
                        
                            $scope.messages = data.messages;

                            setTimeout(function(){  
                                goBottom();
                            },20);

                        }
                    
                    });


            }else{

                var nbrMsgInMessages = ($scope.messages.length)-1;

                var lastMsgId = $scope.messages[nbrMsgInMessages].ID;

                $http.get('php/get-messages.php?to=only&conversId='+$scope.conversId+'&userId='+userId+'&refresh=true&lastMsgId='+lastMsgId)
                    .success(function(data){
                        
                        if(data.length>0){

                            var i = 0;
                            
                            for( i=0 ; i<data.length; i++){


                                $scope.messages.push(data[i])

                            }


                            setTimeout(function(){
                                goBottom();
                            },50);

                        }
                    })

                }

        },2000);


    }else{
        $scope.goto("/messages-list");
        
    }

    var lastMsg;

    $scope.$on('$destroy', function(){

        clearInterval(getMsgInterval);

    })

    $scope.sendMsg = function(){

        var newMsg = $scope.newMessage;
        var conversId = $scope.conversId;



        if(typeof newMsg != 'undefined' && newMsg.length>0){

            $http.post('php/post-message.php?userId='+user['ID']+'&conversId='+conversId,
                {msg:newMsg})
                .success(function(data){

                    lastMsg = newMsg;   

                    $scope.newMessage = '';

                });
        }

    }


    $scope.autoExpand = function(e){
        
        // var element = typeof e === 'object' ? e.target : document.getElementById(e);
        // var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
        
        // if(scrollHeight<50){
        //     element.style.height =  scrollHeight + "px"; 
        // }

    }


    var goBottom = function(){
        jQuery("main").scrollTop(jQuery("#message").height()-200);
    }


    $scope.getDate = function(timestamp){

        var date = new Date(timestamp*1000);
        var actuDate = new Date();

        if(date.getDate()==actuDate.getDate()
            && date.getMonth()==actuDate.getMonth()
            && date.getFullYear()==actuDate.getFullYear() ){

                var minutes;

                if(date.getMinutes()<10){
                    minutes = "0" + (date.getMinutes()+1);
                }else{
                    minutes = date.getMinutes()+1;
                }

                return ((date.getHours()+1)+":"+minutes);

        }else{

            var year = (date.getFullYear()).toString();
            year = year.substring(2);


            var day = correctFormat(date.getDate());
            var month = correctFormat(date.getMonth()+1);

            return (day+"/"+month+"/"+year);

        }

        function correctFormat(el){

            el = el.toString();

            if(el.length==1){
                el = 0+el;
            }
            return el;
        }

    }
}])





myApp.controller('editProfilCtrl', function($scope,$http){

    var userC = cookieGet('user');
    var userC = JSON.parse(userC);



    $scope.instrumentSelected = 'Instrument';
    $scope.musicStyleSelected = 'Style Musical';

     $scope.instruments = [
        { id:0, name: 'Voix'},
        { id:1, name: 'Guitare'},
        { id:2, name: 'Piano'},
        { id:3, name: 'Saxophone'},
        { id:4, name: 'Compositeur'}
    ];


    $scope.musicStyles = [
        { id:0, name: 'Classic'},
        { id:1, name: 'Pop/Rock'},
        { id:2, name: 'Hip-hop/Rap'},
        { id:3, name: 'Variété'},
        { id:3, name: 'Électro'},
        { id:4, name: 'Jazz'}
    ];



    updateShowInfo();


    jQuery("input[type=submit]").click(function(){

        var instrument_favorit = $scope.instrumentSelected,
            style = $scope.musicStyleSelected,
            description = $scope.description,
            link_twitter = $scope.link_twitter,
            link_facebook = $scope.link_facebook;

        $http.post('php/update-users.php?userId='+userC['ID'],
            {
                instrument_favorit:instrument_favorit,
                style:style,
                description:description,
                link_twitter:link_twitter,
                link_facebook:link_facebook
            }).
            success(function(data){
                window.location.href="#profil";
                // updateShowInfo();
            })

    })




    function updateShowInfo(){


        // get user infos
        $http.get('php/get-users.php?to=only&pos=[50.461977499999996,4.8571596]&userId='+userC['ID']).
            success(function(user){

                if( 
                    user.Instrument_Favorit == '' ||
                    user.musicStyleSelected == '' ||
                    user.Description == ''
                    ){
                    jQuery(".info-info").removeClass("hide");
                }

                if(user.Instrument_Favorit!=''){
                    $scope.instrumentSelected =
                        user.Instrument_Favorit;
                }
                if(user.Style!=''){
                    $scope.musicStyleSelected = 
                        user.Style;
                }
                if(user.Description!=''){
                    $scope.description =
                        user.Description;
                }
                if(user.Link_Twitter!=''){
                    $scope.link_twitter = 
                        user.Link_Twitter;
                }
                if(user.Link_Facebook!=''){
                    $scope.link_facebook = 
                        user.Link_Facebook;
                }

                $scope.profilId = user.ID;

            })
    }


    $scope.filterInstrumentUpdate = function(){

        if($scope.filterInstrument == '' 
            || $scope.filterInstrument == null ){

            $scope.instrumentSelected = 'vide';

        }else{

            $scope.instrumentSelected = 
                $scope.filterInstrument.name;

        }
             
    }

    $scope.filterMusicStyleUpdate = function(){

        if($scope.filterMusicStyle == '' 
            || $scope.filterMusicStyle == null ){

            $scope.musicStyleSelected = 'vide';

        }else{

            $scope.musicStyleSelected = 
                $scope.filterMusicStyle.name;

        }
             
    }
})






myApp.controller('gestionAnnoncesCtrl', function($scope,$http){



    var user = JSON.parse(cookieGet('user'));

    if(user['Name']!='Visitor'){

        updateAnnonces();       

    }

    
    function updateAnnonces(){
        $http.get('php/get-annonces.php?to=list&userId='+user['ID']).
            success(function(data){
                $scope.annonces = data;
                if(data.length>0){
                    jQuery(".no-message").remove();
                }
            })        
    }

    $scope.deleteAnnonce = function(id){

        jQuery(".alert").addClass("show");
        jQuery(".alert .btn-cancel").click(function(){
            jQuery(".alert").removeClass('show');
        })
        jQuery(".alert .btn-delete").click(function(){

            $http.get('php/remove-annonces.php?annonceId='+id).
                success(function(data){
                    
                    jQuery(".alert").removeClass('show');
                    updateAnnonces();
                }).
                error(function(){
                    jQuery(".alert").removeClass('show');                        
                })

        })

    }


});




myApp.controller('filterCtrl', function($scope){



     $scope.instruments = [
        { id:0, name: 'Voix'},
        { id:1, name: 'Guitare'},
        { id:2, name: 'Piano'},
        { id:3, name: 'Saxophone'},
        { id:4, name: 'Compositeur'}
    ];


    $scope.musicStyles = [
        { id:0, name: 'Classic'},
        { id:1, name: 'Pop/Rock'},
        { id:2, name: 'Hip-hop/Rap'},
        { id:3, name: 'Variété'},
        { id:3, name: 'Électro'},
        { id:4, name: 'Jazz'}
    ];


            
    $scope.instrumentSelected = 'Instrument';
    $scope.musicStyleSelected = 'Style Musical'

    $scope.filterInstrumentUpdate = function(){

        if($scope.filterInstrument == '' 
            || $scope.filterInstrument == null ){

            $scope.instrumentSelected = 'vide';

        }else{

            $scope.instrumentSelected = 
                $scope.filterInstrument.name;

        }
             
    }

    $scope.filterMusicStyleUpdate = function(){

        if($scope.filterMusicStyle == '' 
            || $scope.filterMusicStyle == null ){

            $scope.musicStyleSelected = 'vide';

        }else{

            $scope.musicStyleSelected = 
                $scope.filterMusicStyle.name;

        }
             
    }


})




myApp.controller('navCtrl', function($scope){

    var user = JSON.parse(cookieGet('user'));

    if(user['Name']!='Visitor'){

        $scope.urlAvatar = user['Avatar'];
        $scope.connectUserId  = user['ID'];

        
        // get notifications
        getNotifications(user['ID']);


        setInterval(function(){
            getNotifications(user['ID']);
        }, 5000)




    }else{
        jQuery('nav .show-forConnected').hide();
    }


    function getNotifications(userId){
        $.get('php/get-notifications.php?userId='+userId).
            success(function(notifs){
                if(notifs.length>0){
                    $scope.notificationsNumber = notifs.length;
                }
            })
    }


    $scope.clearNotifications = function(){

        if(user['Name']!='Visitor'){

            $.get('php/remove-notifications.php?userId='+user['ID']).
                success(function(){
                    $scope.notificationsNumber='';
                })

        }

    }

})