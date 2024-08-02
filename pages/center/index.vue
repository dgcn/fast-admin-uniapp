<template>
	<view>
		<view class="">

		</view>
		<u-cell-group>
			<u-cell title="联系客服" icon="server-fill" @click="clickContactServer"></u-cell>
			<!-- 	<u-cell
			    title="打开徽标页"
			    isLink
				icon="lock-fill"
			    url="/pages/componentsB/badge/badge"
			></u-cell> -->
		</u-cell-group>
		<u-modal content="暂未开放" title="联系客服" :show="showContactServer"
			@confirm="() => showContactServer = false"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showContactServer: false
			}
		},
		methods: {
			clickContactServer() {
				this.showContactServer = true
			}
		}
	}
</script>

<style scoped>

</style>