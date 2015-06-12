<div class="content" id="container">
	<div class="title"><h5>Edit News</h5></div>
	<!-- Form begins -->
	<?php $attr = 'class="mainForm add_news" id="valid"'; echo form_open( site_url('admin/add_news') , $attr ); ?>
		<fieldset>
			
			<div class="widget first">
				<div class="head">
					<h5 class="iList">Edit News Detail</h5>
				</div>
				<?php if(isset($news_record) && !empty($news_record)) { ?>
				<input type="hidden" id="action" name="action" value="update">
				<input type="hidden" id="news_id" name="news_id" value="<?php echo $news_record['news_id'];?>">
				<div class="rowElem">
					<label for="size">Title:</label>
					<div class="formRight">
						<input type="text" name="title" id="title" maxlength="150" class="validate[required,maxSize[150]]" value="<?php echo $news_record[ 'title' ];?>" style="width:50%;"/>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="size">Description:</label>
					<div class="formRight">
						<textarea rows="8" cols="" name="description" id="description" maxlength="2000" class="validate[required,maxSize[2000]]" style="width:50%;"><?php echo $news_record[ 'description' ];?></textarea>
					</div>
					<div class="fix"></div>
				</div>
				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Update" class="greyishBtn" id="add_news" />
						<a href="<?php echo site_url( 'admin/news' ); ?>" class="blueNum">Cancel</a>
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
				<?php }?>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>
<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>

<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/chosen.jquery.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/add_news.js<?php version_control(); ?>"></script>