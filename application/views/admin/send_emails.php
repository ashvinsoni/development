<style type="text/css">
	/*br{display: none!important;}*/
</style>
<div class="content" id="container">
	<div class="title"><h5>Send Emails</h5></div>
	<!-- Form begins -->
	<?php $attr = 'class="mainForm send_emails" id="emailvalid"'; echo form_open( current_url() , $attr ); ?>
		<fieldset>
			<input type="hidden" id="action" name="action" value="add">
			<div class="widget first">
				<div class="head">
					<h5 class="iList">Send Emails</h5>
				</div>
				
				<div class="rowElem">
					<label for="size">Subject</label>
					<div class="formRight">
						<input type="text" name="subject" id="subject" maxlength="150" class="validate[required,maxSize[150]]" style="width:50%;"/>
					</div>
					<div class="fix"></div>
				</div>

				  <div class="rowElem">
				  	<label>Message</label>
				  	<div class="formRight">
				  		<textarea rows="8" cols="" name="message" id="message" maxlength="2000" class="wysiwyg validate[required,maxSize[2000]]" style="width:50%;">
				  			<table border="0" cellspacing="0" cellpadding="0" align="center" width="620" class="outer-tbl">
				  			<?php echo $this->load->view('emailer/send_email_editor_header');

				  			 echo $this->load->view('emailer/footer');?>
				  			 </table>
				  		</textarea>
				  	</div>
				  	<div class="fix"></div>
				  </div>

				<div class="rowElem">
					<label for="">&nbsp;</label>
					<div class="formRight">
						<input type="submit" value="Submit" class="greyishBtn" id="send_emails" />
					</div>
					<div class="fix"></div>
				</div>
				<div class="fix"></div>
			</div>
		</fieldset>
	<?php echo form_close(); ?>
</div>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script> 


<script type="text/javascript" src="js/jquery-ui-1.10.2.custom.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/chosen.jquery.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/send_emails.js<?php version_control(); ?>"></script>









<script type="text/javascript" src="js/plugins/wysiwyg/jquery.wysiwyg.js"></script>
<script type="text/javascript" src="js/plugins/wysiwyg/wysiwyg.image.js"></script>
<script type="text/javascript" src="js/plugins/wysiwyg/wysiwyg.link.js"></script>
<script type="text/javascript" src="js/plugins/wysiwyg/wysiwyg.table.js"></script>




<script type="text/javascript" src="js/plugins/forms/autogrowtextarea.js"></script>
<script type="text/javascript" src="js/plugins/forms/autotab.js"></script>

<script type="text/javascript" src="js/plugins/forms/jquery.dualListBox.js"></script>

<script type="text/javascript" src="js/plugins/forms/jquery.maskedinput.min.js"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.inputlimiter.min.js"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.tagsinput.min.js"></script>

<script type="text/javascript" src="js/plugins/other/calendar.min.js"></script>
<script type="text/javascript" src="js/plugins/other/elfinder.min.js"></script>

<script type="text/javascript" src="js/plugins/uploader/plupload.js"></script>
<script type="text/javascript" src="js/plugins/uploader/plupload.html5.js"></script>
<script type="text/javascript" src="js/plugins/uploader/plupload.html4.js"></script>
<script type="text/javascript" src="js/plugins/uploader/jquery.plupload.queue.js"></script>

<script type="text/javascript" src="js/plugins/ui/jquery.progress.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.jgrowl.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.tipsy.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.colorpicker.js"></script>

<script type="text/javascript" src="js/plugins/wizards/jquery.form.wizard.js"></script>
<script type="text/javascript" src="js/plugins/wizards/jquery.validate.js"></script>

<script type="text/javascript" src="js/plugins/ui/jquery.breadcrumbs.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.collapsible.min.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.ToTop.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.listnav.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.sourcerer.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.timeentry.min.js"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.prettyPhoto.js"></script>

<script type="text/javascript" src="js/custom.js"></script>

<style type="text/css">
	.paste,.cut,.copy,.h1,.h2,.h3,.h4,.h5,.h6,.insertImage,.insertTable,.code,.separator,.removeFormat,.html,.createLink,.insertUnorderedList,.insertOrderedList,.redo,.undo,.outdent,.indent{display:none!important;} 
</style>



