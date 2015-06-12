<!-- Content -->
<div class="content">
    <div class="title">
        <h5>User</h5>
        <div class="nNote nSuccess hideit success_message errcont" ng-if="message==1" ng-click="hidemsg()">
            <p><strong>SUCCESS: </strong><span ng-bind="messagedetail"></span></p>
        </div>
        <div class="nNote nFailure hideit error_message errcont" ng-if="message==2" ng-click="hidemsg()">
            <p><strong>ERROR: </strong><span ng-bind="messagedetail"></span></p>
        </div>
    </div>
    <?php $attr = 'id="user_list"';
    echo form_open(current_url(), $attr); ?>
    <div class="widget mrt20" id="user_wrapper" data-ng-init="get_all_user_detail();">
        <div class="head">
            <h5 class="iFrames">Manage Users</h5>
            <div class="dataTables_filter" id="roster_filter" test-directive>
                <label>Search: <input type="text" placeholder="type here..." name="filter_name" ng-keyup="get_all_user_detail()" ng-model="search_keyword" uniform value="">
                    <div class="srch"></div>
                </label>
            </div>
            <a ng-click="userExportToCsv()" href="javascript:;" target="_blank" class="redBtn" style="display:inline-block;margin:5px 10px;padding:1px 5px 1px 5px;"> Export to CSV </a>
            <a href="<?php echo site_url('fantasyadmin/send_emails'); ?>" class="redBtn" style="display:inline-block;padding:1px 5px 1px 5px;margin-top:5px;"> Send email to all users </a>
            <a class="redBtn" style="display:inline-block;padding:1px 5px 1px 5px;margin-top:5px;cursor:pointer;" onclick="openPopDiv('sendemailpopup', 'bounceInDown');"> Send email to selected users </a>	
        </div>
        <table cellpadding="0" cellspacing="0" width="100%" class="display resize tableStatic user_tbl" id="user_tbl">
            <thead>
                <tr class="roster_th">
                    <th class="all_th" style="text-align:left;">
                        <input type="checkbox" id="all" check-all checkFor="ui" uniform>
                    </th>
                    <th align="left" data-ng-click="get_all_user_detail('nameOrder');">Name
                        <span class="ui-icon ui-icon-first_name icon-cls ui-icon-triangle-1-s"></span>
                    </th>
                    <th align="left" data-ng-click="get_all_user_detail('user_name');">UserName
                        <span class="ui-icon ui-icon-user_name icon-cls ui-icon-triangle-1-s"></span>
                    </th>
                    <th align="left" data-ng-click="get_all_user_detail('country');">Country
                        <span class="ui-icon ui-icon-country icon-cls ui-icon-triangle-1-s"></span>
                    </th>
                    <th align="left" data-ng-click="get_all_user_detail('email');">Email
                        <span class="ui-icon ui-icon-email icon-cls ui-icon-triangle-1-s"></span>
                    </th>
                    <th align="left" data-ng-click="get_all_user_detail('created_date');" style="width:140px;">Member Since
                        <span class="ui-icon ui-icon-created_date icon-cls ui-icon-triangle-1-s"></span>
                    </th>						<th align="right" style="width:135px;">Balance</th>						
                    <th style="width:80px;">Banned</th>
                </tr>					
            </thead>
            <tbody>
                <tr ng-repeat="userData in user_data">												
                    <td>
                        <input type="checkbox" name="ui[]"  class="user_id" value="{{userData.user_id}}" data-mails="{{userData.email}}" uniform>
                    </td>	
                    <td data-ng-bind="userData.name"></td>
                    <td data-ng-bind="userData.user_name"></td>
                    <td data-ng-bind="userData.country"></td>
                    <td data-ng-bind="userData.email"></td>
                    <td data-ng-bind="userData.created_date"></td>
                    <td data-ng-bind="userData.balance"></td>
                    <td align="center">
                        <img src="<?php echo site_url() ?>adminapi/images/deactivate.png" alt="" ng-if="userData.is_banned == 0" class="status_{{userData.user_id}}">
                        <img src="<?php echo site_url() ?>adminapi/images/active.png" alt="" ng-if="userData.is_banned == 1" class="status_{{userData.user_id}}">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="pagination roster" >			
        <div class="fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix">
            <div class="dataTables_length">
                <label>
                    <span class="itemsPerPage">Items per page:</span>
                    <span style="font-size:11px;">
                        <per-pagelimit on-changelimit="get_all_user_detail()" bind="start"></per-pagelimit>
                    </span>
                </label>
            </div>
            <div class="dataTables_length">
                <label>
                    <span class="itemsPerPage">{{start}} to {{start + limit}} of {{total}}</span>					
                </label>
            </div>
            <div class="pagination roster">
                <span class="action slect-status">				
                    <select name="status" id="status" ng-model="status" class="jw125"   uniform  >
                        <option value="" selected="selected">Select status</option>
                        <option value="1">Activate</option>
                        <option value="0">Banned</option>
                        <option value="2">Verify User Email</option>                    	
                    </select>					
                    <input type="button" value="Update" class="greyishBtn submitForm" style="float:left;" ng-click="update_batch_status_of_user();">
                </span>			
            </div>
            <div paging class="dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_full_numbers" page="1" page-size="limit" total="total" hide-if-empty="true" show-prev-next="true" paging-action="SetPagingAct('Paging Clicked', page)"></div>
        </div>
        <div class="clear"></div>

    </div>
</div>
<?php echo form_close(); ?>
</div>

<section class="popupWrapper animated" id="sendemailpopup" style="display:none">
    <section class="popup-inner">
        <div class="content" id="container">
            <div class="title">
                <a href="javascript:void(0);" class="icon-close" onClick="closePopDiv('sendemailpopup', 'bounceOutUp');
                                        $('.formError').hide();"></a>
                <h5>Send Emails</h5>
            </div>
            <form action="<?php echo SITE_URL(); ?>admin/send_emails" id="emailvalid" class="mainForm send_emails" method="post" accept-charset="utf-8">
                <fieldset>
                    <input type="hidden" id="action" name="action" value="add">
                    <div class="rowElem">
                        <label for="size">Subject</label>
                        <div class="formRight">
                            <input type="text" name="subject" id="subject" maxlength="150" class="validate[required,maxSize[150]]" style="width:50%;"/>
                            <div class="fix"></div>
                            <div class="error hide" style="color:red">Please enter subject</div>
                        </div>

                        <div class="fix"></div>

                    </div>

                    <div class="rowElem">
                        <label>Message</label>
                        <div class="formRight">
                                <!-- <textarea rows="8" cols="" name="message" id="message" maxlength="2000" class="wysiwyg validate[required,maxSize[2000]]" style="width:70%;"></textarea> -->
                            <textarea rows="8" cols="" name="message" id="message" maxlength="2000" class="wysiwyg validate[required,maxSize[2000]]" style="width:50%;">
				  			<table border="0" cellspacing="0" cellpadding="0" align="center" width="620" class="outer-tbl">
                                    <?php echo $this->load->view('emailer/send_email_editor_header');

                                    echo $this->load->view('emailer/footer');
                                    ?>
				  			 </table>
                            </textarea>
                        </div>
                        <div class="fix"></div>
                    </div>

                    <div class="rowElem">
                        <label for="">&nbsp;</label>
                        <div class="formRight">
                            <input type="hidden" value="" name="ret_email" class="ret_email"/>
                            <input type="submit" value="Submit" class="greyishBtn" id="send_emails" />
                        </div>
                        <div class="fix"></div>
                    </div>
                    <div class="fix"></div>
                </fieldset>
            </form>
        </div>
    </section>
</section>


<script type="text/javascript">

// popup div js function
    function openPopDiv(e)
    {
        var id_array = [];
        $.each($('.user_id:checked'), function (key, obj) {
            id_array.push($(this).attr('data-mails'));
        });
        $('.ret_email').val(id_array);
        if (document.getElementById("fade")) {
            $("#fade").remove()
        }
        $('<div id="fade"></div>').appendTo($("body"));
        $("#fade").click(function () {
            closePopDiv(e)
        });
        compDiv = e;
        centerPopup(e);
        loadPopup(e)
    }
    function closePopDiv(e) {
        compDiv = e;
        disablePopup(e)
    }
    function loadPopup(e) {
        $("#fade").fadeIn(200);
        $("#" + e).addClass("bounceInDown").fadeIn(200);
        setTimeout(function () {
            $("#" + e).removeClass("bounceInDown")
        }, 1100)
    }
    function disablePopup(e) {
        $("#fade").fadeOut(200);
        setTimeout(function () {
            $("#" + e).fadeOut(200).removeAttr("style")
        }, 200)
    }
    function centerPopup(e) {
        var t = $(document).width();
        var n = $(document).height();
        var r = $("#" + e).height();
        var i = $("#" + e).width();
        arrPageScroll = ___getPageScroll();
        arrPageSizes = ___getPageSize();
        $("#" + e).css({position: "absolute", top: arrPageSizes[3] / 2 - $("#" + compDiv).height() / 2 + getScrollTop() + "px", left: t / 2 - i / 2, "z-Index": 99});
        ems = parseInt($("#" + e).css("top"));
        if (ems < 0) {
            $("#" + e).css({position: "absolute", top: 10})
        }
        $("#fade").css({height: "100%", opacity: .6, width: "100%", backgroundColor: "#000", position: "fixed", "z-index": "12", left: 0, top: 0})
    }
    function ___getPageSize() {
        var e, t;
        if (window.innerHeight && window.scrollMaxY) {
            e = window.innerWidth + window.scrollMaxX;
            t = window.innerHeight + window.scrollMaxY
        } else if (document.body.scrollHeight > document.body.offsetHeight) {
            e = document.body.scrollWidth;
            t = document.body.scrollHeight
        } else {
            e = document.body.offsetWidth;
            t = document.body.offsetHeight
        }
        var n, r;
        if (self.innerHeight) {
            if (document.documentElement.clientWidth) {
                n = document.documentElement.clientWidth
            } else {
                n = self.innerWidth
            }
            r = self.innerHeight
        } else if (document.documentElement && document.documentElement.clientHeight) {
            n = document.documentElement.clientWidth;
            r = document.documentElement.clientHeight
        } else if (document.body) {
            n = document.body.clientWidth;
            r = document.body.clientHeight
        }
        if (t < r) {
            pageHeight = r
        } else {
            pageHeight = t
        }
        if (e < n) {
            pageWidth = e
        } else {
            pageWidth = n
        }
        arrayPageSize = new Array(pageWidth, pageHeight, n, r);
        return arrayPageSize
    }
    function ___getPageScroll() {
        var e, t;
        if (self.pageYOffset) {
            t = self.pageYOffset;
            e = self.pageXOffset
        } else if (document.documentElement && document.documentElement.scrollTop) {
            t = document.documentElement.scrollTop;
            e = document.documentElement.scrollLeft
        } else if (document.body) {
            t = document.body.scrollTop;
            e = document.body.scrollLeft
        }
        arrayPageScroll = new Array(e, t);
        return arrayPageScroll
    }
    function getScrollTop() {
        var e = document.body.scrollTop;
        if (e == 0) {
            if (window.pageYOffset)
                e = window.pageYOffset;
            else
                e = document.body.parentElement ? document.body.parentElement.scrollTop : 0
        }
        return e
    }
    var compDiv;
    var arrPageScroll;
    var arrPageSizes = new Array;
    $(window).resize(function () {
        $("#fade").width($(window).width()).height($(document).height())
    });
    $(document).ready(function () {
        $("#fade").click(function () {
            closePopDiv(compDiv)
        });
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                closePopDiv(compDiv)
            }
        })
    });
//end


    $('#send_emails').click(function (e) {
        showloading();
        //return false;
        e.preventDefault();
        if ($("#subject").val() == '')
        {
            hideloading();
            $('.error').show();
            return false;
        }
        else
        {
            $('.error').hide();
            $('#emailvalid').submit();
        }
    });
    $(document).ready(function () {        
        $('#all').click(function (event) {  //on click 
            if (this.checked) { // check select status
                $('.user_id').each(function () { //loop through each checkbox
                    this.checked = true;  //select all checkboxes with class "checkbox1"               
                });
            } else {
                $('.user_id').each(function () { //loop through each checkbox
                    this.checked = false; //deselect all checkboxes with class "checkbox1"                       
                });
            }
            $.uniform.update('.user_id');
        });

    });
</script>

<style type="text/css">
    .paste,.cut,.copy,.h1,.h2,.h3,.h4,.h5,.h6,.insertImage,.insertTable,.code,.separator,.removeFormat,.html,.createLink,.insertUnorderedList,.insertOrderedList,.redo,.undo,.outdent,.indent{display:none!important;} 
    #roster_filter{top: 5px;}

</style>