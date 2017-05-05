<?php

class s_error{
    public static function show($message){
        die(json_encode(array("s_error"=>$message)));
    }
}

