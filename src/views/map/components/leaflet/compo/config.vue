<template>
	<div id="config-container" class="drawer config-container">
		<div class="trapezoid" @click="handleOpen('config-container')">
			<div class="trapezoid-inner">配置</div>
		</div>
		<!-- 配置项列表 -->
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		getCurrentInstance,
	} from 'vue';
	
	// 当前实例
	const app = getCurrentInstance();
	// 挂载到全局的方法
	const proxy = app.proxy;
	// 响应式状态
	const textareaData = ref('');
	
	const handleOpen = (id) => {
		let drawer = document.getElementsByClassName('drawer');
		let dom = document.getElementById(id);
		if (dom.style.right == '10px') {
			dom.style.right = '-300px';
		} else {
			dom.style.right = '10px';
		}
	}
	
	onMounted(() => {
		
	})
	
</script>

<style scoped lang="less">
	.config-container {
		position: absolute;
		top: 10px;
		right: -300px;
		width: 300px;
		height: 60vh;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 6px;
		box-shadow: 2px 5px 5px rgba(0, 0, 100, 0.6);
		z-index: 998;
		transition: right 0.5s ease-in-out;
		
		// 页签
		.trapezoid {
		    position: relative;
			top: 160px;
			left: -30px;
		    width: 30px;
		    height: 50px;
		    background: rgba(255, 255, 255, 0.8);
			border-radius: 6px 6px;
			cursor: pointer;
			.trapezoid-inner {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				font-size: 13px;
				text-align: center;
				color: #000;
				font-weight: bold;
				writing-mode: vertical-rl;
				text-orientation: upright;
				z-index: 999;
				border-radius: 6px 6px;
			}
		}
		.trapezoid:hover {
			background-color: #3f9eff;
			.trapezoid-inner {
				color: #fff;
			}
		}
		
				         
		.trapezoid::before,
		.trapezoid::after {
		    content: '';
		    position: absolute;
		    top: 0;
		    width: 100%;
		    height: 100%;
		    background: inherit;
		    border-radius: inherit;
			border-radius: 6px 0px 0px 6px;
		}
				         
		.trapezoid::before {
		    right: 0%;
			top: -15%;
		    transform: skewY(-28deg);
		}
				         
		.trapezoid::after {
		    right: 0%;
			top: 15%;
		    transform: skewY(28deg);
		}
	}
</style>