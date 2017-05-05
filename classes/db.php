<?php

class Db{
    public static function getPdo($param) {
        return new PDO(
                $param["type"].":"."dbname=".$param["dbname"].";host=".$param["host"], 
                $param["dbuser"], 
                $param["password"],
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING) 
            );
    }
}

