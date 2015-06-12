<!-- Top navigation bar -->
<div id="topNav">
    <div class="fixed">
        <div class="wrapper">
            <?php if (!isset($this->user_type_admin) || $this->user_type_admin != ADMIN_TYPE) { ?>
                <div class="backTo">
                    <a ng-href="<?php echo site_url(); ?>" target="_self">
                        <img src="adminapi/images/icons/topnav/mainWebsite.png" alt="" />
                        <span>Main website</span>
                    </a>
                </div>
                <div class="userNav">
                    <ul>
                        <li>
                            <a href="#" title="">
                                <img src="adminapi/images/icons/topnav/help.png" alt="" />
                                <span>Help</span>
                            </a>
                        </li>
                    </ul>
                </div>
            <?php } else if (isset($this->user_type_admin) && $this->user_type_admin == ADMIN_TYPE) { ?>
                <div class="welcome">
                    <a href="javascript:void(0);" title=""><img src="adminapi/images/userPic.png" alt="" /></a>
                    <span><?php
                        if (isset($this->admin_fullname) && $this->admin_fullname != '') {
                            echo $this->admin_fullname;
                        } else {
                            echo ADMIN_TYPE;
                        }
                        ?> !</span>
                </div>
                <div class="userNav">
                    <ul>
                        <li>
                            <a ng-href="<?php echo site_url('fantasyadmin/logout'); ?>" title="" class="logout" target="_self">
                                <img src="adminapi/images/icons/topnav/logout.png" alt="" />
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            <?php } ?>
            <div class="fix"></div>
        </div>
    </div>
</div>

<div class="pt20 errmain">

    <?php if (isset($warning_message) && !empty($warning_message)) { ?>
        <div class="nNote nWarning hideit warning_message errcont">
            <p><strong>WARNING: </strong><?php echo $warning_message ?></p>
        </div>
    <?php } ?>

    <?php if (isset($information_message) && !empty($information_message)) { ?>
        <div class="nNote nInformation hideit information_message errcont">
            <p><strong>INFORMATION: </strong><?php echo $information_message ?></p>
        </div>
    <?php } ?>

    <?php if (isset($success_message) && !empty($success_message)) { ?>
        <div class="nNote nSuccess hideit success_message errcont">
            <p><strong>SUCCESS: </strong><?php echo $success_message ?></p>
        </div>
    <?php } ?>

    <?php if (isset($error_message) && !empty($error_message)) { ?>
        <div class="nNote nFailure hideit error_message errcont">
            <p><strong>ERROR: </strong><?php echo strip_tags($error_message); ?></p>
        </div>
    <?php } ?>

</div>