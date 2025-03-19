<template>
    <div class="menu-list">
        <subMenu
            v-for="(item, index) in data"
            :key="item.meta.title"
            :menuData="item"
            :menuLevel="index"
            :submenuLevel="propsLevel"
        />
    </div>
</template>
<script setup>

import {
    reactive,
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
    defineComponent,
} from 'vue';
import subMenu from './submenu.vue'

defineOptions({
    name: 'ny-menu'
})
// 注册组件
defineComponent({
    components: {
        subMenu
    }
})
const props = defineProps({
    data: {
        type: Array
    },
    propsLevel: {
        type: Number,
        default: 0
    }
})

onMounted(() => {

});

</script>
<style>
.menu-list {
    width: 100%;
    background: #3484d4;
    color: #fff;
    box-sizing: border-box;
    font-size: 13px;
}
</style>