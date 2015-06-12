<div class="content">
	<div class="title">
		<h5>Odd Man Out</h5>
	</div>
	<h1 class="mt20"><?php echo $game_detail['game_name'];?></h1>
	<ul class="game-list mt20" id="game_list">    				
       <?php foreach ($team_detail as $key => $value) {?>     			
		<li>
			<a class="player_load">
				<div class="name"><?php echo $value['home'].' VS '.$value['away'];?></div>
				<div class="grey-text"><?php echo date('M d, Y h:i A',strtotime($value['season_scheduled_date']))?></div>
			</a>
		</li>
		<?php }?>
	</ul>
	<div class="clear"></div>
	<h2 class="que">Questions</h2>

	<ul class="q-list" id="question_list"></ul>
	<?php $attr='id="form_save_points"'; echo form_open( current_url() , $attr ); ?>
		<input type="hidden" name="game_unique_id" value="<?php echo $game_unique_id; ?>">
		<div id="question-option"></div>
		<?php if(empty($release_list)){?>
			<input type="button" value="Save" id="save_points" class="greyishBtn q-a-submit" style="float:left;" >
			<input type="button" value="Release" class="greyishBtn q-a-submit" style="float:left;margin-left:10px;" id="release">
		<?php } ?>

	<?php echo form_close(); ?>
	<div class="clear"></div>
</div>

<script type="text/x-handlebars-template" id="QuestionTemplete">
	{{#each this}}
		<li>
			<a id="q_{{this.question_id}}" href="javascript:void(0);" class="odd_remove_active" data-q="{{this.question_id}}">{{this.question}}</a>
			{{#compile_answer}}{{/compile_answer}}
		</li>
	{{/each}}
</script>

<script type="text/x-handlebars-template" id="AnswerTemplete">
	<div class="hide answer" id="answer_{{this.question_id}}">
		<input type="hidden" name="question_id[]" value="{{this.question_id}}">
		{{#each this.answers}}
			<div class="opt-list">
				<div class="opt-name">{{this.full_name}}</div>
				<div class="opt-score">
					<input type="hidden" name="player_unique_id_{{this.question_id}}[]" value="{{this.player_unique_id}}">
					<input type="hidden" name="player_name_{{this.question_id}}_{{this.player_unique_id}}" value="{{this.full_name}}">
					{{#if this.point}}
						<input class="point_num" type="text" id="point" name="point_{{this.question_id}}_{{this.player_unique_id}}" value="{{this.point}}"  maxlength="8">
						{{else}}
						<input class="point_num" type="text" id="point" name="point_{{this.question_id}}_{{this.player_unique_id}}" value="{{#compile_point}}{{/compile_point}}" maxlength="8">
					{{/if}}
				</div>
			</div>
		{{/each}}
	</div>
</script>

<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js?v=1.4"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/questions.js"></script>
<script type="text/javascript">
	var question_list = [];
	<?php if( isset( $question_list ) && $question_list ) echo 'question_list = '.json_encode( $question_list ).';'; ?>
</script>

<script type="text/javascript">
$('document').ready(function() {
	$('.point_num').keyup(function() {
		this.value = this.value.replace(/[^0-9\.\-\s\(\)\+]/g,'');
	});
});
</script>