 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService,uploadService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.add=function(){
        $scope.entity.goodsDesc.introduction=editor.html();
        goodsService.add( $scope.entity  ).success(
			function(response){
				if(response.success){
					//重新查询 
		        	alert("保存成功");
		        	$scope.entity={};
                    editor.html("");
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	$scope.uploadFile=function () {
		uploadService.uploadFile().success(
			function (response) {
				if (response.success){
					$scope.image_entity.url=response.message;
				}else{
					alert(response.message);
				}
            }
		).error(function () {
			alert("上传发生错误");
        })
    }

    $scope.entity={goods:{},goodDesc:{itemImages:[]}};

	//显示照片
	$scope.add_image_entity=function () {
		$scope.entity.goodDesc.itemImages.push($scope.image_entity);
    }
	//从列表中移除照片
    $scope.remove_image_entity=function(index){
        $scope.entity.goodDesc.itemImages.splice(index,1);
    }
    
});	
