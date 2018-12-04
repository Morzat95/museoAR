<?php
    
    try
    {
        // data receipt
        $action64 = (isset($_POST['action']) ? $_POST['action'] : "");
        $value64 = (isset($_POST['value']) ? $_POST['value'] : "");
        $id64 = (isset($_POST['id']) ? $_POST['id'] : "");

        if($action64 === "" || $value64 === "" || $id64 === "")
        {
            throw new Exception("Request error!");
        }

        // BASE64 Decode
        $action = base64_decode($action64);
        $value = base64_decode($value64);
        $id = base64_decode($id64);

        // format
        $header = "Action,Value,Id\n";
        $row = "$action,$value,$id\n";

        if(!file_exists("log.csv")){
            file_put_contents("log.csv", $header);
        }

        file_put_contents("log.csv", $row, FILE_APPEND | LOCK_EX);

        echo json_encode(array("ban" => "OK"));
    }
    catch (Exception $e) 
    {
        echo json_encode(array("ban" => $e->getMessage()));
    }
    
?>