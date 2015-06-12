<!-- Content -->
<div class="content" ng-controller="AdvertisementCtrl" ng-init="intializeImageLoad()">
    <div class="title">
        <h5>Advertisement</h5>
        <div class="nNote nSuccess hideit success_message errcont" ng-if="message==1" ng-click="hidemsg()">
            <p><strong>SUCCESS: </strong><span ng-bind="messagedetail"></span></p>
        </div>
        <div class="nNote nFailure hideit error_message errcont" ng-if="message==2" ng-click="hidemsg()">
            <p><strong>ERROR: </strong><span ng-bind="messagedetail"></span></p>
        </div>
    </div>
    <form name="addcreate" class="mainForm" id="valid" action="#" method="post">
    <fieldset>
        <div class="widget">
            <div class="head">
                <h5 class="iList">Create</h5>
            </div>
            <div class="rowElem">
                <label for="name">Name : </label>
                <div class="formRight">
                    <input type="text" name="name" id="name" class="validate[required]" ng-model="adsObj.name">
                </div>
                <div class="fix"></div>
            </div>
            <div class="rowElem">
                <label for="target_url">Target Url : </label>
                <div class="formRight">
                    <input type="text" name="target_url" id="target_url" class="validate[required,custom[url]]" ng-model="adsObj.target_url">
                </div>
                <div class="fix"></div>
            </div>
            <div class="rowElem">
                <label for="game_name">Ads Position : </label>
                <div class="formRight">
                    <select name="position_type" id="position_type"  ng-model="adsObj.type" class="select-box validate[required]">
                        <option value="">Select Type</option>
                        <option ng-repeat="Type in PositionType" value="{{Type.ad_position_id}}">{{Type.type}}</option>
                    </select>
                </div>
                <div class="fix"></div>
            </div>
            <div class="rowElem">
                <label for="upload_btn">Upload Image : </label>
                <div class="formRight">
                    <input type="button" value="Remove" ng-show="adsObj.is_remove == 1" ng-click="removeImage();">
                    <div id="image_preview" ng-show="adsObj.is_preview==1">
                        <img src="{{adsObj.image_path}}">
                    </div>
                    <div  id="image_loader" ng-show="adsObj.is_loader==1">
                        <img src="<?php echo site_url();?>/img/211.GIF">
                    </div>
                    <input type="hidden" value="" ng-model="adsObj.image" name="image" id="image">
                    <input type="file" name="userfile" id="upload_btn" class="validate[required]" ng-show="adsObj.uploadbtn == 1" >
                </div>
                <div class="fix"></div>
            </div>
            <div class="rowElem">
                <label for="">&nbsp;</label>
                <div class="formRight">
                    <input type="button" value="Save" class="greyishBtn" ng-click="addAdvertisement()"/>
                </div>
                <div class="fix"></div>
            </div>
            <div class="fix"></div>
        </div>
    </fieldset>
</form>
</div>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine-en.js<?php version_control(TRUE); ?>"></script>
<script type="text/javascript" src="js/plugins/forms/jquery.validationEngine.js<?php version_control(TRUE); ?>"></script>
<script type="text/javascript" src="js/ajaxupload.js"></script>
<script> 
$("#valid").validationEngine();
angular.element('#upload_btn').change(function(){    
  angular.element(document.getElementById('upload_btn')).scope().intializeImageLoad();  
})
 </script>
