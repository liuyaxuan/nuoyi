<template>
	<div class="main-container">
		<el-container>
			<!-- 菜单 -->
			<el-aside width="auto" class="">
				<div class="head-title">
					<el-icon><Van /></el-icon>
					<span
						class="header-title-text"
						v-if="!isCollapse"
					>MENU</span>
				</div>
				<my-menu
					@sentState="getChildrenState"
				></my-menu>
			</el-aside>
			<!-- 主体 -->
			<el-container>
				<el-header>
					<div style="width: 100%; height: 100%; background-color: #313e6a;"></div>
				</el-header>
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
		watch,
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
			let isCollapse = ref(false);
			const refRac = reactive({

			});
			
			function getChildrenState(data) {
				isCollapse.value = data;
			}

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
				getChildrenState
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
		
		.head-title {
			width: 100%;
			height: 60px;
			background-color: #3f9eff;
			color: rgba(255, 255, 255, 0.9);
			font-weight: bold;
			font-size: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			
			.header-title-text {
				margin-left: 10px;
			}
		}
		
		.el-aside {
			background-color: darkgray;
		}
		
		.menu-container {
			height: calc(100% - 60px);
		}
	}
</style>