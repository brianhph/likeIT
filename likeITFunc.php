<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Methods: GET, POST");
// header("Access-Control-Allow-Headers: Content-Type, *");
header("Content-type: application/json; charset=utf-8");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("x-frame-options:sameorigin");
/*header("max-age: 1000");*/
import_request_variables("gp");
ini_set('display_errors', 0);
require_once './libs/cls_commom.php';
foreach ($_REQUEST as $k => $v) $$k = $v;

$libs = new CommonClass();

switch ($action) {
	case 'status':
		$NNP = array('itemId');
		foreach ($NNP as $k => $v) if (!isset($$v) || empty($$v)) $libs->callBack('not null parameter miss.');

		$resopnse = array(
			'liked' => (rand(0,1)) ? true : false,
			'likes' => $likes
		);

		// if (rand(0,1)) {
		if (true) {
			$resopnse['logined'] = true;
		} else {
			$resopnse['logined'] = false;
			$resopnse['liked'] = false;
		}//end if

		$libs->callBack('success', $resopnse);
		break;
	case 'update':
		$NNP = array('itemId');
		foreach ($NNP as $k => $v) if (!isset($$v) || empty($$v)) $libs->callBack('not null parameter miss.');

		$resopnse = array(
			'liked' => ($act == 'unlike') ? false : true,
			'likes' => $likes
		);

		$libs->callBack('success', $resopnse);
		break;
	default:
		$libs->callBack('queryError', array(array('errCode'=>'', 'errMsg'=>'Unexcept error occurs. Try it later, please.')));
}//end switch
/*中文*/
?>