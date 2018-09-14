package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;
import entity.Result;

import java.util.List;
import java.util.Map;

public interface BrandService {

    public List<TbBrand> findAll();

    public PageResult findPage(int pageNum,int pageSize);

    public void save(TbBrand brand);

    public TbBrand findById(Long id);

    public void update(TbBrand brand);

    public void delete(Long[] ids);

    public PageResult findPage(TbBrand brand,int pageNum,int pageSize);

    List<Map> selectOptionList();

}
