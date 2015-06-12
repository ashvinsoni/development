/* Registration Controller */


//Signup Controller to return the value in the view
app.controller('RegistrationCtrl',['$scope','$location','Auth','$sce','commonService',function($scope,$location,Auth,$sce, commonService)
{
	
	$scope.user   = {};
	$scope.tpl    = {} ;
	$scope.myForm = {};
	
	$scope.PlanDetails     = PlanDetails ;
	$scope.countryList     = Country ;
	$scope.stateList       = []; 
	$scope.month_arry      = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
	$scope.year_arry       = [];
	$scope.user.acc_info   = {'facebook_id':0 , 'twitter_id':0};
	$scope.user.payment_cc = {'card_type':'', 'name':'','card_number':'','expiry_month':'','expiry_year':'','cvv':''};
	$scope.term_condition  = false;
	$scope.payment_in_process = false;

	$scope.GenerateYearArry = function(){
		var d = new Date();
		var n = d.getFullYear();
		for(var i=n; i<= n+20; i++){
			$scope.year_arry.push(i);
		}
	}


	$scope.LoadPlanDetails = function(){
		
	$scope.tpl.contentUrl = siteUrl+'template/registration/select_plan.php' ;
	}
	$scope.SelectPlan = function(plan_id){
		$scope.user.selected_plan = plan_id;
		$('.plan-name').removeClass('selected_plan');
		$('#plan_'+plan_id+ ' .plan-name').addClass('selected_plan');		

		angular.forEach(PlanDetails, function(value, key) {
		  if(value.master_member_fees_id == plan_id){
		  	$scope.user.plan_info = value;
		  }
		});

	}
	$scope.LoadAccountInfo = function(){
		$scope.tpl.contentUrl = siteUrl + 'template/registration/account_info.php';
	}

   	$scope.filterStates = function()
    {
    	var country_abbr = $('#country').val();
      	$scope.stateList = [];
      	if(country_abbr != '')
      		$scope.stateList  =  State[country_abbr] ;
    } 

    $scope.plan_display_text = function(){
    	var plan_txt = '';
    	
    	switch($scope.user.plan_info.plan_type) {
    		case "0":
    			plan_txt += 'FREE';
    		break;
    		case "30":
				plan_txt += '/ Monthly'
    		break;
    		case "120":
    			plan_txt += '/ Quaterly';
    		break;
    		case "180":
    			plan_txt += '/ Half Yearly';
    		break;
    		case "365":
    			plan_txt += '/ Yearly';
    		break;
    	}

    	$scope.user.acc_info.plan_text = plan_txt ;
    }

   	$scope.LoadReviewDetails = function(is_checked){
   			
   		if(is_checked == 1){
			$scope.tpl.contentUrl = siteUrl + 'template/registration/review_details.php';
   		
   		} else {

	   		if($scope.ValidateAccountInfo()){
	   			var data = { 	
							'email'       : $scope.user.acc_info.email , 
							'user_name'   : $scope.user.acc_info.user_name,
							'facebook_id' : $scope.user.acc_info.facebook_id,
							'twitter_id'  : $scope.user.acc_info.twitter_id
	   						};

	   			commonService.commonApiCall(data,'registration/validate_uniqueness').then(function(response){
					
					if(response.status == 'success'){
						$scope.plan_display_text();
	   					$scope.tpl.contentUrl = siteUrl + 'template/registration/review_details.php';
					} else {
	   					if(response.email != ''){
	   						$('#err_email').html(response.email).removeClass('hide');
	   					}
	   					if(response.user_name != ''){
	   						$('#err_user_name').html(response.user_name).removeClass('hide');
	   					}
	   					if(response.facebook_id !='' && response.hasOwnProperty('facebook_id')){	   						
							showErrMsg(response.facebook_id);
	   					}
	   					if(response.twitter_id != '' && response.hasOwnProperty('twitter_id')){
							showErrMsg(response.twitter_id);
	   					}
	   				}
		        });
	   		}
   		}


   	}

   	$scope.ValidateAccountInfo = function(){
		$('.error').html('').addClass('hide');
		var errFlag = true;
		var info    = $scope.user.acc_info ;
		if( !info.hasOwnProperty('first_name')  || info.first_name == ''){
			$('#err_first_name').html(FIRST_NAME_ERROR).removeClass('hide');
			errFlag = false;			
		}

		if(  !info.hasOwnProperty('last_name')  ||  info.last_name == ''){
			$('#err_last_name').html(LAST_NAME_ERROR).removeClass('hide');
			errFlag = false;
		}

		if( !info.hasOwnProperty('user_name')  || info.user_name ==''){
			$('#err_user_name').html(NICK_NAME_ERROR).removeClass('hide');
			errFlag = false;
		} 

		if( !info.hasOwnProperty('email') ||   info.email == ''){
			$('#err_email').html(EMAIL_ERROR).removeClass('hide');
			errFlag = false;
		} else if(!validateEmail(info.email)){
			$('#err_email').html(EMAIL_INVALID_ERROR).removeClass('hide');
			errFlag = false;
		}

		if(!info.hasOwnProperty('password') || info.password ==''){
			$('#err_password').html(PASSWORD_ERROR).removeClass('hide');
			errFlag = false ;
		} else if(info.password.length < 6 ) {
			$('#err_password').html(PASSWORD_LENGTH_ERROR).removeClass('hide');
			errFlag = false;			
		}

		if(!info.hasOwnProperty('confirm_password') || info.confirm_password == ''){
			$('#err_confirm_password').html(CONFIRM_PASSWORD_ERROR).removeClass('hide');
			errFlag = false ;

		} else if(info.password != info.confirm_password) {
			$('#err_confirm_password').html(CONFIRM_PASSWORD_MATCH_ERROR).removeClass('hide');
			errFlag = false ;
		}
		
		if(!info.hasOwnProperty('country')  || info.country  == null){
			$('#err_country').html(COUNTRY_ERROR).removeClass('hide');
			errFlag = false;
		}

		if(!info.hasOwnProperty('state') || info.state == null){
			$('#err_state').html(STATE_ERROR).removeClass('hide');
			errFlag = false;	
		}

		if ( info.hasOwnProperty('phone') &&   info.phone != '') {        
			/*$('#err_phone').html(PHONE_ERROR).removeClass('hide');
			errFlag = false;			*/
			if(isNaN(info.phone)){
				$('#err_phone').html(PHONE_INVALID_ERROR).removeClass('hide');
				errFlag = false;
			} else if(info.phone != "") {
				if(maxminLength( info.phone, PHONE_MIN_LENGTH, PHONE_MAX_LENGTH ) == false ) { 
					$('#err_phone').html(PHONE_LENGTH_ERROR).removeClass('hide');
					errFlag = false;				
				}
			}
		}

		if( !info.hasOwnProperty('dob') || info.dob == "" || info.dob == '0000-00-00')
		{
			$('#err_date_of_birth').html(DOB_ERROR).removeClass('hide');
			errFlag = false;
		}

		

		return errFlag ;
   	}

   	$scope.UpdateDOBSetting = function(){
   		$scope.user.acc_info.dob = '';
   		if( $scope.user.acc_info.hasOwnProperty('state')){
   			$( "#date_of_birth" ).datepicker( "option", "maxDate", '-'+ $scope.user.acc_info.state.age_allowed+'y');
   		}
   	}

   	$scope.LoadPayment  = function(){

   		$scope.tpl.contentUrl = siteUrl + 'template/registration/payment.php';
   	}

   	$scope.SubmitRegistrationData = function(payment_type){
   		/* payment_type :- 0 -- No payment  ,
   							1- Paypal
   							2- Credit Card
   		 */
   		$scope.user.payment_type = payment_type;
   		$('.error').addClass('hide');
   		if(payment_type == 2 && ! $scope.ValidateCreditCard()){
   			// Check credit card information
   		 	return false;
   		}

   		$scope.payment_in_process = true;
   		$('#middle_loader').removeClass('hide');
   		   		
   		commonService.commonApiCall($scope.user,'registration/init_payment').then(function(response){
			// console.log(response);
			$scope.payment_in_process = false;
			$('#middle_loader').addClass('hide');
			
			if(response.result =='error'){
				$scope.SubmitErrorHandling(response);
			} else {
				if(payment_type == 1){
					location.href = response.url;
				}
				else if(payment_type == 2){
					showSuccessMsg( response.msg );

					setTimeout(function(){
						location.href = siteUrl +'registration/final_response/success' ;
					},6000);
					
				} else {
					showSuccessMsg('Congratulations, Your registration has been successful.');
					setTimeout(function(){
						location.href = siteUrl ;
					},6000);
				}

			}

        });
   		
   	}
   	$scope.SubmitErrorHandling = function(error_data){

   		$.each(error_data, function(index, value){
   			
   			if(value != '' && value !='error'){
   				showErrMsg(value);
   				return false;  				
   			}
   		})

   	}

   	$scope.ValidateCreditCard = function(){

   		var errFlag = true;

   		if ($scope.user.payment_cc.card_type ==''){
   			$('#err_cc_card_type').html('Please select card type.').removeClass('hide');
   			errFlag = false;   		
   		}

   		if($scope.user.payment_cc.name == ''){
   			$('#err_cc_name').html('Please enter card holder name.').removeClass('hide');
   			errFlag = false; 
   		}

   		if($scope.user.payment_cc.card_number == ''){
   			$('#err_cc_card_number').html('Please enter card number').removeClass('hide');
   			errFlag = false; 
   		}
   		else if(/[^0-9]+$/.test($scope.user.payment_cc.card_number)){
			$('#err_cc_card_number').html('Please enter valid card number').removeClass('hide');
			errFlag = false; 
   		}

   		if($scope.user.payment_cc.expiry_month ==''){
   			$('#err_cc_date').html('Please select month.').removeClass('hide');
   			errFlag = false;
   		}

   		if($scope.user.payment_cc.expiry_year == ''){
			$('#err_cc_date').html('Please select year.').removeClass('hide');
   			errFlag = false;
   		}

   		return errFlag;
   		
   	}

   	$scope.FillFacebookData = function(data){

		$scope.$apply(function(){
			$scope.user.acc_info.first_name  = data.first_name;
			$scope.user.acc_info.last_name   = data.last_name
			$scope.user.acc_info.user_name   = data.name.replace(/ /g, "_").toLowerCase();
			$scope.user.acc_info.email       = data.email;
			$scope.user.acc_info.twitter_id = 0;
			$scope.user.acc_info.facebook_id = data.id;
		});
   	}

   	$scope.FillTwitterData = function (data){

   		console.log(data);
		var index      = data.name.indexOf(" ");  
		var first_name = data.name.substr(0, index); 
		var last_name  = data.name.substr(index + 1)

   		$scope.$apply(function(){

			$scope.user.acc_info.first_name  = first_name;
			$scope.user.acc_info.last_name   = last_name
			$scope.user.acc_info.user_name   = data.screen_name
			$scope.user.acc_info.twitter_id = data.id;
			$scope.user.acc_info.facebook_id = 0;
		});

   	}
   
    $scope.GenerateYearArry();
}]);




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