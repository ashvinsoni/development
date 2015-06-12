
<!-- Content -->
<div class="content" data-ng-controller="RosterCtrl">
	<div class="title">
		<h5>Roster</h5>
	</div>
	<?php $frm_attr = 'id="roster_list"'; echo form_open( current_url() , $frm_attr ); ?>
		<div class="stats roster_ul frm_input">

			<ul>
				<li>
					<select name="league_id" class="jw125" ng-change="get_roster_position_team_by_league()" uniform ng-model="league_id" id="league_id" name="league_id" data-ng-init="league_id=2">
						<option value="">Select League</option>
						<option ng-repeat="(key, value) in leagueList" value="{{key}}" >
                        	{{value}}
                    	</option>                     	
					</select>
				</li>
				<li>
					<select name="position" id="position" class="jw125" ng-change="get_all_roster()" uniform ng-model="filterposition" id="filterposition">
						<option value="">Select position</option>
						<option ng-repeat="positionData in position"
                            value="{{positionData}}" >
                        {{positionData}}
                    </option> 
					</select>
				</li>
				<li>
					<select name="team_abbreviation" id="team_abbreviation" ng-change="get_all_roster()" uniform ng-model="team_abbreviation" id="team_abbreviation">
						<option value="">Select team</option>
						<option ng-repeat="teamData in team"
                            value="{{teamData.team_abbreviation}}" >
                        {{teamData.team_name}}
                    	</option> 
					</select>
				</li>
			</ul>
			<div class="fix"></div>
		</div>

		<div class="widget mrt20" id="roster_wrapper">
			<div class="head">
				<h5 class="iFrames">Manage Player Roster</h5>
				<div class="dataTables_filter" style="margin-top:-15px;" >
					<label>Search: <input type="text" placeholder="type here..." name="search_keyword" ng-keyup="get_all_roster()" id="search_keyword" ng-model="search_keyword"  value="" />
					<div class="srch"></div>
					</label>
				</div>
			</div>

			<table cellpadding="0" cellspacing="0" width="100%" class="display resize frm_input roster" id="roster">
				<thead>
					<tr class="roster_th">
						<th class="all_th" style="width:4%;text-align:left;">
							<input type="checkbox" id="all" check-all checkFor="player_unique_id">
						</th>
						<th align='left' data-ng-click="get_all_roster('first_name');">First Name
							<span class="ui-icon ui-icon-first_name icon-cls ui-icon-triangle-1-s"></span>
						</th>
						<th align='left' data-ng-click="get_all_roster('last_name');">Last Name
							<span class="ui-icon ui-icon-last_name icon-cls ui-icon-triangle-1-s"></span>
						</th>
						<th align='left' data-ng-click="get_all_roster('team_name');">Team
							<span class="ui-icon ui-icon-team_name icon-cls ui-icon-triangle-1-s"></span>
						</th>
						<th data-ng-click="get_all_roster('position');">Position
							<span class="ui-icon ui-icon-position icon-cls ui-icon-triangle-1-s"></span>
						</th>
						<!--
						<th align='left'>First Salary</th>
						<th align='left'>Previous Salary</th>
						-->
						<th>Current Salary</th>
                        <!--<th>Weightage</th>-->
						<th>Health / Injury</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr ng-if="rosterlen == 0">
					<td colspan="7">No result found.</td>
					</tr>
					<tr ng-repeat="rosterData in roster">
						<td><input type="checkbox" name="player_unique_id[]" id="player_unique_id" class="player_unique_id" value="{{rosterData.player_unique_id}}"></td>
						<td data-ng-bind="rosterData.first_name"></td>
						<td data-ng-bind="rosterData.last_name"></td>
						<td data-ng-bind="rosterData.team_market" "rosterData.team_name"></td>
						<td align="center" data-ng-bind="rosterData.position"></td>
						<!--
						<td data-ng-bind="rosterData.first_salary"></td>
			            <td data-ng-bind="rosterData.previous_salary"></td>
			            -->
			           <td>
			           <input type="text" name="salary_{{rosterData.player_unique_id}}" id="salary" data-ng-if="rosterData.active=='1'" value="{{rosterData.salary}}" data-pui="{{rosterData.player_unique_id}}" class="numbersOnly" maxlength="9" style="width:65%;">
			           <input type="text" name="salary_{{rosterData.player_unique_id}}" id="salary" data-ng-if="rosterData.active=='0'" value="0" data-pui="{{rosterData.player_unique_id}}" class="numbersOnly" maxlength="9" style="width:65%;">
			           </td>           
						<td>
							<input type="text" name="injury_status_{{rosterData.player_unique_id}}" id="injury_status" value="{{rosterData.injury_status}}" maxlength="10" style="width:65%;">
						</td>
						<td align="center">
						<img data-ng-if="rosterData.active == '1'" src="images/active.png" class="status_{{rosterData.player_unique_id}}">
						<img data-ng-if="rosterData.active == '0'" src="images/deactivate.png" class="status_{{rosterData.player_unique_id}}">													
						</td>	
					</tr>
				</tbody>
			</table>
		</div>

		<div class="pagination roster">
			<!-- <span class="action">
				<?php if ( isset( $status) ){ $attr = 'id="status" class="jw125" '; echo form_dropdown( 'status' , $status , '' , $attr ); } ?>
				<input type="button" value="Save" class="greyishBtn submitForm" style="float:left;" onclick="Roster.UpdateRoster();">
				<input type="button" value="Release" class="redBtn" style="float:left;" onclick="Roster.ReleasePlayer();">
			</span> -->
			<div class="fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix">
                <div class="dataTables_length">
                    <label>
                        <span class="itemsPerPage">Items per page:</span>
                        <span style="font-size:11px;">
                            <per-pagelimit on-changelimit="get_all_roster()" bind="start"></per-pagelimit>
                        </span>
                    </label>
                </div>
                <div class="dataTables_length">
                    <label>
                        <span class="itemsPerPage">{{start}} to {{start + limit}} of {{total}}</span>					
                    </label>
                </div>
                <div paging class="dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_full_numbers" page="1" page-size="limit" total="total" hide-if-empty="true" show-prev-next="true" paging-action="SetPagingAct('Paging Clicked', page)"></div>
            </div>

			<div class="pagination roster">
				<span class="action" ng-show="league_id">
					
	
				
				<!-- <span style="width: 125px; text-align: left;">Select status</span>
					<select name="status" id="status" ng-model="status" class="jw125" style="opacity: 0; width: 125px;">
						<option value="">Select status</option>
						<option value="1">Activate</option>
						<option value="0">Deactivate</option>
					</select> -->
					<select name="status" id="status" ng-model="status" class="jw125"   uniform >
						<option value="">Select status</option>
						<option value="1">Activate</option>
						<option value="0">Deactivate</option>                    	
					</select>
				
					<input type="button" value="Save" class="greyishBtn submitForm" style="float:left;" ng-click="UpdateRoster();">
					<input type="button" value="Release" class="redBtn" style="float:left;" ng-click="ReleasePlayer();">
				</span>			
			</div>
		</div>

	<?php echo form_close(); ?>
</div>


<script type="text/javascript">
	var rosterlist = {};
	var position   = {};
	var team       = {};
	var leagueList       = {};
	
	<?php if ( isset( $position ) )	echo 'position = '.json_encode( $position  ).';'; ?>
	<?php if ( isset( $sport ) )	echo 'leagueList = '.json_encode( $sport  ).';'; ?>
	<?php if ( isset( $team ) )	echo 'team = '.json_encode( $team  ).';'; ?>
</script>

<!-- <script type="text/javascript" src="js/plugins/tables/jquery.dataTables.js"></script> -->
<script type="text/javascript" src="js/plugins/forms/forms.js<?php version_control( TRUE ); ?>"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js<?php version_control( TRUE ); ?>"></script>
<!-- <script type="text/javascript" src="js/plugins/tables/colResizable.min.js"></script> -->
<!-- <script type="text/javascript" src="js/handlebars.js"></script> -->

<!--<script type="text/javascript" src="js/roster.js<?php version_control(); ?>"></script>-->