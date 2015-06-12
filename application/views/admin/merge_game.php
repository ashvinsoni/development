<div class="content">
	<div class="title">
		<h5>Mearge Game</h5>
	</div>

	<!-- Static table with resizable columns -->
	<form action="<?php echo base_url(); ?>admin" id="game_list" class="frm_input" method="post" accept-charset="utf-8"><div class="widget mrt20">
			<div class="head">
				<h5 class="iFrames"><label>Game Selected for Merging</label></h5>
			</div>
			<table cellpadding="0" cellspacing="0" width="100%" class="tableStatic resize display">
				<thead>
					<tr>
						<td style="width:37%;">Game Name</td>
						<td>Maximum Participents</td>
						<td>Participent Joined</td>
						<td>Participent Remaining</td>
						<td>Entry Fee</td>
					</tr>
				</thead>
				<tbody id="gamelisting_container">
                <tr>
			<td><span><?php echo $selected_game['game_name'];?></span></td>
			<td align="center"><?php echo $selected_game['size'];?></td>
			<td align="center"><?php echo ($selected_game['joined_player_count'] && $selected_game['joined_player_count']!="")? $selected_game['joined_player_count'] : 0;?></td>
			<td align="center"><?php echo $selected_game['size']-$selected_game['joined_player_count'];?></td>
			<td align="center">$ <?php echo $selected_game['entry_fee'];?></td>
			
		</tr>
                </tbody>
			</table>
		</div>
<div class="reamin-user-detail">
<div class="widget mrt20">
	<div class="head">
		<h5 class="iFrames"><label>Select Game to Merge with</label></h5>
		
	</div>
	<table cellpadding="0" cellspacing="0" width="100%" class="tableStatic resize display">
		<thead>
			<tr>
            	<td>&nbsp;</td>
				<td style="width:37%;">Game Name</td>
				<td>Maximum Participents</td>
				<td>Participent Joined</td>
				<td>Participent Remaining</td>
				<td>Entry Fee</td>
				
			</tr>
		</thead>
		<tbody id="gamelisting_container">
			<?php 
			
			if ($relavant_game) {
			foreach ($relavant_game as $key => $value) { ?>
				 <tr>
            	<td align="center"><input name="user" type="radio" value="" onclick = "showMerginPlayer('<?php echo $value['game_unique_id'];?>','<?php echo $selected_game['game_unique_id'];?>')"></td>
				<td><span><?php echo $value['game_name'];?></span></td>
				<td align="center"><?php echo $value['size'];?></td>
				<td align="center"><?php echo ($value['joined_player_count'])? $value['joined_player_count'] : 0;?></td>
				<td align="center"><?php echo $value['size']-$value['joined_player_count'];?></td>
				<td align="center">$ <?php echo $value['entry_fee'];?></td>
			</tr>
			<?php 
			} }
		else
		{
			echo "<tr> <td colspan='7'>".$this->lang->line('no_merging_game_found')."</td></tr>";
		}?>
           
        </tbody>
	</table>
	
</div>


</div>


<div id="merging_response"> </div>


	</form></div>
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script src="js/drag.ui.core.js"></script>
<script src="js/drag.ui.widget.js"></script>
<script src="js/game.js"></script>
<script src="js/drag.ui.mouse.js"></script>
<script src="js/drag.ui.draggable.js"></script>
<script src="js/drag.ui.sortable.js"></script>


<!-- Main View End -->
</div>
<!-- Footer View Start -->
<script type="text/javascript" src="js/plugins/ui/jquery.collapsible.min.js?v=1.4"></script>
<script type="text/javascript" src="js/common.js?v=1.4"></script>
<script type="text/javascript" src="js/plugins/ui/jquery.alerts.js?v=1.4"></script>

