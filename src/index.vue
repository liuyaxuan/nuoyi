<template>
  <div class="main-container">
    <el-container>
      <!-- 菜单 -->
      <el-aside width="auto" style="background-color: darkgray;">
        <my-menu></my-menu>
      </el-aside>
      <!-- 主体 -->
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view name="sidebar"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
} from 'vue';

// 导入 myMenu 组件
import myMenu from './components/menu/index.vue';

export default {
  name: 'main-container',
  components: {
    myMenu
  },
  setup() {
    const isCollapse = ref(false);
    const refRac = reactive({
      
    });

    onBeforeMount(() => {

    });

    onMounted(() => {

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
