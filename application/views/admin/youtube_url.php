<!-- Content -->

<div class="content">
	<div class="title">
		<h5>Youtube Url</h5>
	</div>
	<form action="<?php echo current_url();?>" class="mainForm" method="post" id="valid">
		
			<!-- Input text fields -->
			<fieldset>
				<div class="widget first">
					<div class="head">
						<h5 class="iList">Add Url</h5>
					</div>
					<div class="rowElem" style="width:70%;">
						<label>Enter Youtube Url:</label>
						<div class="formRight" style="right:10%;">
							<input type="text" class="validate[required]" id="youtube_url" name="youtube_url" style="width:75%;"/>
					 		<input type="submit" id="add_url" value="Add New" class="greyishBtn submitForm" />
						</div>
					</div>
					<div class="fix"></div>
				</div>
			</fieldset>
		</form>
			
	<?php $frm_attr = 'id="url_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">
			
			<div class="fix"></div>
		</div>
		<div class="widget mrt20" id="url_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Url</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="url">
				<thead>
					<tr class="roster_th">
						<th style="width:5%;">Sr.No.</th>
						<th align="left">Youtube Url</th>
						<th align="left" style="width:24%;">Created date</th>	
						<th style="width:16%;">Status</th>
					</tr>
				</thead>
				<tbody id="urllisting_container"></tbody>
			</table>
		</div>
		<div class="pagination url">
			
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="UrlListingTemplete">
	{{#each this}}
		<tr>
			<td>{{#indexing @index}}{{/indexing}}</td>
			<td><a href="{{this.youtube_url}}" target="_blank">{{this.youtube_url}}</a></td>
			<td>{{this.created_date}}</td>
			<td class="new_{{this.youtube_id}}" align="center">
				{{#compare this.status 1 operator="=="}}
					<img src="images/active.png" id="imgactive_{{this.youtube_id}}"  class="status_{{this.youtube_id}}">
				{{/compare}}
				{{#compare this.status 0 operator="=="}}
					<img src="images/deactivate.png" id="imgdeactive_{{this.youtube_id}}" onclick="Url.changestatusbybutton('{{this.youtube_id}}');" class="status_{{this.youtube_id}}">
				{{/compare}}
			</td>
			
		</tr>
	{{/each}}
</script>
<?php echo '<script type="text/javascript"> var urllist = {}; '; if ( isset( $all_youtube_url ) ) echo 'urllist = '.json_encode( $all_youtube_url  ).';'; echo '</script>'; ?>


<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/youtube_url.js<?php version_control(); ?>"></script>