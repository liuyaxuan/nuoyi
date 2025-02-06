<template>
	<div class="main-container">
		<!-- loading -->
		<my-loading></my-loading>
		<!-- main -->
		<el-container>
			<!-- 菜单 -->
			<el-aside width="auto" class="">
				<div class="head-title">
					<!-- <el-icon><Van /></el-icon> -->
					<img :src="elephant" class="header-title-icon" />
					<span class="header-title-text" v-if="!isCollapse">{{ '< 自定义 / >' }}
					</span>
				</div>
				<my-menu @sentState="getChildrenState"></my-menu>
			</el-aside>
			<!-- 主体 -->
			<el-container>
				<el-header>
					<div class="el-header-container">
						<img :src="peopleSafeOne" class="people-icon" @click="handlePeople" />
						<img :src="moreOne" class="set-icon" @click="handleMore" />
					</div>
				</el-header>
				<el-main class="el-main-container">
					<!-- breadcrumb -->
					<my-breadcrumb></my-breadcrumb>
					<router-view name="sidebar"></router-view>
				</el-main>
			</el-container>
		</el-container>
		<!-- 弹窗 -->
		<ny-dialog
			:show="isVisible"
			@close="isVisible = false"
		>
			<div>自定义插槽内容</div>
		</ny-dialog>
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

// icon 资源
import peopleSafeOne from '@/assets/icons/blue/1_people-safe-one.svg';
import moreOne from '@/assets/icons/blue/1_more-one.svg';
import elephant from "@/assets/icons/blue/elephant.svg";
// 导入loading组件(全局)
import myLoading from '@/components/loader/loading.vue';
// 面包屑导航
import myBreadcrumb from '@/components/breadcrumb/index.vue';
// 导入 myMenu 组件
import myMenu from '@/components/menu/index.vue';
// dialog 对话框
import nyDialog from '@/components/dialog/index.vue';

export default {
	name: 'main-container',
	components: {
		myMenu,
		myLoading,
		myBreadcrumb,
		nyDialog
	},
	setup() {
		let isCollapse = ref(false);
		let isVisible = ref(false);
		const refRac = reactive({

		});

		function getChildrenState(data) {
			isCollapse.value = data;
		}

		function handlePeople() {
			isVisible.value = true;
		}
		function handleMore() {
			isVisible.value = true;
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
			elephant,
			moreOne,
			peopleSafeOne,
			// 属性
			refRac,
			isVisible,
			isCollapse,
			// 函数
			handlePeople,
			handleMore,
			getChildrenState
		};
	}
}
</script>

<style scoped lang="less">
.main-container {
	width: 100%;
	height: 100%;
	background-color: #e7e7e7;
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

		.header-title-icon {
			fill: white !important;
		}

		.header-title-text {
			margin-left: 10px;
		}
	}

	.el-aside {
		background-color: darkgray;
	}

	.el-header {
		.el-header-container {
			width: 100%;
			height: 100%;
			background-color: #313e6a;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 30px;
			box-sizing: border-box;

			.people-icon {
				margin-right: 10px;
			}

			.people-icon,
			.set-icon {
				width: 25px;
				height: 25px;
				filter: grayscale(100%);
			}

			.people-icon:hover,
			.set-icon:hover {
				cursor: pointer;
				filter: grayscale(0%);
			}
		}
	}

	.el-container {
		min-width: 500px;
	}

	.menu-container {
		height: calc(100% - 60px);
	}

	.el-main-container {
		display: flex;
		flex-direction: column;
	}
}
</style>