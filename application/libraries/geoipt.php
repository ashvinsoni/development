<?php include_once './vendor/autoload.php';
use GeoIp2\WebService\Client;
use Guzzle\Http\Client as GuzzleClient;
use Guzzle\Http\Message\Response;
use Guzzle\Plugin\Mock\MockPlugin;
if ( ! defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Geoipt
{
	protected	$client;
	public		$message = NULL;
	public		$code = NULL;

	public function __construct()
	{
        $this->client = new Client( GEOIP_USERID , GEOIP_LICENSE_KEY );
	}

	function get_isocode( $ip = 'me' )
	{
		if ( $ip == 'me' )
		{
			if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) && $_SERVER['HTTP_X_FORWARDED_FOR'] )
			{
				$ip = $_SERVER[ 'HTTP_X_FORWARDED_FOR' ];
			}
			else
			{
				$ip = $_SERVER[ 'REMOTE_ADDR' ];
			}
		}

		$response = FALSE;

		try
		{
			$record   = $this->client->city( $ip );
			$response = $record->country->isoCode;
		}
		catch ( Exception $e )
		{
			$this->message = $e->getMessage();
			$this->code    = $e->getCode();
		}
		return $response;
	}

	public function get_exception_detail()
	{
		return array( 'message' => $this->message , 'code' => $this->code );
	}
}

/* End of file geoipt.php */
/* Location: ./application/libraries/geoipt.php */