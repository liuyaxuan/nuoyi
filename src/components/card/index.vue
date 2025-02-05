<!--

	component: ny-card
	description: 分割线组件
	attributes:
        - title: 标题
        - context: 内容
        - bgColor: 背景颜色
	author: Liu.Y.X
	date: 2025-01-21

-->

<template>
    <div :id="id" class="ny-card">
        <div class="notiglow"></div>
        <div class="notiborderglow"></div>
        <div class="notititle">{{ title }}</div>
        <div class="notibody">{{ context }}</div>
    </div>
</template>

<script setup>
import {
    ref,
    computed,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
} from 'vue';
import { useStore } from 'vuex'


defineOptions({
    name: 'ny-card'
})

defineProps({
    id: {
        type: String,
        default: 'card1',
        required: true
    },
    title: {
        type: String,
        default: '标题'
    },
    context: {
        type: String,
        default: ''
    },
    bgColor: {
        type: String,
        default: '#222222'
    }
})


const app = getCurrentInstance(); // 获取当前组件的实例
const { props } = app;
const proxy = app.proxy; // 获取当前组件的代理对象
const store = useStore();

const setCardBackground = (id, bgColor) => {
  try {
    const element = document.getElementById(id);
    if (element) {
        document.styleSheets[0].addRule('#'+id+'::before', 'background: ' + bgColor + ';');
    }
  } catch (error) {
    console.log(error);
  }
}

onBeforeMount(() => {

});

onMounted(() => {
  setCardBackground(props.id, props.bgColor);
});

onBeforeUpdate(() => {

});

onUpdated(() => {

});
</script>

<style scoped lang="less">
.ny-card {
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  width: 100%;
  min-width: 200px;
  max-width: 350px;
  height: 8rem;
  background: #7e61ff;
  border-radius: 1rem;
  overflow: hidden;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 16px;
  --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
  --color: #32a6ff;
  cursor: pointer;
}

.ny-card:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.9375rem;
  // background: #222222;
  z-index: 2;
}

.ny-card:after {
  position: absolute;
  content: "";
  width: 0.25rem;
  inset: 0.65rem auto 0.65rem 0.5rem;
  border-radius: 0.125rem;
  background: var(--gradient);
  transition: transform 300ms ease;
  z-index: 4;
}

.ny-card:hover:after {
  transform: translateX(0.15rem)
}

.notititle {
  color: var(--color);
  padding: 0.65rem 0.25rem 0.4rem 1.25rem;
  font-weight: 500;
  font-size: 1.1rem;
  transition: transform 300ms ease;
  z-index: 5;
}

.ny-card:hover .notititle {
  transform: translateX(0.15rem)
}

.notibody {
  color: #fff;
  padding: 0 1.25rem;
  transition: transform 300ms ease;
  z-index: 5;
}

.ny-card:hover .notibody {
  transform: translateX(0.25rem)
}

.notiglow,
.notiborderglow {
  position: absolute;
  width: 20rem;
  height: 20rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle closest-side at center, white, transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}

.notiglow {
  z-index: 3;
}

.notiborderglow {
  z-index: 1;
}

.ny-card:hover .notiglow {
  opacity: 0.1
}

.ny-card:hover .notiborderglow {
  opacity: 0.1
}

.note {
  color: var(--color);
  position: fixed;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.9rem;
  width: 75%;
}
</style>