<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of validation
 *
 * @author andrey
 */
class validation {
    
    public static function print_xml($data = array()){
        if(!is_array($data)) return '';
        $result='';
        foreach($data as $key=>$val){
            $subkeys = array_keys($val);
            // Проверяем ключи
            $t=true; // true ключ - строка
            foreach ($subkeys as $k){
                if(gettype($k)!='string') $t=false;
            }
            if($t){
                $result.='<'.$key.'>';
                if(is_array($val)) $result.=print_xml($val); else $result.=$val;
                $result.='</'.$key.'>';
            } else {
                for($i = 0;$i<count($val);$i++){
                    $result.='<'.$key.'>';
                    if(is_array($val[$i])) $result.=print_xml($val[$i]); else $result.=$val[$i];
                    $result.='</'.$key.'>';
                }
            }
        }
        return $result;
    }
}
