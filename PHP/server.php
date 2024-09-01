<?php
    // session_start();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header("Access-Control-Allow-Headers: *");

    $postData = file_get_contents('php://input');
    $manage = json_decode($postData, true);
    $nameLength = strlen($manage["name"]);
    $phoneLength = strlen($manage["phone"]);
    $messageLength = strlen($manage["message"]);
    $topicLength = strLen($manage["topic"]);
    $code = $manage["censorCaptcha"];
    $counter = 0;
    $resultArray = [];

    if(strLen($manage["captcha"]) === 0){
        $resultArray["captcha"] = false;
    } else {
        $check = crypt($manage["captcha"], "salt");
        if($code === $check){
            $counter++;
            $resultArray["captcha"] = true;
        } else {
            $resultArray["captcha"] = false;
        }
    }

    if($nameLength > 0 && $nameLength < 255){
        $resultArray["name"] = true;
        $counter++;
    } else {
        $resultArray["name"] = false;
    }

    if($manage["check"] === true){
        $resultArray["check"] = true;
        $counter++;
    } else {
        $resultArray["check"] = false;
    }

    if($phoneLength === 11){
        if(preg_match("/(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/", $manage["phone"]) === 1){
            $resultArray["phone"] = true;
            $counter++;
        }   
    } else {
        $resultArray["phone"] = false;
    }

    if(preg_match("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/", $manage["email"]) === 1){
        $resultArray["email"] = true;
        $counter++;
    } else {
        $resultArray["email"] = false;
    }

    if ($messageLength < 4096 && $messageLength !== 0) {
        $resultArray["message"] = true;
        $counter++;
    } else {
        $resultArray["message"] = false;
    }

    if ($topicLength !== 0) {
        $resultArray["topic"] = true;
        $counter++;
    } else {
        $resultArray["topic"] = false;
    }

    if($counter === 7){
        $resultArray["all"] = true;  
        // mail($manage["email"], "test", json_encode($resultArray));
    }

    header("Content-type: application/json; charset=utf-8");
    echo(json_encode($resultArray));
?>