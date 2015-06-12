<!--Drag and Drop Table Start-->
<span id="err_merge_game"></span>
<div style="clear:both;"></div>
<div class="tblfrm drag-drop">
    <div class="col beat-game-name">
        <section class="top-list"><?php echo $selected_game_player['game_name'];?></section>
        <div class="beat-game-min-h">
            <table>
                <input type="hidden" id="game_main_size" value="<?php echo $selected_game_player['size'];?>" />
                <input type="hidden" id="game_selected_size" value="<?php echo $main_game_player['size'];?>" /> 
                <input type="hidden" id="game_main_unique_id" value="<?php echo $selected_game_player['game_unique_id'];?>" />
                <input type="hidden" id="game_selected_unique_id" value="<?php echo $main_game_player['game_unique_id'];?>" /> 
                <tbody id="merge_lft">
                    <?php 
                    if ($selected_game_player['game_user']){
                        foreach ($selected_game_player['game_user'] as $val1) { ?>
                            <tr rel="<?php echo $val1['user_id'];?>">
                                <td><?php echo $val1['full_name'];?></td>
                            </tr>
                    <?php }
                    } else {
                    ?>
                    <tr id='np_plr'><td>No Player to select</td></tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
    <div class="dragndrop"></div>
    <div class="col right beat-game-name">
        <section class="top-list"><?php echo $main_game_player['game_name'];?></section>
        <div class="beat-game-min-h">
            <table><!-- Right section for game user -->
                <tbody id="merge_rht">
                    <?php 
                    if ($main_game_player['game_user']){
                        foreach ($main_game_player['game_user'] as $val2) { ?>
                        <tr rel="<?php echo $val2['user_id'];?>">
                            <td><?php echo $val2['full_name'];?></td>
                        </tr>
                    <?php }
                    } else {
                    ?>
                        <tr id='np_plr'><td>No Player to select</td></tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
    <div class="clear"></div>
    <input type="button" class="greyishBtn mt20" name="save" value="Merge Game" onclick="saveMergeGame();">
</div>

<!--Drag and Drop Table End-->
<script type="text/javascript">
$(function(){
    $html_tr = "<tr id='np_plr'><td>No Player to select</td></tr>";
    //consolidate popup drag n drop callin
    $(".drag-drop table tbody" ).sortable({
        connectWith: ".drag-drop table tbody",
        receive: function(event, ui) {              
            if ($(this).attr('id') == "merge_lft") {    
                $("#merge_lft #np_plr").remove();                   
                if($("#merge_rht").children().length ==0){
                    $("#merge_rht").html($html_tr);
                }
            } else if ($(this).attr('id') == "merge_rht") { 
                $("#merge_rht #np_plr").remove();           
                if ($("#merge_lft").children().length == '0') {
                    $("#merge_lft").html($html_tr);
                }
            }
        }
    });
    //end
});


</script>


<style type="text/css">
.top-list{background: #efefef url(../images/leftNavBg.png) repeat-x;padding: 8px 10px;border-top: 1px solid #d5d5d5;border-bottom: 1px solid #d5d5d5;}
.beat-game-name{border:1px solid #ccc;border-top:none;}
.beat-game-min-h{min-height:200px;height:200px;oveflow:y:auto;overflow-x:hidden;}
.beat-game-min-h table{width:100%;}
</style>