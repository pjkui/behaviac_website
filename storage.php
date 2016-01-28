<?php
/**
 * User: quinnpan
 * Date: 2016/1/28
 * Time: 15:16
 */
date_default_timezone_set('Asia/Shanghai');
libxml_use_internal_errors(true);

if (isset($_REQUEST['xml']) && $_REQUEST['xml']) {
//    $file = fopen("data.log", "a+");
//    fwrite($file, $_REQUEST['xml']."\n");
//    fclose($file);
    $xml=simplexml_load_file("data.xml") or die("Error: Cannot create object");
//    print_r($_SERVER);
    $count=$xml->count();
    $url='d'.$count;
//$d=['xml'=>'sdfsdfsdfsdfsdf','ip'=>'1.1.1.1','time'=>'2016年1月28日16:13:01'];
    $new=$xml->addChild($url);
    $new->addChild('xml',$_REQUEST['xml']);
    $new->addChild('ip',$_SERVER['REMOTE_ADDR']);
    $date = date("Y-m-d H:m:i", time());
    $new->addChild('time',$date);
    $xml->saveXML('data.xml');
    print_r($url);

}elseif(isset($_REQUEST['key']) && $_REQUEST['key']){
    $key=$_REQUEST['key'];
    $xml=simplexml_load_file("data.xml") or die("Error: Cannot create object");
//    print_r($_SERVER);
    $count=$xml->count();
    $result=(string)$xml->$key->xml;
    print_r($result);
}
//echo "test";

