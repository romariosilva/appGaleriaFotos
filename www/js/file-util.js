angular.module("starter").factory("FileUtil", function($cordovaFile){
    var util = {};

    util.fileNames = [];
    util.images = [];

    //Função para dar um novo nome ao arquivo
    function getNewName(){
        var today = new Date();
        return today.getHours().toString() + today.getMinutes().toString() + 
        today.getSeconds().toString()+ ".jpg";
    }

    //Função para salvar as imagem e guarda-las em um localStorage convertido em Json
    function saveFileNames(fileNames){
        //Convertendo para Json
        var lista = angular.toJson(fileNames);
        localStorage.setItem("fileNames", lista);
    }

    //Função para abrir imagem
    function openImage(names,  success){
        $cordovaFile.readAsText(cordova.file.externalApplicationStorageDirectory, name).then(
            function(result){
                success(result);
            },
            function(err){
                console.log(err);
            }
        )
    }

    //Carregando a lista de nomas já salvas no localStorage
    function loadFileNames(){
        var lista = localStorage.getItem("fileNames");
        return angular.fromJson(lista) || [];
    }

    util.load = function(){
        util.fileNames = loadFileNames();

        for(var i=0; i<util.fileNames.length; i++){
            openImage(util.fileNames[i], function(dataUrl){
                util.images.push(dataUrl);
            })
        }
    }

    //Método para salvar as imagens no dispositivo.
    util.save = function(dataUrl){
        var name = getNewName();

        $cordovaFile.writeFile(cordova.file.externalApplicationStorageDirectory, name, dataUrl, true).then(
            function(result){
                console.log("sucesso");
                util.images.push(dataUrl);
                util.fileNames.push(name);
                saveFileNames(util.fileNames);
            },
            function(err){
                console.log("erro", err);
            }
        )
    }

    return util
})