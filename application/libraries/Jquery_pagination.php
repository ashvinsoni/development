<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter
*
* An open source application development framework for PHP 4.3.2 or newer
*
* @package CodeIgniter
* @author ExpressionEngine Dev Team
* @copyright Copyright (c) 2006, EllisLab, Inc.
* @license http://codeigniter.com/user_guide/license.html
* @link http://codeigniter.com
* @since Version 1.0
* @filesource
*/

// ------------------------------------------------------------------------

/**
* Pagination Class
*
* @package CodeIgniter
* @subpackage Libraries
* @category Pagination
* @author ExpressionEngine Dev Team
* @link http://codeigniter.com/user_guide/libraries/pagination.html
*/
class Jquery_pagination
{

var $base_url        = ''; // The page we are linking to
var $total_rows      = ''; // Total number of items (database results)
var $per_page        = 10; // Max number of items you want shown per page
var $num_links       = 2; // Number of "digit" links to show before/after the currently viewed page
var $cur_page        = 0; // The current page being viewed
var $first_link      = ' << ';
var $next_link       = '&gt;';
var $prev_link       = '&lt;';
var $last_link       = ' >> ';
var $uri_segment     = 3;

var $full_tag_open   = '';
var $full_tag_close  = '';

var $first_tag_open  = '';
var $first_tag_close = '&nbsp;';

var $last_tag_open   = '&nbsp;';
var $last_tag_close  = '';

var $cur_tag_open    = '<a class="active" href="javascript:void(0);" hidefocus="true">';
var $cur_tag_close   = '</a>';

var $next_tag_open   = '&nbsp;';
var $next_tag_close  = '&nbsp;';

var $prev_tag_open   = '&nbsp;';
var $prev_tag_close  = '';

var $num_tag_open    = '&nbsp;';
var $num_tag_close   = '';

var $output_start    = '<section class="d-pagination">';
var $output_end      = '</section>';

// Added By Tohin
var $js_rebind        = '';
var $div              = '';
var $postVar          = '';
var $additional_param = '';

// Added BY Vishal

var $is_handelbar      = FALSE;
var $func              = '';
var $befor_loading     = '';
var $after_loading     = '';
var $fist_offset_blank = TRUE;

private $first_link_count = 0;
var $sorting_param = '';

/**
* Constructor
*
* @access public
* @param array initialization parameters
*/
	function CI_Pagination( $params = array() )
	{
		if ( count( $params ) > 0 )
		{
			$this->initialize( $params );
		}

		log_message('debug', "Pagination Class Initialized");
	}

// --------------------------------------------------------------------

/**
* Initialize Preferences
*
* @access public
* @param array initialization parameters
* @return void
*/
	function initialize($params = array())
	{
		if (count( $params ) > 0)
		{
			foreach ( $params as $key => $val )
			{
				if ( isset( $this->$key ) )
				{
					$this->$key = $val;
				}
			}
		}
	}

// --------------------------------------------------------------------

/**
* Generate the pagination links
*
* @access public
* @return string
*/

	function create_links()
	{
		// If our item count or per-page total is zero there is no need to continue.
		if ( $this->total_rows == 0 OR $this->per_page == 0 )
		{
			return '';
		}

// var_dump($this->total_rows);
// var_dump($this->per_page);
		// Calculate the total number of pages
		$num_pages = ceil( $this->total_rows / $this->per_page );

		// Is there only one page? Hm... nothing more to do here then.
		if ( $num_pages == 1 )
		{
			$info = 'Showing : ' . $this->total_rows;
			return $info;
		}

		// Determine the current page number.
		$CI =& get_instance();
		if ( $CI->uri->segment( $this->uri_segment ) != 0 )
		{
			$this->cur_page = $CI->uri->segment( $this->uri_segment );

			// Prep the current page - no funny business!
			$this->cur_page = (int) $this->cur_page;
		}

		$this->num_links = (int)$this->num_links;

		if ($this->num_links < 1)
		{
			show_error( 'Your number of links must be a positive number.' );
		}

		if ( ! is_numeric( $this->cur_page ) )
		{
			$this->cur_page = 0;
		}

		// Is the page number beyond the result range?
		// If so we show the last page
		if ( $this->cur_page > $this->total_rows )
		{
			$this->cur_page = ( $num_pages - 1 ) * $this->per_page;
		}

		$uri_page_number = $this->cur_page;
		$this->cur_page = floor( ( $this->cur_page/$this->per_page ) + 1 );

		// Calculate the start and end numbers. These determine
		// which number to start and end the digit links with
		$start = ( ( $this->cur_page - $this->num_links ) > 0 ) ? $this->cur_page -  ( $this->num_links - 1 ) : 1;
		$end   = ( ( $this->cur_page + $this->num_links ) < $num_pages ) ? $this->cur_page + $this->num_links : $num_pages;

		// Add a trailing slash to the base URL if needed
		$this->base_url = rtrim( $this->base_url , '/' ) .'/';

		// And here we go...
		$output = '';
		//$output = '<span class="left">';

		// SHOWING LINKS

		$curr_offset = $CI->uri->segment( $this->uri_segment );
		$info = 'Showing <span>' . ( $curr_offset + 1 ) . ' - ' ;

		if( ( $curr_offset + $this->per_page ) < ( $this->total_rows -1 ) )
			$info .= $curr_offset + $this->per_page;
		else	//condition added by rishi on 1/4/2012 for fixing showing records numbers when total no of records are 6
		{
			if( $this->cur_page==1 )
			{
				$info .= $this->total_rows-1;
			}
			else
			{
				$info .= $this->total_rows;
			}
		}

		/*if( ( $curr_offset + $this->per_page ) < ( $this->total_rows -1 ) )
			$info .= $curr_offset + $this->per_page;
		else
			$info .= $this->total_rows;*/

		$info .= '</span> of <span>' . $this->total_rows . '</span> records ';

		//$output .= $info;
	 
		// $output .= '</span>';
		 $output .= $this->output_start;
		// Render the "First" link
		if ( $this->cur_page > $this->num_links )
		{
			$output .= $this->first_tag_open . $this->getAJAXlink( '' , $this->first_link ) . $this->first_tag_close;
		}

		// Render the "previous" link
		if ( $this->cur_page != 1 )
		{
			$i = $uri_page_number - $this->per_page;
			if ( $i == 0 ) $i = '';
			$output .= $this->prev_tag_open . $this->getAJAXlink( $i, $this->prev_link ) . $this->prev_tag_close;
		}

		// Write the digit links
		for ( $loop = $start -1; $loop <= $end; $loop++ )
		{
			$i = ($loop * $this->per_page) - $this->per_page;

			if ( $i >= 0 )
			{
				if ($this->cur_page == $loop)
				{
					$output .= $this->cur_tag_open.$loop.$this->cur_tag_close; // Current page
				}
				else
				{
					$n = ($i == 0) ? '' : $i;
					$output .= $this->num_tag_open . $this->getAJAXlink( $n, $loop ) . $this->num_tag_close;
				}
			}
		}

		// Render the "next" link
		if ( $this->cur_page < $num_pages )
		{
			$output .= $this->next_tag_open . $this->getAJAXlink( $this->cur_page * $this->per_page , $this->next_link ) . $this->next_tag_close;
		}

		// Render the "Last" link
		if ( ( $this->cur_page + $this->num_links ) < $num_pages )
		{
			$i = ( ( $num_pages * $this->per_page ) - $this->per_page );
			$output .= $this->last_tag_open . $this->getAJAXlink( $i , $this->last_link ) . $this->last_tag_close;
		}

		// Kill double slashes. Note: Sometimes we can end up with a double slash
		// in the penultimate link so we'll kill all double slashes.
		$output = preg_replace( "#([^:])//+#" , "\\1/" , $output );

		// Add the wrapper HTML if exists
		$output = $this->full_tag_open.$output.$this->full_tag_close;
		$output .= $this->output_end;
		return $output;
	}

	function getAJAXlink( $count , $text )
	{

		if( $this->div == '' )
			return '<a href="'. $this->base_url . $count . '">'. $text .'</a>';

		if( $this->additional_param == '' )
		 $this->additional_param = "{'t' : 't'}";

		$pagin_link = '';

		if ( !$count && $this->fist_offset_blank === FALSE )
		{
			$count = '-';
			$this->first_link_count ++;
		}
		else if ( !$count && $this->sorting_param != '' )
		{
			$count = '-';
		}

		if ( $this->is_handelbar )
		{
			$pagin_link = "<a href=\"javascript:void(0);\" onclick=\" ".$this->befor_loading." $.post('". $this->base_url . $count . $this->sorting_param."', ". $this->additional_param .", function( data ){ " .$this->func. "( data ); " .$this->after_loading." }); \">". $text .'</a>';
		}
		else
		{
			$pagin_link = "<a href=\"javascript:void(0);\" onclick=\"$.post('". $this->base_url . $count ."', ". $this->additional_param .", function( data ){ $('". $this->div . "').html( data );" . $this->js_rebind ." }); return false;\">". $text .'</a>';
		}

		return $pagin_link;
	}

}
// END Pagination Class
?>