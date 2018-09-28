app.controller("searchController",function ($scope,$location,searchService) {
    $scope.search=function () {
        $scope.searchMap.pageNo=parseInt( $scope.searchMap.pageNo);
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resoutMap = response;
                buildPageLabel();
            }
        )
    };


    buildPageLabel=function () {
        $scope.pageLabel=[];
        var firstPage = 1;//开始页码
        var lastPage = $scope.resoutMap.totalPages;//截止页码
        $scope.firstDot = true;
        $scope.lastDot = true;
        if ($scope.resoutMap.totalPages>5){
            if($scope.searchMap.pageNo<=3){
                lastPage=5;
                $scope.firstDot=false;//前面无点
            }else if($scope.searchMap.pageNo>=$scope.resoutMap.totalPages-2){
                firstPage=$scope.resoutMap.totalPages-4;
                $scope.lastDot = false;//后面无点
            }else{
                firstPage=$scope.searchMap.pageNo-2;
                lastPage=$scope.searchMap.pageNo+2;

            }
        }else{
            $scope.firstDot=false;//前面无点
            $scope.lastDot = false;//后面无点
        }
        for(var i = firstPage;i<=lastPage;i++){
            $scope.pageLabel.push(i);

        }
    }

    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':'','pageNo':1,'pageSize':40,'sort':'','sortField':''};
    //选中搜索项
    $scope.addSearchItem=function (key,value) {
        if (key=='category'||key=='brand'||key=='price'){
            $scope.searchMap[key]=value;
        }else{
            $scope.searchMap.spec[key]=value;
        }
        $scope.search();
    }
    //撤销搜索项
    $scope.removeSearchItem=function (key) {
        if (key=='category'||key=='brand'||key=='price'){
            $scope.searchMap[key]='';
        }else{
            delete $scope.searchMap.spec[key];
        }
        $scope.search();
    }
//分页查询
    $scope.queryByPage=function (pageNo) {
        if (pageNo<1||pageNo>$scope.resoutMap.totalPages){
            return;
        }
        $scope.searchMap.pageNo=pageNo;
        $scope.search();
    }

    //判断是否是第一页
    $scope.isTopPage=function () {
        if ($scope.searchMap.pageNo==1){
            return true;
        }else{
            return false;
        }
    }

    //判断是否是最后一页
    $scope.isEndPage=function () {
        if ($scope.searchMap.pageNo==$scope.resoutMap.totalPages){
            return true;
        }else{
            return false;
        }
    }

    //排序
    $scope.sortSearch=function (sort, sortField) {
        $scope.searchMap.sort=sort;
        $scope.searchMap.sortField=sortField;
        $scope.search();
    }

    //判断关键字是不是品牌
    $scope.keywordsIsBrand=function () {
        for(var i  = 0;i<$scope.resoutMap.brandList.length;i++){
            if ($scope.searchMap.keywords.indexOf($scope.resoutMap.brandList[i].text)>=0){
                return true;
            }
        }
            return false;
    }

    //加载查询字符串
    $scope.loadkeywords=function () {
        $scope.searchMap.keywords=$location.search()['keywords'];
        $scope.search();
    }
});