package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.CookieUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Reference(timeout = 6000)
    private CartService cartService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;


    /**
     * 购物车列表
     * @param
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(username);
        String cartListString = util.CookieUtil.getCookieValue(request, "cartList", "UTF-8");
        if (cartListString==null||cartListString.equals("")){
            cartListString="[]";
        }
        List<Cart> cartList_cookie = JSON.parseArray(cartListString, Cart.class);
        if (username.equals("anonymousUser")){

            return cartList_cookie;
        }else{//如果已经登录
            List<Cart> cartList_redis = cartService.findCartListFromRedis(username);
            if (cartList_cookie.size()>0){
                //合并购物车
                cartList_redis= cartService.mergeCartList(cartList_redis, cartList_cookie);
                //清楚cookie
                util.CookieUtil.deleteCookie(request, response, "cartList");
                //将合并后的缓存存入redis
                cartService.saveCartListToRedis(username, cartList_redis);
                System.out.println("执行了合并购物车");
            }
            return cartList_redis;
        }

    }

    @RequestMapping("/addGoodsToCartList")
    public Result addGoodsToCartList(Long itemId ,Integer num){

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:9105");
        response.setHeader("Access-Control-Allow-Credentials", "true");


        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("当前登录用户"+username);

        try {
            List<Cart> cartList = findCartList();
            cartList = cartService.addGoodsToCartList(cartList, itemId, num);

            if (username.equals("anonymousUser")){//如果是未登录，保存到 cookie
                CookieUtil.setCookie(request, response, "cartList", JSON.toJSONString(cartList), 3600*24, "UTF-8");

            }else{//如果是已登录，保存到 redis
                cartService.saveCartListToRedis(username, cartList);
            }

            return new Result(true,"添加成功");

        } catch (Exception e) {
            e.printStackTrace();
            return  new Result(false,"添加失败");
        }


    }
}
