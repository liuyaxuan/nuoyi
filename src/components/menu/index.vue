<template>
    <div class="menu-container">
        <div class="menu-item" v-for="(item, index) in refRac.menuData" :key="item.path">
            <div
                v-if="!item.hidden"
                :class="`ny-menu menu-title parent-${index}`"
                @click="handleMenuToggle(item, index)"
            >
                <el-icon>
                    <house />
                </el-icon>
                <span>{{ item.meta.title || '' }}</span>
            </div>
            <div :class="`ny-menu menu-children children-${index}`">
                <div
                    class="ny-menu menu-children-item"
                    v-for="(childrenItem, index2) in item.children"
                    :key="childrenItem.path"
                    v-show="!childrenItem.hidden"
                    @click.stop="handleMenuSelect($event)"
                >
                    <router-link
                        :to="item.path + '/' + childrenItem.path">
                        {{ childrenItem.meta.title || '' }}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    ref,
    watch,
    computed,
    reactive,
    onMounted,
    getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: "my-menu",
    props: [],
    setup(props, context) {
        const store = useStore();
        const $router = useRouter(); // 获取路由实例
        const $route = useRoute(); // 获取当前路由信息
        // 获取当前组件的实例
        const app = getCurrentInstance();
        // 是否折叠
        const isCollapse = ref(false);
        // 默认选中菜单
        const defaultActive = ref('');
        const menuHeight = ref(0);

        const refRac = reactive({
            menuData: []
        })

        // 监听
        watch(isCollapse, (newVal, oldVal) => {
            context.emit('sentState', newVal);
        })
        watch(() => $route, (newVal, oldVal) => {
            const { fullPath } = newVal;
            setTimeout(() => {
                defaultActive.value = $route.name;
            }, 0)
        }, { immediate: true, deep: true })

        // 展开、收起
        const handleMenuToggle = (node, key) => {
            // 展开、收起动作
            const content = document.getElementsByClassName('children-' + key)[0];
            if (content.offsetHeight > 0) {
                menuHeight.value = content.offsetHeight;
                const timer = setInterval(() => {
                    const h = content.offsetHeight - 1;
                    content.style.height = h + 'px';
                    if (h == 0) {
                        clearInterval(timer);
                    }
                }, 5)
            } else {
                const timer = setInterval(() => {
                    let h = content.offsetHeight + 1;
                    content.style.height = h + 'px';
                    if (h == menuHeight.value) {
                        clearInterval(timer);
                        menuHeight.value = h;
                    }
                }, 5) 
            }
        }

        // 选中菜单
        const handleMenuSelect = (e) => {
            // 样式控制
            const menu = document.getElementsByClassName('ny-menu');
            for (let i = 0; i < menu.length; i++) {
                menu[i].classList.remove('ny-menu-active');
            }
            e.target.classList.add('ny-menu-active');
        }

        // 获取生成菜单树结构
        const createdMenuTree = () => {
            const { appContext } = getCurrentInstance();
            const defaultMenu = $router.options.routes || [];
            defaultMenu.forEach(item => {
                if (!item.hidden) {
                    refRac.menuData.push(item)
                }
            });
            handleDefaultActive();
        }

        // 默认选中菜单
        const handleDefaultActive = () => {
            if (refRac.menuData[0] && refRac.menuData[0].children.length > 0) {
                defaultActive.value = refRac.menuData[0].children[0].path;
            } else {
                defaultActive.value = refRac.menuData[0].path;
            }

            $router.push(
                {
                    name: defaultActive.value,
                    query: {}
                }
            );
        }

        onMounted(() => {
            createdMenuTree();
        })

        return {
            refRac,
            isCollapse,
            defaultActive,
            menuHeight,
            // 函数
            handleMenuToggle,
            createdMenuTree,
            handleDefaultActive,
            handleMenuSelect,
        }
    },
}
</script>

<style scoped lang="less">
.menu-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    a {
        width: 100%;
        color: #fff;
        display: block;
        text-align: left;
    }

    .collapse-btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        background-color: #3f9eff;
        color: #fff;
        font-size: 16px;
    }
}
.menu-item {
    width: 100%;
    height: auto;
    text-align: left;
    font-size: 14px;
    color: #fff;
    overflow-y: hidden;
}


.hidden {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-out;
}
.expanded {
    transition: max-height 0.5s ease-in;
}

.menu-title {
    box-sizing: border-box;
    padding: 10px 10px;
}
.menu-children-item, .menu-title {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background-color: #3f9eff;
    }
}
.menu-children-item a {
    box-sizing: border-box;
    padding: 10px 0px 10px 40px;
}

.ny-menu-active {
    background-color: #3f9eff;
}
</style>