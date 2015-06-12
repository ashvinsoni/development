app.controller('loginController',function($scope,$location,Auth,commonService,$rootScope,$http,reCAPTCHA){

   $scope.user   = {};
   $scope.user.acc_info   = {'facebook_id':0 , 'twitter_id':0,'captcha':{}, 'above_eighteen':false};
   
$scope.check_login = function(){
            
    $(".error show").css("display", "block");
    var ret=true;
    var login_email = $('#useremail').val();
    var login_pass = $('#userpass').val();
    if(login_email == '')
    {
        $('#red-error-useremail').html(EMAIL_ERROR).removeClass('hide'); 
        ret=false;
    }
    /*else if(!$scope.validateEmail(login_email))
    {
        $('#red-error-useremail').html(EMAIL_INVALID_ERROR).removeClass('hide');
        ret=false;
    }else{
      $('#red-error-useremail').addClass('hide');
    }*/
    if(login_pass == '')
    {
        $('#red-error-userpass').html(PASSWORD_ERROR).removeClass('hide');
        ret=false;
    }else{
      $('#red-error-userpass').addClass('hide');
    }

    if(ret)
    {
        $('#login_loader').addClass('loaderBtn');
        $.ajax
        ({
            url: siteUrl + "login/check_login",
            data: $( '#frmlogin' ).serialize(),
            type: 'post',
            success: function(response)
            {
                if (response.status == true) {
                    window.location.href=siteUrl+"lobby";
                }
                if(response=="1")
                {
                    $('#login_loader').removeClass('loaderBtn');
                    window.location.href=siteUrl+"lobby";
                }
                else if(response.status=="not_confirmed")
                {   
                    $('#red-error-useremail').html(EMAIL_VARIFIED_ERROR).removeClass('hide');
                    $('#login_loader').removeClass('loaderBtn');
                }
                else if( response.status == "invalid_login" )
                {
                    ///$('#red-error-useremail').show();
                    $('#red-error-useremail').html(LOGIN_INVALID_ERROR).removeClass('hide');
                    $('#login_loader').removeClass('loaderBtn');;   
                    ret=false;
                }
                else if( response.status == "subscription" )
                {
                    //$('#red-error-useremail').show();
                    $('#red-error-useremail').html(SUBSCRIPTION_EXPIRED).removeClass('hide');
                    $('#login_loader').removeClass('loaderBtn');;   
                    ret=false;
                }
                else if ( response.status == 'blocked' )
                {
                    closePopDiv('loginPopup', 'bounceOutUp');
                    $( '#error_message span.msg' ).empty( '' ).append(USER_BANNED);
                    ShowMessage( 'error_message' , 'bounceInDown' );
                    $('#login_loader').removeClass('loaderBtn');
                }
                else if ( response == 'captcha' )
                {
                    $('#login_loader').removeClass('loaderBtn');    
                }
            }
        });
        return false;
    }
    else
    {
        return ret;
    }
} 
    $scope.validateEmail = function(email){
        var regex     = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (regex.test( $.trim( email ) ) ) {
            return true;
        } else {
            return false;
        }
    }

    $scope.showError = function(response) {    
    
       switch ( response.is_login )
      {   
        case "not_confirmed"     : 
            $( '#error_message span.msg' ).empty( '' ).append(EMAIL_VARIFIED_ERROR);
            ShowMessage( 'error_message' , 'bounceInDown' );
            break;
        case "already-attach"     : 
            $( '#error_message span.msg' ).empty( '' ).append(USER_BANNED);
            ShowMessage( 'error_message' , 'bounceInDown' );
            break;
        case "banned"     : 
            $( '#error_message span.msg' ).empty( '' ).append(USER_BANNED);
            ShowMessage( 'error_message' , 'bounceInDown' );
            break;
        case "success"     : 
            window.location.href=siteUrl+"dashboard";
            break;
        case "signup"     : 
              window.location.href=siteUrl+"registration";
            break;

      }

    }

       
    $scope.filterStates = function()
    {
        var country_abbr = $('#country').val();
        $scope.stateList = [];
        if(country_abbr != '')
            $scope.stateList  =  State[country_abbr] ;
    }

    $scope.usersignup = function(){
      var values = $scope.user.acc_info;
      if($scope.ValidateAccountInfo()){
         commonService.commonApiCall(values,'login/check_reCaptcha_response').then(function(response){
           if(response.status == true){
              $('#err_captcha').html('').addClass('hide');
              $('#reset_btn1').addClass('loaderBtn');
              commonService.commonApiCall(values,'login/signup').then(function(res){/*               
                    if(res.status == 'username_exist'){
                      $('#reset_btn1').removeClass('loaderBtn');
                       showErrMsg(res.msg);
                       setTimeout(function(){
                          CloseMessage( 'error_message' , 'bounceOutUp' );
                        },3000);
                       reCAPTCHA.reload();      
                    }else if(res.status == 'email_exist'){
                       $('#reset_btn1').removeClass('loaderBtn');
                        showErrMsg(res.msg);
                        setTimeout(function(){
                           CloseMessage( 'error_message' , 'bounceOutUp' );
                        },3000);
                        
                        reCAPTCHA.reload();
                    }else{

                          $('#reset_btn1').removeClass('loaderBtn');
                          showSuccessMsg(res.msg);
                          CloseMessage( 'error_message' , 'bounceOutUp' );
                          closePopDiv('SignupPopup');
                          setTimeout(function(){
                              location.href = siteUrl ;
                             },2000);
                    }
               */
               if(data.acc_type == 'facebook'){
                //var post_value = {'id': data.data.facebook_id,'email':data.data.email}; 
                $http.post(siteUrl+'login/fb_social_login',values).success(function(data){
                  setTimeout(function(){
                    location.href = siteUrl ;
                  },1000);
                });

              } else if(data.acc_type == 'twitter') {

                var post_value = {'id': data.data.twitter_id}; 
                $http.post(siteUrl+'login/twitter_social_login',post_value).success(function(data){
                  setTimeout(function(){
                    location.href = siteUrl ;
                  },1000);
                });
              
              } else {
                
                if(data.status){ 
                  reCAPTCHA.reload();
                  $('#reset_btn1').removeClass('loaderBtn');
                  showSuccessMsg(data.msg);
                  closePopDiv('SignupPopup');
                  setTimeout(function(){
                    location.href = siteUrl ;
                  },1000);
                  return false; 
                }
              }

             });
          }else{
            $('#reset_btn1').removeClass('loaderBtn');
            showErrMsg(response.msg);
            setTimeout(function(){
                  CloseMessage( 'error_message' , 'bounceOutUp' );
                  },3000);
                 reCAPTCHA.reload();
             }
        
         },function(error){
          
        });
      } 
    }



    // facebook function

  $scope.info = {};

  

  //FB LOGIN
  $scope.FbLogin = function(){
    fb_obj.FbLoginStatusCheck();
  }

  $scope.FbUserData = function(user_data){
    // console.log('Facebook Data', user_data);
    $http.post(siteUrl+'login/fb_social_login', user_data).success(function (response) {
  
      if(! response.status ){
        // Error happen
        showErrMsg(response.msg);
      } else  {
        location.href = siteUrl;
      } 
      return false;
    });
  }

  //TWITTER LOGIN
  $scope.TWLogin= function(data){

    $http.post(siteUrl+'login/twitter_social_login', data).success(function (response) {

      if(! response.status ){
        // Error happen
        showErrMsg(response.msg);
      } else  {
        location.href = siteUrl;
      } 
      return false;
    });
  }



    $scope.resetForm = function(){
      //var info    = $scope.user.acc_info;
      $scope.$apply(function(){
         $scope.user.acc_info   = {'facebook_id':0 , 'twitter_id':0,'captcha':{}, 'above_eighteen':false};

      }); 
    }


    $scope.ValidateAccountInfo = function(){
        var errFlag = true;      
        $('.error').html('').addClass('hide');
        var info    = $scope.user.acc_info;
        var charfilter = /^[a-zA-Z ]*$/;
        var letters = /^[a-zA-Z0-9_]+((\.(-\.)*-?|-(\.-)*\.?)[a-zA-Z0-9_]+)*$/;

        if( !info.hasOwnProperty('user_name')  || info.user_name ==''){
            $('#err_user_name').html(NICK_NAME_ERROR).removeClass('hide')
            errFlag = false;
        }else if(info.user_name.length < 3){
           
           $('#err_user_name').html(NICK_NAME_MINI_ERROR).removeClass('hide')
            errFlag = false;  
        }else if(info.user_name.length > 50 ){
          
           $('#err_user_name').html(NICK_NAME_MAX_ERROR).removeClass('hide')
           errFlag = false;  
        }else if(!letters.test(info.user_name)){
            $('#err_user_name').html(NICK_NAME_VALID_ERROR).removeClass('hide')
            errFlag = false;
        } 

        if( !info.hasOwnProperty('email') ||   info.email == ''){
            $('#err_email').html(EMAIL_ERROR).removeClass('hide')
            errFlag = false;
        } else if(!validateEmail(info.email)){
            $('#err_email').html(EMAIL_INVALID_ERROR).removeClass('hide')
            errFlag = false;
        }

        if(!info.hasOwnProperty('password') || info.password ==''){
            $('#err_password').html(PASSWORD_ERROR).removeClass('hide')
            errFlag = false ;
        } else if(info.password.length < 6 ) {
            $('#err_password').html(PASSWORD_LENGTH_ERROR).removeClass('hide')
            errFlag = false;            
        }

        if(info.captcha.response == '' || info.captcha.response == undefined ){
            $('#err_captcha').html(CAPTCHA_EMPTY).removeClass('hide')
             errFlag = false;
        }
        return errFlag ;
    }

    $scope.userNameCheck = function(){

    }
    
    $scope.UpdateDOBSetting = function(){
        if( $scope.user.acc_info.hasOwnProperty('state')){

            $( "#date_of_birth" ).datepicker( "option", "maxDate", '-'+ $scope.user.acc_info.state.age_allowed+'y');
        }
    }

    $scope.SubmitErrorHandling = function(error_data){

        $.each(error_data, function(index, value){
            
            if(value != '' && value !='error'){
                showErrMsg(value);
                return false;               
            }
        })

    }

});


function checkEmpty(theField,s)
    {
        var field_val= $('#'+theField).val();
        if( field_val=="" )
        { 
            $('#red-error-'+theField).show();
            $('#red-error-'+theField).html(s);
            return false;
        }
        else
        {
            $('#red-error-'+theField).hide();
        }
   } 

function maxminLength(field_value,min_length,max_length)
{
    if(field_value!=null)
    {
      if(field_value.length>max_length)
      {
        return false;
      }
      else if(field_value.length<min_length)
      {
        return false;
      }
      else
      {
        return true;
      }
    }
}


function validateEmail(email){
    var regex     = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (regex.test( $.trim( email ) ) ) {
        return true;
    } else {
        return false;
    }
}


function showErrMsg( msg )
{
    
  $( '#error_message .msg' ).empty().append( msg );
  ShowMessage( 'error_message' , 'bounceInDown' );
  setTimeout( function (){ CloseMessage( 'error_message' , 'bounceOutUp' ); } , 3000 );
}

function showSuccessMsg( msg )
{
  $( '#success_message .msg' ).empty().append( msg );
  ShowMessage( 'success_message' , 'bounceInDown' );
  setTimeout( function (){ 
    CloseMessage( 'success_message' , 'bounceOutUp' ); 
  } , 3000 );
}

  function load_forgot_password_popup() {
    $.ajax
    ({
      url: siteUrl + "login/View_forgot_password_popup",
      type: 'post',
      success: function(response)
      {
        closePopDiv('LoginPopup', 'bounceOutUp');
        $("#forgotPasswortPopup").html(response);
        openPopDiv( 'forgotPasswortPopup' , 'bounceInDown' );               
      }
    });
  }

  function forgot_password() {
    var ret=true;
    var forgot_email=$('#forgotemail').val();

    if(checkEmpty('forgotemail',EMAIL_ERROR)==false)
    {
      ret=false;
    }
    else if(!validateEmail(forgot_email))
    {
      $('#red-error-forgotemail').show();
      $('#red-error-forgotemail').html(EMAIL_INVALID_ERROR);
      ret=false;
    }

    if( ret )
    {
      $('#forgot_btn').addClass('loaderBtn');
      $.ajax
      ({
        url: siteUrl + "login/forgot_password",
        data: {'forgotemail':forgot_email},
        type: "POST",
        success: function(response)
        {
          if(response.status==false)
          {
            $('#red-error-forgotemail').show();
            $('#red-error-forgotemail').html(EMAIL_NOT_EXIST);
            $('#forgot_btn').removeClass('loaderBtn');
            return false;
          }
          else if(response.status==true)
          {
            $('#forgot_btn').removeClass('loaderBtn');
            $('#forgot_email').val('');

            closePopDiv('forgotPasswortPopup', 'bounceOutUp');
            $( '#success_message span.msg' ).empty( '' ).append(FORGOT_PASSWORD_SUCCESSFULL_MSG);
            ShowMessage( 'success_message' , 'bounceInDown' );
            setTimeout( function (){ 
                           CloseMessage( 'success_message' , 'bounceOutUp' ); 
                        } , 3000 );
            
          }
        }
      });
      return false;
    }
    else
    {
      return false;
    }
  }

  function reset_password()
  {
    var ret=true;
    var reset_pass_span_text = $('.top_testresult').parent().children("span").text(); 
    //alert(reset_pass_span_text);
    //return false;
    var reset_password=$('#reset_pass').val();
    var reset_confirm_password=$('#reset_confirm_pass').val();
    var reset_id= $('#reset_id').val();
    if(checkEmpty('reset_pass',PASSWORD_ERROR)==false)
    {
      ret=false;
    }
    else if(reset_password.length < 6)
    {
      $("#red-error-reset_pass").show();
      $('#red-error-reset_pass').html(PASSWORD_LENGTH_ERROR);
      ret=false;
    }
    // else if(reset_pass_span_text=="Weak")
    // {
    //  $("#red-error-reset_pass").show();
    //  $('#red-error-reset_pass').html(PASSWORD_WEAK_ERROR);
    //  ret=false;
    // }
    if(checkEmpty('reset_confirm_pass',CONFIRM_PASSWORD_MATCH_ERROR)==false)
    {
      ret=false;
    }
    else if(match_password(reset_password,reset_confirm_password)==false)
    {  
      $("#red-error-reset_confirm_pass").show();
      $('#red-error-reset_confirm_pass').html(CONFIRM_PASSWORD_MATCH_ERROR);
      ret= false;
    }

    if( ret )
    {
      $('#reset_btn').addClass('loaderBtn');
      $.ajax
      ({
        url: siteUrl + "login/submit_reset_password",
        data:{'reset_id':reset_id,'reset_pass':reset_password,'reset_confirm_pass':reset_confirm_password},
        type: "POST",
        success: function(response)
        {  
          if(response.status==false)
          {
            $( '#error_message span.msg' ).empty( '' ).append("Password is not reset");
            ShowMessage( 'error_message' , 'bounceInDown' );
            $('#reset_btn').removeClass('loaderBtn');
          }
          else if(response.status==true)
          {
            $('#reset_btn').removeClass('loaderBtn');
            closePopDiv('resetPasswordPopup', 'bounceOutUp');
            $( '#success_message span.msg' ).empty( '' ).append(CHANGE_PASS_SUCCESSFULL_MSG);
            ShowMessage( 'success_message' , 'bounceInDown' );
            setTimeout( function (){ 
                           CloseMessage( 'success_message' , 'bounceOutUp' ); 
                        } , 3000 );
          }
        }
      });
      return false;
    }
    else
    {
      return ret;
    }
  }

function match_password(pass,confirm_pass)
{
  if(pass!=confirm_pass)
  {
    return false;
  }
  else
  {
    return true;
  }
}