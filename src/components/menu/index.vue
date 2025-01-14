<template>
    <div class="menu-container">
        <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
        >
            <el-sub-menu
                v-for="(item) in refRac.menuData"
                :key="item.path"
                :index="item.path"
            >
                    <template #title v-if="!item.hidden">
                        <el-icon><house /></el-icon>
                        <span>{{ item.meta.title || '' }}</span>
                    </template>
                    <template
                        v-for="(childrenItem) in item.children"
                        :key="childrenItem.path"
                    >
                        <el-menu-item
                            v-if="item.children && item.children.length > 0 && !childrenItem.hidden"
                            :index="childrenItem.path"
                        >
                            <template #title>
                                <router-link :to="item.path + '/' + childrenItem.path">
									<el-icon><Menu /></el-icon>
									{{ childrenItem.meta.title || '' }}
								</router-link>
                            </template>
                        </el-menu-item>
                    </template>
            </el-sub-menu>
        </el-menu>
        <el-button @click="isCollapse = !isCollapse">{{ isCollapse ? '展开' : '收起'}}</el-button>
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
    setup(props,context) {
		const store = useStore();
		const $router = useRouter(); // 获取路由实例
		const $route = useRoute(); // 获取当前路由信息
        // 获取当前组件的实例
        const app = getCurrentInstance();
        // 是否折叠
        const isCollapse = ref(false);
        // 默认选中菜单
        const defaultActive = ref('');

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
				console.log('==>', $route.name)
			}, 0)
		}, { immediate: true, deep: true })

        // 展开
        const handleOpen = (key, keyPath) => {
        // console.log(key, keyPath)
        }

        // 收起
        const handleClose = (key, keyPath) => {
        // console.log(key, keyPath)
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
            // 函数
            handleOpen,
            handleClose,
            createdMenuTree,
            handleDefaultActive,
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
}
</style>