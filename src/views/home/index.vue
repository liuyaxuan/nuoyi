<template>
    <div class="home-container">
		<ny-search
            @handleSearch="handleSearch"
        ></ny-search>
        <div class="home-content">
            <div class="row-measure">
                <ny-card
                    id="card1"
                    class="mr-10"
                    title="卡片标题1"
                    context="123123"
                    bgColor="#494949"
                ></ny-card>
                <ny-card
                    id="card2"
                    class="mr-10"
                    title="卡片标题2"
                    context="456456"
                    bgColor="#313e6a"
                ></ny-card>
                <ny-card
                    id="card3"
                    class="mr-10"
                    title="卡片标题3"
                    context="789789"
                    bgColor="#494949"
                ></ny-card>
                <ny-card
                    id="card4"
                    title="卡片标题4"
                    context="123123"
                    bgColor="#313e6a"
                ></ny-card>
            </div>
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
    getCurrentInstance, // 获取当前组件的实例
} from 'vue';
// 组件
import nySearch from '@/components/search'
import nyDivider from '@/components/divider'
import nyCard from '@/components/card'

export default {
    name: 'home-container',
	components: {
		nySearch,
        nyDivider,
        nyCard
	},
    setup() {
        const app = getCurrentInstance(); // 获取当前组件的实例
        const refRac = reactive({

        });

        const handleSearch = (val) => {
            console.log("==>", val);
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
            handleSearch
        };
    }
}
</script>

<style scoped lang="less">
	.home-container {
		width: 100%;
		height: 100%;
		background: #ffffff;
        display: flex;
        flex-direction: column;

        .home-content {
            width: 100%;
            height: 100%;
            padding-left: 15px;
            padding-right: 15px;
            box-sizing: border-box;
            
            .row-measure {
                width: 100%;
                height: auto;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            
        }
	}
</style>