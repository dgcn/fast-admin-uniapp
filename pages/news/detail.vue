<template>
	<view>
		<u-toast ref="uToast"></u-toast>
		<view class="img-style">
			<u-icon space="20px" size="90" :name="'/static/icon/'+fileInfo.file_info_json.type+'.png'"
				style="background-color: red;"></u-icon>
		</view>
		<span
			style="margin-top: 20px; font-size: 18px;  display: flex;justify-content: center; align-items: center;">{{fileInfo.name +'.'+ fileInfo.file_info_json.type}}</span>

		<view class=""
			style="background-color: bisque; margin: 10px 10px;border-radius: 5px;font-size: 13px;  padding: 10px 10px;">
			<u-row customStyle="margin-bottom: 10px;">
				<u-col span="8">
					<view class="demo-layout bg-purple-light">上传时间：{{fileInfo.create_date}}</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout bg-purple">大小：{{fileInfo.file_info_json.size}} KB</view>
				</u-col>
			</u-row>
			<u-row customStyle="margin-bottom: 10px;" style="margin-top: 20px;">
				<u-col span="8">
					<view class="demo-layout bg-purple-light">收藏人数：{{fileInfo.collect_count}}</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout bg-purple">阅读人数：{{fileInfo.read_count}}</view>
				</u-col>
			</u-row>
		</view>

		<view>
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="4">
					<view class="button-container" style="">
						<span class="demo-layout bg-purple-light" @click="downloadFile">下载预览 </span>
						<u-icon color="green" size="25" name="/static/icon/download.png"></u-icon>
					</view>
				</u-col>
				<u-col span="4" class="button-col" v-if="!isCollected">
					<view class="button-container" @click="onCollect(1)">
						<span class="demo-layout bg-purple">立即收藏</span>
						<u-icon class="icon-style" size="20" name="/static/icon/collected.png"></u-icon>
					</view>
				</u-col>
				<u-col span="4" class="button-col" v-if="isCollected">
					<view class="button-container" @click="onCollect(2)">
						<span class="demo-layout bg-purple">取消收藏</span>
						<u-icon class="icon-style" size="20" name="/static/icon/collecte.png"></u-icon>
					</view>
				</u-col>
				<u-col span="4" class="button-col">
					<view class="button-container" @click="onShare">
						<span class="demo-layout bg-purple">快速分享</span>
						<u-icon class="icon-style" size="20" name="/static/icon/share.png"></u-icon>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-alert description="温馨提示: 首次激励广告结束后,可获得文件操作权限" type="info"></u-alert>
		<u-modal :title="titleModal" :content="modalContent" :show="showModal" showCancelButton closeOnClickOverlay
			confirm-color="#00BFFF" cancel-color="#00BFFF" confirm-text="保存" cancel-text="在线预览" @confirm="confirmModal"
			@cancel="cancelModal" @close="closeModal"></u-modal>
	</view>
</template>

<script>
	import {
		request
	} from '../../common/request.js'
	import {
		showUToast
	} from '../../common/util.js'

	var collectKey = "newDetailCollect"
	export default {
		data() {
			return {
				titleModal: "文件上传附件提醒您",
				modalContent: "您已经获得该文件的操作权限，请选择",
				showModal: false,
				fileInfo: {},
				tmpFileUrl: '',
				isCollected: false,
			};
		},
		onLoad(options) {
			this.getInfo(options.id)
			this.handleRead(options.id)
		},
		methods: {
			getInfo(id) {
				request({
					url: '/api/upload/upload/getInfo',
					method: 'GET',
					data: {
						id: id
					}
				}).then(res => {
					if (res.code != 200) {
						showUToast(this.$refs.uToast, 'success', res.msg)
						return
					}
					this.fileInfo = res.data
					this.checkCollect()
				}).catch(error => {
					console.error(error);
				});
			},
			handleRead(id) {
				console.log('handleRead', id)
				request({
					url: '/api/upload/upload/add_read',
					method: 'GET',
					data: {
						id: id
					}
				}).then(res => {
					console.log(111, res)
				}).catch(error => {
					console.error("handleRead_error", error);
				});
			},
			downloadFile() {
				uni.downloadFile({ //只能是GET请求
					url: this.fileInfo.file_info_json.full_url, //请求地址(后台返回的码流地址)
					success: (res) => {
						//下载成功
						if (res.statusCode === 200) {
							//保存文件
							let tempFile = res.tempFilePath;
							this.tmpFileUrl = tempFile
							this.showModal = true
						}
					},
					fail: (e) => {
						console.log(e, '文件下载失败')
						uni.showToast({
							title: '文件下载失败',
							icon: "error",
						})
					}
				})

			},
			onCollect(status) {
				console.log('onCollect')
				request({
					url: '/api/upload/upload/collect',
					method: 'GET',
					data: {
						id: this.fileInfo.id,
						status: status
					}
				}).then(res => {
					if (res.code != 200) {
						showUToast(this.$refs.uToast, 'error', res.msg)
						return
					}
					this.handleCollect(status)
					showUToast(this.$refs.uToast, 'success', res.msg)
				}).catch(error => {
					console.error(error);
				});
			},
			onShare() {
				console.log('onShare')
				uni.showShareMenu({
					title: this.fileInfo.name,
					path: '/pages/news/detail',
					imageUrl: '/static/icon/' + this.fileInfo.file_info_json.type + '.png',
					success: function(res) {
						console.log('分享成功', res);
					},
					fail: function(err) {
						console.error('分享失败', err);
						uni.showToast({
							title: '分享失败',
							icon: "error",
						})
					}
				});
			},
			confirmModal() {
				console.log('confirmModal')
				if (uni.getSystemInfoSync().platform === 'mp-weixin') {
					// 调用微信小程序的发送消息接口
					wx.sendMessageFile({
						filePath: this.tmpFileUrl, // 文件路径
						success: function(res) {
							console.log('文件已发送给好友', res);
						},
						fail: function(err) {
							console.error('发送文件失败：', err);
							uni.showToast({
								title: '发送文件失败',
								icon: "error",
							})
						}
					});
					this.showModal = false
				} else {
					console.error('该功能仅支持微信小程序环境');
					uni.showToast({
						title: '该功能仅支持微信小程序环境',
						icon: "error",
					})
				}

			},
			cancelModal() {
				console.log('cancelModal')
				uni.openDocument({
					filePath: this.tmpFileUrl,
					fileType: this.fileInfo.file_info_json.type,
					success: function(res) {
						console.log('打开文档成功');
						this.showModal = false
					},
					fail: function(err) {
						console.log('打开文档失败', err);
						uni.showToast({
							title: '打开文档失败',
							icon: "error",
						})
					}
				});
			},
			closeModal() {
				console.log('closeModal')
				this.showModal = false
			},
			checkCollect() {
				var newDetailCollectList = uni.getStorageSync(collectKey)
				newDetailCollectList = JSON.parse(newDetailCollectList)
				if (newDetailCollectList[this.fileInfo.id]) {
					this.isCollected = true
				}
			},
			handleCollect(status) {
				var newDetailCollectList = uni.getStorageSync(collectKey)
				if (newDetailCollectList) {
					newDetailCollectList = JSON.parse(newDetailCollectList)
				} else {
					newDetailCollectList = {}
				}
				var isExist = false
				if (newDetailCollectList[this.fileInfo.id]) {
					isExist = true
				}
				if (status == 1) {
					if (!isExist) {
						newDetailCollectList[this.fileInfo.id] = this.fileInfo
						this.fileInfo.collect_count = this.fileInfo.collect_count + 1

					}
					this.isCollected = true
				} else {
					if (isExist) {
						delete newDetailCollectList[this.fileInfo.id]
						if (this.fileInfo.collect_count > 0) {
							console.log(232323, this.fileInfo.collect_count)
							this.fileInfo.collect_count = this.fileInfo.collect_count - 1
						}
					}
					this.isCollected = false
				}
				uni.setStorageSync(collectKey, JSON.stringify(newDetailCollectList))
			}
		}
	}
</script>

<style>
	.button-col {
		background-color: rebeccapurple;

	}

	.button-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		/* background-color: green; */
		background-color: lightseagreen;
		width: 80%;
		margin: auto;
		border-radius: 9px;
		font-size: 15px;

	}

	.img-style {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30px;
		height: 100rpx;
	}
</style>