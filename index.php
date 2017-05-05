<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *'); 
header("Content-Type: application/json; charset=utf-8");

spl_autoload_register(function($class){
    include 'classes/'.strtolower($class).'.php';
});

class App{
    
    private $_host;
    private $_statistic;
    private $_pdo;
    private $_actionUser;
    private $_idBanner;

    public function __construct() {
        $this->_host = str_replace(array("http://","https://"),"",filter_input(INPUT_SERVER, "HTTP_ORIGIN"));
        $this->_statistic = filter_input(INPUT_GET, "statistic",FILTER_VALIDATE_INT);
        $this->_actionUser = filter_input(INPUT_GET, "actionUser",FILTER_VALIDATE_INT);
        if(!is_null($this->_actionUser) && (int)$this->_actionUser == 0){
            $this->_idBanner = filter_input(INPUT_GET, "id",FILTER_VALIDATE_INT , FILTER_REQUIRE_ARRAY);
        }else{
            $this->_idBanner = filter_input(INPUT_GET, "id",FILTER_VALIDATE_INT);
        }
        $this->_pdo = Db::getPdo(Config::getConfig());
    }
    
    public function __getStatistic() {
        return $this->_statistic;
    }
    
    public function checkHost() {
        $sql = "SELECT count(*) cnt "
            . "FROM areas "
            . "WHERE  url = :HOST";
        $sth = $this->_pdo->prepare($sql);
        $sth->bindParam(":HOST", $this->_host, PDO::PARAM_STR);
        $sth->execute();
        $res = $sth->fetch(PDO::FETCH_ASSOC);
        return $res["cnt"];
    }

    public function getBanners(){
        $sql = "with area_categ as(
                    select t2.category_id
                    from areas t1
                    join categables t2 on t2.categable_id = t1.id and t2.categable_type = 'areas'
                    where t1.url = :HOST
            )

            select t1.id, t1.html, t1.url, t1.img
            from banners t1
            join categables t2 on t2.categable_id = t1.id and t2.categable_type = 'banners'
            where t2.category_id in (select * from area_categ)
            ORDER BY random() limit 3";
        $sth = $this->_pdo->prepare($sql);
        $sth->bindParam(":HOST", $this->_host, PDO::PARAM_STR);
        $sth->execute();
        $res = $sth->fetchAll(PDO::FETCH_ASSOC);
        foreach($res as $value){
            $this->bannerShow($value['id']);
        }
        return $res;
    }
    
    private function bannerShow($id){
        $sql = "update banners set show = (show+1) where id = :ID";
        $sth = $this->_pdo->prepare($sql);
        $sth->bindParam(":ID", $id, PDO::PARAM_INT);
        return $sth->execute();
    }


    private function bannerClick($id){
        $sql = "update banners set click = (click+1) where id = :ID";
        $sth = $this->_pdo->prepare($sql);
        $sth->bindParam(":ID", $id, PDO::PARAM_INT);
        return $sth->execute();
    }
    
    private function bannerClose($id){
        $sql = "update banners set close = (close+1) where id = :ID";
        $sth = $this->_pdo->prepare($sql);
        $sth->bindParam(":ID", $id, PDO::PARAM_INT);
        return $sth->execute();
    }

    public function setStatistic() {
        if($this->_actionUser == 1){
            $this->bannerClick($this->_idBanner);
        }elseif($this->_actionUser == 0){
            for($i=0; $i<count($this->_idBanner); $i++){
                $this->bannerClose($this->_idBanner[$i]);
            }
        }
    }
    
}

$app = new App();

if( $app->__getStatistic() !== 1 ){
    if( $app->checkHost() == 1){
        echo json_encode($app->getBanners());
    }else{
        s_error::show($_SERVER);
    }
}else{
    $app->setStatistic();
}
