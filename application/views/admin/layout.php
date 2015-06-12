<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
		<link rel="shortcut icon" href="<?php echo base_url(); ?>img/favicon.ico" type="image/x-icon" />
		<title><?php echo ( isset( $title ) ) ? $title : PROJECT_NAME_FORMATED; ?></title>

		<?php $this->load->view( 'admin/_header' ); ?>
          <script>
             
          var siteUrl = '<?php echo site_url();?>';
          </script>
	</head>
	<body data-ng-app="vsportAdmin">

		<!-- Nav Bar Start -->
			<?php $this->load->view( 'admin/_nav' ); ?>
		<!-- Nav Bar End -->
		<?php if ( $this->user_type_admin == ADMIN_TYPE ){ ?>
			<!-- Content wrapper -->
			<div class="wrapper">
			<?php $this->load->view( 'admin/_side_nav' ); ?>
		<?php } ?>
			<!-- Main View Start -->
				<?php $this->load->view( "$content_view" ); ?>
			<!-- Main View End -->
		<?php if ( $this->user_type_admin == ADMIN_TYPE ){ ?>
			</div>
		<?php } ?>
		<!-- Footer View Start -->
			<?php $this->load->view( 'admin/_footer' ); ?>
		<!-- Footer View End -->

	</body>
</html>
