<!-- Content -->
<div class="content" ng-controller="AdvertisementCtrl">
	<div class="title">
		<h5>Advertisement</h5>
	</div>
    <form>
		<div class="stats roster_ul frm_input">
			
			<div class="fix"></div>
		</div>
		<div style="float:right;padding-bottom:10px;">
               <input onclick="window.location.href='<?php echo site_url( 'admin/create_ads' ) ?>'" class="redBtn" type="button" value="Create New">
            </div>
		<div class="widget mrt20" id="news_wrapper" ng-init="getAdvertisement()">
			<div class="head">
				<h5 class="iFrames">Manage Advertisement</h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="news">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;">
							<input type="checkbox" id="all" onclick="ads.toggle_checkbox();">
						</th>
						<th>Name</th>
						<th>Target Url</th>
						<th>Ads Position</th>
                              <th>Ads Size</th>
						<th>View</th>
						<th>Click</th>
                              <th>Status</th>
                              <th>Actions</th>
					</tr>
				</thead>
                    <tbody>
                        <tr ng-repeat="ads in advertisement">
                            <td><input type="checkbox" name="ads_id[]" id="ads_id" class="ads_id" value="{{ads.ad_management_id}}"></td>
                            <td>{{ads.name}}</td>
                            <td>{{ads.target_url}}</td>
                            <td>{{ads.ads_position}} </td>
                            <td>{{ads.ads_size}} </td>
                            <td>{{ads.view}} </td>
                            <td>{{ads.click}} </td>
                            <td class="new_{{ads.ad_management_id}}" align="center">
                                <a href="javascript:;" ng-show="ads.status==1"><img src="images/active.png" id="imgactive_{{ads.ad_management_id}}"  class="status_{{ads.ad_management_id}}"></a>
                                <a href="javascript:;" ng-show="ads.status==0"><img src="images/deactivate.png" id="imgdeactive_{{ads.ad_management_id}}" class="status_{{ads.ad_management_id}}"></a>
                                 
                            </td>
                            <td align="center">
                                 <a href="<?php echo site_url();?>/admin/edit_ads/key/" title="Edit" class="btn14 game_edit_{{index}}">
                                      <img src="images/icons/color/pencil.png" alt="">
                                 </a>
                                 <a href="javascript:void(0);" title="Delete" class="btn14">
                                      <img src="images/icons/color/cross.png" alt="">
                                 </a>
                            </td>
                       </tr>
                    </tbody>
			</table>
		</div>
		<div class="pagination news">
			<span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" onclick="">
			</span>
			<!-- Pagination -->
		</div>

	</form>
</div>