<template>
	<view class="container">
		<view class="user-info" style="padding-left: 20px;padding-top: 10px;">
			<u--image radius="4" src="/static/logo.png" width="80px" height="80px"></u--image>
			<text class="username">用户名: 未知</text><br />
		</view>
		<u-cell-group>
			<u-cell title="联系客服" isLink icon="server-fill" @click="clickContactServer"></u-cell>
			<u-cell title="我的收藏" isLink icon="lock-fill" url="/pages/news/my_news"></u-cell>
		</u-cell-group>
		<u-modal content="暂未开放" title="联系客服" :show="showContactServer"
			@confirm="() => showContactServer = false"></u-modal>
		<!-- <footerTabar /> -->
	</view>
</template>

<script>
	import footerTabar from '../common/tabar.vue'
	export default {
		components: {
			footerTabar
		},
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
	.container {
		/* padding: 20px; */
	}

	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.avatar {
		width: 60px;
		height: 60px;
		margin-right: 10px;
	}

	.username {
		font-size: 16px;
		font-weight: bold;
		margin-left: 10px;
	}
</style>