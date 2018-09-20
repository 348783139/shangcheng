//控制层
app.controller('goodsController', function ($scope, $controller, goodsService, uploadService, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.add = function () {
        $scope.entity.goodsDesc.introduction = editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    //重新查询
                    alert("保存成功");
                    $scope.entity = {};
                    editor.html("");
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    $scope.uploadFile = function () {
        uploadService.uploadFile().success(
            function (response) {
                if (response.success) {
                    $scope.image_entity.url = response.message;
                } else {
                    alert(response.message);
                }
            }
        ).error(function () {
            alert("上传发生错误");
        })
    }

    $scope.entity = {goods: {}, goodsDesc: {itemImages: [],specificationItems:[]}};

    //显示照片
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }
    //从列表中移除照片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }
    //  一级分类下拉选择框
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCat1List = response;
            }
        );
    }
    //  二级分类下拉选择框
    $scope.$watch("entity.goods.category1Id", function (newValue, oldValue) {
        if (oldValue != null) {
            $scope.itemCat3List = -1;
        }
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat2List = response;
            }
        );
    });
    //  三级分类下拉选择框
    $scope.$watch("entity.goods.category2Id", function (newValue, oldValue) {
        if (oldValue != null) {
            $scope.entity.goods.typeTemplateId = null;
        }
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat3List = response;
            }
        );

    });
    //模板id
    $scope.$watch("entity.goods.category3Id", function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                $scope.entity.goods.typeTemplateId = response.typeId;
            }
        );
    });
    //品牌显示
    $scope.$watch("entity.goods.typeTemplateId", function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function (response) {
                $scope.typeTemplate = response;
                $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
            }
        )

        //显示规格
        typeTemplateService.findSpecList(newValue).success(
            function (response) {
                $scope.findSpecList = response;
            }
        )

    });

    $scope.updateSpecAttribute=function ($event,name,value) {
        var Object= $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,"attributeName",name);
        if (Object!=null){
            if ($event.target.checked){
                Object.attributeValue.push(value);
            }else{
                Object.attributeValue.splice(Object.attributeValue.indexOf(value),1);
                if (Object.attributeValue.length==0){
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(Object),1);
                }
            }


        }else{
            $scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
        }
    }


    //生成sku列表（深克隆）
    $scope.createItemList=function () {
        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:"1",isDefault:'0'}];
        var items = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0;i<items.length;i++){
            $scope.entity.itemList=addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
        }
    }

    addColumn=function (list, columnName, columnValue) {
        var newList=[];
        for (var i = 0;i<list.length;i++){
            var oldRow = list[i];
            for (var j = 0;j<columnValue.length;j++){
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[columnName]=columnValue[j];
                newList.push(newRow);
            }
        }
        return newList;

    }

    $scope.status=['未审核','已审核','审核未通过','关闭'];//商品状态

    $scope.itemCatList = [];

    $scope.findItemCatList=function () {
        itemCatService.findAll().success(
            function (response) {
                for (var i = 0;i<response.length;i++){
                    $scope.itemCatList[response[i].id]=response[i].name;
                }
            }
        )
    }
});
