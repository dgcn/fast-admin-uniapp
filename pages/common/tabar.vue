<template>
	<view class="footer">
		<view class="content">
			<u-tabbar :value="value7" :placeholder="false" :border="false" @change="onChange" :fixed="true"
				:safeAreaInsetBottom="false">
				<u-tabbar-item text="首页" icon="home"></u-tabbar-item>
				<u-tabbar-item text="搜索" icon="search"></u-tabbar-item>
				<!-- <u-tabbar-item text="直播" icon="play-right"></u-tabbar-item> -->
				<u-tabbar-item text="我的" icon="account"></u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'footerTabar',
		data() {
			return {
				value7: 0,
				menu: {
					0: '/pages/news/index',
					1: '/pages/news/new_list',
					2: '/pages/center/index'
				}
			}
		},
		methods: {
			onChange(value) {
				this.value7 = value
				uni.redirectTo({
					url: this.menu[value]
				})
			}
		}
	}
</script>

<style scoped>

</style>