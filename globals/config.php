<?php

// Execution environment (dev = localhost, test = rtot.eu, prod = ttor.eu)
define('CONFIG_TYPE', 'devv');

if( CONFIG_TYPE == 'kimsufi') 
{
	define('SITE_URL', 'http://94.23.18.65/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');

	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'J1ascsEtlj');
}

else if( CONFIG_TYPE == 'ovh-vps')
{
	define('SITE_URL', 'http://92.222.18.63/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');

	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'J1ascsEtlj');
}


else if( CONFIG_TYPE == 'devf' || CONFIG_TYPE == 'dev') //flo
{
	define('SITE_URL', 'http://localhost/2014_IUT-ACROBATT2014-ABACTUS/ClientWeb/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');
	
	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', '');
}
else if( CONFIG_TYPE == 'devv' ) //vince
{
	define('SITE_URL', 'http://localhost:8888/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');

	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'root');
}

elseif( CONFIG_TYPE == 'devn' ) //nico
{
	define('SITE_URL', 'http://localhost/abactus/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');
	
	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'root');
}
elseif( CONFIG_TYPE == 'devj' ) //jerem
{
	define('SITE_URL', 'http://localhost/abactus/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', '');
	define('SITE_NAME', 'Octavio');
	
	// Db
	define('SQL_DSN', 'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', '');
}
elseif( CONFIG_TYPE == 'test' )
{
	define('SITE_URL', 'http://rtot.eu/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', 'admin@rtot.eu');
	define('SITE_NAME', 'Octavio');
	
	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'sutcaba4102db');
}
elseif( CONFIG_TYPE == 'prod' )
{
	define('SITE_URL', 'http://ttor.eu/');
	define('SITE_URL_ASSETS', SITE_URL.'assets/');
	define('SITE_EMAIL', 'admin@ttor.eu');
	define('SITE_NAME', 'Octavio');

	// Db
	define('SQL_DSN',      'mysql:dbname=abactus;host=localhost');
	define('SQL_USERNAME', 'root');
	define('SQL_PASSWORD', 'sutcaba4102dbp');
}
else {
	die('invalid configuration');
}

define('SALT_RESET_PWD', 'tM9m4k2*n9Ma9');
define('SALT_PSEUDO_TOKEN', 'zxud*8zzdhj2');

?>
