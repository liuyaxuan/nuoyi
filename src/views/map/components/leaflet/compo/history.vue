<template>
	<div id="menu-container" class="drawer menu-container">
		<div class="trapezoid" @click="handleOpen('menu-container')">
			<div class="trapezoid-inner">历史</div>
		</div>
		<!-- 历史列表 -->
		<div class="menu-container-info">
			<el-divider content-position="left">历史图层覆盖物列表</el-divider>
			<div class="layer-history-list">
				<div
					class="history-item"
					v-for="(item, index) in historyListData"
					:key="index"
					@mouseover="handleOver('arrow' + index)"
					@mouseleave="handLeave('arrow' + index)"
				>
					<div :id="'arrow' + index" class="arrow-icon"></div>
					<div class="history-item-name">{{ item.name }}</div>
					<div class="fncs">
						<el-button
							type="primary"
							size="small"
							round
							@click="handleUsing"
						>引用</el-button>
						<el-button
							type="danger"
							size="small"
							round
						>删除</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		defineProps,
		getCurrentInstance,
	} from 'vue';
	
	// 当前实例
	const app = getCurrentInstance();
	// 挂载到全局的方法
	const proxy = app.proxy;
	// props
	const props = defineProps({
		map: {
			type: Object,
			default: () => {},
		},
	});
	// 响应式状态
	const historyListData = ref([{ name: '测试1' }, { name: '测试2' }]);
	
	const handleOpen = (id) => {
		let drawer = document.getElementsByClassName('drawer');
		let dom = document.getElementById(id);
		if (dom.style.right == '30px') {
			dom.style.right = '-300px';
		} else {
			dom.style.right = '30px';
			for (let i = 0; i < drawer.length; i++) {
				if (drawer[i].id !== id) {
					drawer[i].style.right = '-300px';
				}
			}
		}
	}
	
	const handleOver = (id) => {
		let item = document.getElementById(id);
		item.classList.add('arrow')
	}
	
	const handLeave = (id) => {
		let item = document.getElementById(id);
		item.classList.remove('arrow')
	}
	
	const handleUsing = () => {
		
	}
	
	onMounted(() => {
		
	})
	
</script>

<style scoped lang="less">
	.menu-container {
		position: absolute;
		top: 10px;
		right: -300px;
		// right: 30px;
		width: 300px;
		height: 60vh;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 6px;
		box-shadow: 2px 5px 5px rgba(0, 0, 100, 0.6);
		z-index: 998;
		transition: right 0.5s ease-in-out;
		
		.menu-container-info {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0px;
			left: 0px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			.layer-history-list {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				overflow-y: auto;
				
				.history-item {
					width: 100%;
					height: 30px;
					line-height: 30px;
					text-align: left;
					font-size: 14px;
					font-weight: bold;
					border-top: 1px solid transparent;
					border-bottom: 1px solid transparent;
					display: flex;
					justify-content: space-between;
					align-items: center;
					position: relative;
					&:hover {
						cursor: pointer;
						border-top: 1px solid #3f9eff;
						border-bottom: 1px solid #3f9eff;
						.arrow {
							border-left: 7px solid #3f9eff;
						}
					}
					.arrow-icon {
						margin-right: 10px;
						&:before {
							width: 7px;
							content: ' ';
							display: inline-block;
						}
					}
					.arrow {
						width: 0;
						height: 0;
						border-top: 7px solid transparent;
						border-bottom: 7px solid transparent;
						border-left: 7px solid #3f9eff;
						animation: slideLeft 1s infinite;
					}
			
					@keyframes slideLeft {
						0% {
							transform: translateX(0);
							opacity: 0;
						}
						50% {
							transform: translateX(5px);
							opacity: 1;
						}
						100% {
							transform: translateX(0);
							opacity: 0;
						}
					}
					
					.history-item-name {
						width: 100%;
						text-align: left;
					}
					
					.fncs {
						width: auto;
						display: flex;
						justify-content: right;
						align-items: center;
						margin-right: 10px;
					}
				}
			}
		}
		
		// 页签
		.trapezoid {
		    position: relative;
			top: 100px;
			left: -30px;
		    width: 30px;
		    height: 50px;
		    background: rgba(255, 255, 255, 1);
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