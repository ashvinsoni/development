
$( document ).ready( function(){
	q_obj = new Question();
	q_obj.getQuestionOptions();
	$( '.odd_remove_active:first' ).trigger( 'click' );
});
var Question = function(){
	self_q = this;
};

$.extend(Question.prototype,{
	self_q : '',

	getQuestionOptions:function(){
		var QuestionTemplete        = $( "#QuestionTemplete" ).html();
		var QuestionCompileTemplete = Handlebars.compile( QuestionTemplete );
		var QuestionData            = QuestionCompileTemplete( question_list );
		$( '#question_list' ).empty().append( QuestionData );
	},

	savePoints:function(){
		showloading();
		$.ajax({
			url  : site_url + 'admin/save_points',
			data : $('#form_save_points').serialize(),
			type : "POST",
			dataType	: 'json',
			success: function(response){
				if(response.result == 'error'){
					//Throw Error
				} 
				else 
				{
					//Continue	
				}
			},
			complete : function ()
			{
				hideloading();
			}
		});
		return false ;
	},
	release_question : function()
	{
		jConfirm( 'Are you sure you want to release answers?' , 'Please confirm' , function( r )
		{
			if ( r == true )
			{
				showloading();
				$.ajax({
					url  : site_url + 'admin/release_question',
					data : $( '#form_save_points' ).serialize(),
					type : "POST",
					dataType	: 'json',
					success: function(response){
						if(response.result == 'error')
						{
							//Throw Error	
						}
						else 
						{
							$('#save_points').hide();
							$('#release').hide();
						}
					},
					complete : function ()
					{
						hideloading();
					}
				});
			}
		});
		return false ;
	}
});

$( document ).on( 'click' , '.odd_remove_active' , function(){
	$( '.odd_remove_active' ).removeClass( 'active' );
	$( this ).addClass( 'active' );
	$( '.answer' ).hide();
	$( '#answer_'+$( this ).data( 'q' ) ).show();
});

$( document ).on( 'click' , '#save_points' , function(){
	self_q.savePoints();
});

$( document ).on( 'click' , '#release' , function(){
	self_q.release_question();
	return false;
});


Handlebars.registerHelper( 'compile_answer' , function( ) {
	var AnswerTemplete        = $( "#AnswerTemplete" ).html();
	var AnswerCompileTemplete = Handlebars.compile( AnswerTemplete );
	var AnswerData            = AnswerCompileTemplete( this );
	$( '#question-option' ).append( AnswerData );
});


Handlebars.registerHelper( 'compile_point' , function(){
	var index = 'Q'+this.question_id;
	var point = this[index];
	if( point === undefined ) point = 0;
	return point;
});