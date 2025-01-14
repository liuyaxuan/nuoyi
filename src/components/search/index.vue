<template>
	<div class="my-search">
		<div class="my-search-container">
			<input
				class="input"
				placeholder="输入内容点击「搜索」..."
				type="text" 
				name="text"
				autocomplete="off"
				v-model="searchText"
			/>
			<el-icon
				class="clear-btn"
				v-if="searchText.length > 0"
				@click="handleClearSearch"
			>
				<DeleteFilled />
			</el-icon>
			<el-button
				class="my-search-btn"
				type="primary"
				@click="handleSearch"
			>搜索</el-button>
		</div>
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
		getCurrentInstance,
		computed, // 获取当前组件的实例
	} from 'vue';
	import { useStore } from 'vuex'
	import { debounce } from '@/utils/index.js'
	export default {
		name: 'my-search',
		components: {},
		setup() {
			const app = getCurrentInstance(); // 获取当前组件的实例
			const proxy = app.proxy; // 获取当前组件的代理对象
			const store = useStore();
			
			const searchText = ref('');
			
			// 搜索
			const handleSearch = debounce(() => {
				console.log(searchText.value);
			}, 300)
			
			// 清理
			const handleClearSearch = debounce(() => {
				searchText.value = '';
			}, 100)

			onBeforeMount(() => {

			});

			onMounted(() => {

			});

			onBeforeUpdate(() => {

			});

			onUpdated(() => {

			});

			return {
				searchText,
				// 函数
				handleSearch,
				handleClearSearch,
				debounce
			}
		}
	}
</script>

<style scoped lang="less">
	.my-search {
		width: 100%;
		height: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		.my-search-container {
			width: 475px;
			position: relative;
		}

		.input {
			width: 100%;
			max-width: 320px;
			height: 20px;
			padding: 12px;
			padding-right: 30px;
			border-radius: 12px;
			border: 1.5px solid lightgrey;
			outline: none;
			transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
			box-shadow: 0px 0px 20px -18px;
			position: relative;
		}

		.input:hover {
			border: 2px solid lightgrey;
			box-shadow: 0px 0px 20px -17px;
		}

		.input:active {
			transform: scale(0.95);
		}

		.input:focus {
			border: 2px solid grey;
		}
		
		.clear-btn {
			font-size: 15px;
			position: absolute;
			right: 115px;
			top: 15px;
			color: #c8c8c8;
		}
		.clear-btn:hover {
			cursor: pointer;
			color: #8e8e8e;
		}
		.clear-btn:active {
			transform: scale(0.85);
		}
		
		.my-search-btn{
			width: 90px;
			height: 47px;
			border-radius: 12px;
			margin-left: 5px;
		}
	}
</style>