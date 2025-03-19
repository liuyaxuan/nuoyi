<template>
    <div class="menu-item">
        <p
            :class="'menu-text ' + (curRoute == $route.name ? 'active' : '')"
            v-if="!menuData.hidden"
            :style="submenuLevel > 1 ? 'padding-left: 20px' : ''"
            @click="toggle(menuData.path)"
        >
            <router-link class="menu-router" :to="menuData.path">
                <img class="menu-icon" :src="submenuLevel > 1 ? labelIcon : menuIcon" />
                <text>{{ menuData.meta.title || '' }}</text>
            </router-link>
        </p>
        <nyMenu
            :data="menuData.children"
            v-if="menuData.children && menuData.children.length > 0 && clickToMenu"
            :menu-item-parent="menuItemParent"
            :propsLevel="menuLevel"
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
import { useRoute } from 'vue-router';
import nyMenu from './menu.vue'
// icons
import menuIcon from '@/assets/icons/white/menu.png'
import labelIcon from '@/assets/icons/white/label.png'

defineOptions({
    name: 'submenu'
})
// 注册组件
defineComponent({
    components: {
        nyMenu
    }
})
const props = defineProps({
    menuData: {
        type: Object,
        default() {
            return []
        }
    },
    "submenuLevel": {
        type: Number,
        default: 0
    }
})

const $route = useRoute(); // 获取当前路由信息
const menuItemParent = ref(true)
const clickToMenu = ref(false)
const menuLevel = ref(0)
const curRoute = ref('')

function toggle(e) {
    clickToMenu.value = !clickToMenu.value
    menuItemParent.value = false
    // 当前路由
    curRoute.value = e
}

onMounted(() => {
    menuLevel.value = props.submenuLevel + 1;
})
</script>
<style lang="less">
.menu-text {
    text-align: left;
    margin: 0;
    cursor: pointer;
    position: relative;
}

.menu-text a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.menu-text:hover {
    background: #51a5f9;
}

.menu-router {
    display: flex;
    flex-direction: row;
    padding: 10px;
}

.menu-icon {
    width: 15px;
    height: 15px;
    margin-right: 10px;
}

.menu-text:hover {
    .menu-icon {
        transform: rotate(30deg); /* 鼠标悬停时旋转 30 度 */
    }
}

.active {
    background: #51a5f9;
}
</style>