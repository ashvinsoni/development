<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" ng-app="mdapp">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<link rel="shortcut icon" href="<?php echo base_url('adminassest'); ?>/images/favicon.ico" type="image/x-icon" />
		<title><?php echo ( isset( $title ) ) ? $title : 'VFSAdmin'; ?></title>
	    <script>
	        var siteUrl = '<?php echo site_url();?>';
	        var mindate = '<?php echo format_date();?>';
	    </script>

		<?php $this->load->view( 'admintemplate/_header' ); ?>
	</head>
	<body>
		<!-- Nav Bar Start -->
		<?php $this->load->view( 'admintemplate/_nav' ); ?>
		<!-- Nav Bar End -->
		
		<?php if ( $this->user_type_admin == ADMIN_TYPE ){ ?>
			<!-- Content wrapper -->
            <div class="wrapper">

				<?php $this->load->view( 'admintemplate/_side_nav' ); ?>
		<?php } ?>

		        <div class="content" ng-view>
		                
				</div>


		<?php if ( $this->user_type_admin == ADMIN_TYPE ){ ?>
			</div>
			<!-- Content -->
		<?php } ?>

		<!-- Footer View Start -->
		<?php $this->load->view( 'admintemplate/_footer' ); ?>
		<!-- Footer View End -->
	</body>
</html>