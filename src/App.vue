<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col class="logo" :span="8" :style="{width:isCollapse?'64px':'240px',transition:'0.8s'}" >
            <strong>小优购物管理系统</strong>
          </el-col>

          <el-col :span="8" class="adminInfo">
            <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <span>{{$store.state.admin.adminName}}</span><img src="./assets/logo.png" alt="">
                        </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$store.commit('OUT_LOGIN')">退出登陆</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="$route.path" :collapse="isCollapse" :collapse-transition="false" :router="true">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-user"></i>管理设置</template>
                <el-menu-item index="/">管理员日志</el-menu-item>
                <el-menu-item index="/singn" >注册管理员</el-menu-item>
                <el-menu-item index="/adminList" >管理员列表</el-menu-item>
                <el-menu-item index="/check" v-if="admin=='admin'">操作日志</el-menu-item>
                <el-menu-item index="/userList" >成员列表</el-menu-item>
                <el-menu-item index="/location" >成员分散地图</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-message"></i>店铺设置</template>
              <el-menu-item index="/shopType">店铺类别</el-menu-item>
              <el-menu-item index="/shop">店铺管理</el-menu-item>
              <el-menu-item index="/shopList">店铺列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-goods"></i>商品设置</template>
              <el-menu-item index="/goodsType">商品类别</el-menu-item>
              <el-menu-item index="/goods">商品管理</el-menu-item>
              <el-menu-item index="/goodsList">商品列表</el-menu-item>
            </el-submenu>
              <el-submenu index="4">
                  <template slot="title"><i class="el-icon-data-line"></i>广告设置</template>
                  <el-menu-item index="/adType">广告类别</el-menu-item>
                  <el-menu-item index="/ad">广告管理</el-menu-item>
              </el-submenu>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-data-line"></i>文件管理</template>
              <el-menu-item index="/saveFile">保存文件</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-data-line"></i>公众号管理</template>
              <el-menu-item index="/media">素材</el-menu-item>
              <el-menu-item index="/goEasy">推送</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="wx">
            <span>请添加微信公众号</span>
            <el-image
                    style="width: 120px;"
                    src="http://47.98.238.74:8088/file/微信公众号.jpg"
            ></el-image>
          </div>
          <router-view/></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                isCollapse: false,
                admin:localStorage.adminName || ""
            }
        },
      mounted() {
        // window.onbeforeunload = function (e) {
        //   window.localStorage.clear();
        // }
      }
    }
</script>
<style lang="less">
  ul,li,ol{
    list-style: none;
  }
  .wx{
    position: fixed;
    right:20px;
    top: 60px;
    z-index: 999;
    display: flex;flex-direction: column;

    >span{
      font-weight: bolder;
      font-size: 16px;
      padding: 3px;
    }
  }
  *{
    padding:0;
    margin:0;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    min-height: 1000px;
  }
  .el-header {
    padding: 0px!important;
    background: #409EFF;
    color: #ffffff;
    .info{
      font-size:30px;
      line-height: 60px;
    }
    .logo {
      text-align:center;
      width: 240px;
      font-size: 25px;
      line-height: 60px;
    /*  border-right: 1px solid rgba(238, 241, 146, 0.3);*/
    }
    .adminInfo {
      float: right;
      text-align: right;
      padding-right: 20px;
      line-height: 60px;
      .el-dropdown-link {
        span {
          color: #fff;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
    }
  }
  .toolbar {
    background:#f4f4f4;
    padding:10px;
    marign:20px 0!important;
  }
  .el-table th,.el-table td{
    text-align:center!important;
  }
  .toolbar .el-form-item{
    margin-bottom:0px;
  }
</style>
