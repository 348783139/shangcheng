package com.pinyougou.page.service;

public interface ItemPageService {

    public boolean genItemHtml(Long goodsId);

    /**
     * 删除详细页
     * @param goodsIds
     * @return
     */
    public boolean deleteItemHtml(Long[] goodsIds);
}
