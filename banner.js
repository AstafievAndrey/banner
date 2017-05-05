window.onload = function(){

    /*создаем дивы*/
    divBackfon = document.createElement('div');//задний фон
    divContainer = document.createElement('div');//элемент в котором будем наше окно
    divContainerClose = document.createElement('div');//верхняя шапка окна
    spanContainerClose = document.createElement('span');//спан для закрытия окна
    divContent = document.createElement('div');//контент основной
    /**/

    closeBanner = localStorage.closeBanner;
    if(localStorage.debug == "true") {setTimeout(getBanner,200); return;}



    if(closeBanner===undefined){
        localStorage.setItem("closeBanner",new Date());
        setTimeout(getBanner,2000);
    }else{
        var now = new Date();
        closeBanner = new Date(closeBanner);
        if( closeBanner.getFullYear() == now.getFullYear() ){
            if(closeBanner.getMonth() == now.getMonth()){
                if(closeBanner.getDate() == now.getDate()){
                    if(closeBanner.getHours() == now.getHours()){
                        return;
                    }
                }
            }
        }
        setTimeout(getBanner,2000);
    }
};

//отошлем результаты на сервер
function sendRes(str){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://itr.kalyan.space/index.php?statistic=1&'+str, true);
    xhr.send();
    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log("!=200");
        } else {
            try{
                console.log(xhr.responseText);
            } catch(err){
                console.log(err.message + " in " + xhr.responseText);
                return;
            }
        }
    }
}

window.addEventListener("resize", setSize);
function setSize(){
    divContainer.style.marginLeft = (window.innerWidth > 650) ? ((window.innerWidth - 450)/2)+"px" : "5%";
    divContainer.style.width = (window.innerWidth > 650) ? "450px" : "90%";
    divBackfon.style.height = window.innerHeight+"px";
}

//показываем наш баннер
function getBanner() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://itr.kalyan.space/index.php', true);
    xhr.send();
    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            console.log("!=200");
        } else {
            try{
                var data = JSON.parse(xhr.responseText);
                console.log(data);
                if(data.length !== 0){
                    for(var i = 0; i < data.length; i++){
                        if(data[i].img != null){
                            divContent.innerHTML += "<a target='blank' data-id='"+data[i].id+"' onclick='divBackfonHide("+data[i].id+")' href='//"+data[i].url+"'>"
                                                        +"<img style='width:100%;cursor:pointer;margin-top:2px;' src='http://itr.kalyan.space/uploads/images/"+data[i].img+"'>"
                                                    +"</a>";
                        }else if(data[i].html != null){
                            divContent.innerHTML += "<a target='blank' data-id='"+data[i].id+"' onclick='divBackfonHide("+data[i].id+")' href='//"+data[i].url+"'>"+data[i].html+"</a>";
                        }

                    }
                    showModal();
                }
            } catch(err){
                console.log(err.message + " in " + xhr.responseText);
                return;
            }
        }
    }
}

//скрываем собственно сам баннер
function divBackfonHide(id) {
    console.log(id);
    if(id == undefined){
        var a = divContent.getElementsByTagName('a');
        var str = "actionUser=0";
        for(var i = 0; i < a.length; i++){
            str += "&id[]="+a[i].dataset.id;
        }
        sendRes(str);
    }else{
        sendRes("actionUser=1&id="+id);
    }
    localStorage.setItem("closeBanner",new Date());
    divBackfon.style.cssText="display:none;";
}

function showModal() {
    divBackfon.style.cssText="position:fixed;width:100%;background:rgba(0, 0, 0, 0.35);top:0px;left:0px;z-index:9;";
    divContainer.style.cssText="position:absolute;padding:10px;border-radius:2px;margin-top:150px;background: rgba(240, 248, 255, 0.9);";
    setSize();
    divContainerClose.style.cssText="text-align:right;cursor:pointer;";
    spanContainerClose.style.cssText="cursor:pointer;background:white;padding:2px";

    spanContainerClose.innerText = 'Закрыть';

    document.body.appendChild(divBackfon);
    divBackfon.appendChild(divContainer);
    divContainer.appendChild(divContainerClose);
    divContainer.appendChild(divContent);
    divContainerClose.appendChild(spanContainerClose);


    divBackfon.onclick = function () {
        //divBackfonHide();
    }

    spanContainerClose.onclick = function () {
        divBackfonHide();
    }
}