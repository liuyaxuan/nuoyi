<template>
  <div class="main-container">
    <el-container>
      <!-- left -->
      <el-aside width="auto" style="background-color: darkgray;">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>main</span>
            </template>
            <el-menu-item index="1-1">one</el-menu-item>
            <el-menu-item index="1-2">two</el-menu-item>
          </el-sub-menu>
          <!-- <router-link to="/index/home">
            <el-menu-item index="1">Home</el-menu-item>
          </router-link>
          <router-link to="/404">
            <el-menu-item index="2">About</el-menu-item>
          </router-link> -->
        </el-menu>
      </el-aside>
      <!-- right -->
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view name="sidebar"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="jsx">
import {
  reactive,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  getCurrentInstance, // 获取当前组件的实例
} from 'vue';

export default {
  name: 'main-container',
  setup() {
    const isCollapse = ref(false);
    const refRac = reactive({
      menuList: []
    });

    // 展开
    const handleOpen = (key, keyPath) => {
      // console.log(key, keyPath)
    }

    // 收起
    const handleClose = (key, keyPath) => {
      // console.log(key, keyPath)
    }

    // 菜单
    const createdMenu = () => {

    }
    // const jumpRouter = (name) => {
    //   app.proxy.$router.push(
    //     {
    //       name: name,
    //       query: {
    //         id: 123
    //       }
    //     }
    //   );
    // }

    onBeforeMount(() => {

    });

    onMounted(() => {
      const { appContext } = getCurrentInstance();
      refRac.menuList = appContext.config.globalProperties.$router.options.routes || [];
      refRac.menuList.forEach(el => {
        console.log(el)
      });
    });

    onBeforeUpdate(() => {

    });

    onUpdated(() => {

    });


    return {
      // 属性
      refRac,
      isCollapse,
      // 函数
      handleOpen,
      handleClose,
      // createdMenu
    };
  }
}
</script>

<style scoped lang="less">
.main-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}
</style>
