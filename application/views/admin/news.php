<!-- Content -->
<div class="content">
	<div class="title">
		<h5>News</h5>
	</div>
	<?php $frm_attr = 'id="news_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">
			
			<div class="fix"></div>
		</div>
		<div style="float:right;padding-bottom:10px;">
               <input onclick="window.location.href='<?php echo site_url( 'admin/add_news' ) ?>'" class="redBtn" type="button" value="Create New">
        </div>
		<div class="widget mrt20" id="news_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage News</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="news">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="News.toggle_checkbox();">
						</th>
						<th style="width:30%;" align="left">Title</th>
						<th align="left">Description</th>
						<th align="left" style="width:12%;">Created date</th>	
						<th style="width:6%;">Status</th>
						<th style="width:10%;">Action</th>
					</tr>
				</thead>
				<tbody id="newslisting_container"></tbody>
			</table>
		</div>
		<div class="pagination news">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="News.UpdateNews();">
			</span>
			<!-- Pagination -->
		</div>

	<?php echo form_close(); ?>
</div>

<script type="text/x-handlebars-template" id="NewsListingTemplete">
	{{#each this}}
		<tr>
			<td><input type="checkbox" name="news_id[]" id="news_id" class="news_id" value="{{this.news_id}}"></td>
			<td>{{this.title}}</td>
			<td>{{{this.description}}}</td>
			<td>{{this.create_date}} </td>
			<td class="new_{{this.news_id}}" align="center">
				{{#compare this.status 1 operator="=="}}
					<img src="images/active.png" id="imgactive_{{this.news_id}}" onclick="News.changestatusbybutton('{{this.news_id}}',0);" class="status_{{this.news_id}}">
				{{/compare}}
				{{#compare this.status 0 operator="=="}}
					<img src="images/deactivate.png" id="imgdeactive_{{this.news_id}}" onclick="News.changestatusbybutton('{{this.news_id}}',1);" class="status_{{this.news_id}}">
				{{/compare}}
			</td>
			<td align="center">
				<a href="javascript:void(0);" title="Edit" class="btn14 game_edit_{{@index}}" onclick="News.Editnews({{this.news_id}});">
					<img src="images/icons/color/pencil.png" alt="">
				</a>
				<a href="javascript:void(0);" title="Delete" class="btn14" onclick="jConfirm( DELETE_CONFIRM_NEWS , 'Please Confirmation', function(r) { if (r) window.location = '<?php echo site_url( 'admin/delete_news' ); ?>/{{this.news_id}}'; });">
					<img src="images/icons/color/cross.png" alt="">
				</a>
			</td>
		</tr>
	{{/each}}
</script>
<?php echo '<script type="text/javascript"> var newslist = {}; '; if ( isset( $all_news ) ) echo 'newslist = '.json_encode( $all_news  ).';'; echo '</script>'; ?>


<script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/tables/colResizable.min.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/handlebars.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/news.js<?php version_control(); ?>"></script>