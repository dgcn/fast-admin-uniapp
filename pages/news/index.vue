<template>
	<view class="content" style="">
		<!-- <u-tabs :list="tabList" @click="clickTab" :current="currentTab"></u-tabs> -->
		<u-list @scrolltolower="scrolltolower" style="background-color: gray !important;">
			<u-list-item v-for="(item, index) in pageList" :key="index" style="padding: 10px 0; ">
				<view class="item" @click="toOperate(item)"
					style="margin: 10px 5px 0; border-radius: 5px; border: solid 1px gray;padding: 9px 5px;">
					<view class="item-img">
						<u-icon :label="item.file_info_json.full_name" space="20px" size="60"
							:name="'/static/icon/'+item.file_info_json.type+'.png'"></u-icon>
					</view>
					<view class="item-content" style="margin-left: 15px; font-size: 13px;">
						<span style="padding-top: 20px;">上传时间: {{ item.create_date }}</span>
						<span
							style="display: inline; float: right; margin-right: 15px;background-color: green;color:white; padding: 2px 4px; border-radius: 3px;"
							:value="item.id" @click="OnNavigator(item.id)">点击查看</span>
					</view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	import {
		request
	} from '../../common/request.js'
	import {
		showUToast
	} from '../../common/util.js'
	export default {
		data() {
			return {
				currentTab: 0,
				currentId: -1,
				tabList: [{
					name: '全部',
					id: 0
				}],
				pageList: []
			}
		},
		onLoad() {
			// 加载分类
			this.getUploadClassifyList()
			this.getUploadFileList(this.currentTab, this.currentId)
		},
		methods: {
			clickTab(value, index) {
				this.getUploadFileList(value.index, value.id)
			},
			scrolltolower() {
				this.getUploadFileList(this.currentTab, this.currentId)
			},
			getUploadClassifyList() {
				request({
					url: '/api/upload/classify/list',
					method: 'GET',
					data: {
						status: 1
					}
				}).then(res => {
					console.log(res);
					if (res.code != 200) {
						showUToast(this.$refs.uToast, 'error', res.msg)
						return
					}
					this.tabList = [...this.tabList, ...res.data.list]
				}).catch(error => {
					console.error(error);
					showUToast(this.$refs.uToast, 'error', res.msg)
				});
			},
			getUploadFileList(tabIndex, uploadClassifyId) {
				request({
					url: '/api/upload/upload/list',
					method: 'GET',
					data: {
						status: 1,
						upload_classify_id: uploadClassifyId
					}
				}).then(res => {
					if (res.code != 200) {
						showUToast(this.$refs.uToast, 'error', res.msg)
						return
					}
					this.pageList = res.data.list
					this.currentTab = tabIndex
					this.currentId = uploadClassifyId
				}).catch(error => {
					console.error(error);
					showUToast(this.$refs.uToast, 'error', res.msg)
				});
			},
			onlineLook() {
				console.log('onlineLook')
			},
			OnNavigator(id) {
				uni.navigateTo({
					url: `/pages/news/detail?id=${id}`
				});
			},
			toOperate() {}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>