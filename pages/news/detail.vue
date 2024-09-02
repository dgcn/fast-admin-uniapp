<template>
	<view>
		<u-toast ref="uToast"></u-toast>
		<view class="img-style">
			<u-icon space="20px" size="90"
				:name="'/static/icon/'+(fileInfo.file_info_json.type != undefined ? fileInfo.file_info_json.type : 'xlsx')+'.png'"
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
				<!-- 	<u-col span="8">
					<view class="demo-layout bg-purple-light">收藏人数：{{fileInfo.collect_count}}</view>
				</u-col> -->
				<u-col span="4">
					<view class="demo-layout bg-purple">下载人数：{{fileInfo.read_count}}</view>
				</u-col>
			</u-row>
		</view>

		<view>
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="6" @click="downloadFileButton">
					<view class="button-container">
						<span class="demo-layout bg-purple-light">下载预览 </span>
						<u-icon color="green" size="25" name="/static/icon/download.png"></u-icon>
					</view>
				</u-col>
				<!-- 			<u-col span="4" class="button-col" v-if="!isCollected">
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
				</u-col> -->
				<u-col span="6" class="button-col" >
					<button open-type="share" class="open-share1" style="margin-right: 25px;">快速分享
						<u-icon class="icon-style" size="20" name="/static/icon/share.png"></u-icon>
					</button>
				</u-col>
			</u-row>
		</view>
		<!-- <u-alert description="温馨提醒：观看完整视频后，即可获得岗位附件" type="warning"></u-alert> -->
		<u-modal :title="titleModal" :content="modalContent" :show="showModal" showCancelButton closeOnClickOverlay
			confirm-color="#00BFFF" cancel-color="#00BFFF" confirm-text="保存" cancel-text="在线预览" @confirm="confirmModal"
			@cancel="cancelModal" @close="closeModal"></u-modal>
		<u-modal title="温馨提示" content="观看一次视频，即可下载上岸附件" :show="showModal2" showCancelButton closeOnClickOverlay
			confirm-color="#00BFFF" cancel-color="#00BFFF" confirm-text="确认" cancel-text="取消" @confirm="confirmModal2"
			@cancel="cancelModal2" @close="closeModal2"></u-modal>
			
		<u-modal title="温馨提示" content="文件正在下载中....." :show="showModal3" showCancelButton closeOnClickOverlay
				confirm-color="#00BFFF" cancel-color="#00BFFF" confirm-text="确认" :showConfirmButton="false" :showCancelButton="false"></u-modal>
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
				titleModal: "上岸附件表",
				modalContent: "您已经获得该文件的操作权限，请选择",
				showModal: false,
				fileInfo: {},
				tmpFileUrl: '',
				isCollected: false,
				showModal2: false,
				showModal3: false
			};
		},
		onLoad(options) {
			this.getInfo(options.id)
			this.handleRead(options.id)
			this.initRewardedVideoAd()
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
					this.fileInfo.read_count = this.fileInfo.read_count + 1
				}).catch(error => {
					console.error("handleRead_error", error);
				});
			},
			downloadFileButton() {
				this.showModal2 = true
			},
			downloadFile() {
				this.handleRead(this.fileInfo.id)
				uni.downloadFile({ //只能是GET请求
					url: this.fileInfo.file_info_json.full_url, //请求地址(后台返回的码流地址)
					success: (res) => {
						console.log(233, res)
						//下载成功
						if (res.statusCode === 200) {
							//保存文件
							let tempFile = res.tempFilePath;
							this.tmpFileUrl = tempFile
							this.showModal = true
							this.showModal3 = false
						} else {
							uni.showToast({
								title: '文件下载失败',
								icon: "error",
							})
						}
					},
					fail: (e) => {
						console.log(e, '文件下载失败')
						request({
							url: '/api/upload/upload/export_err',
							method: 'POST',
							data: {
								err: JSON.stringify(e)
							}
						}).then(res => {}).catch(error => {
							console.error("handleRead_error", error);
						});
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
					showUToast(this.$refs.uToast, 'success', '操作成功')
				}).catch(error => {
					console.error(error);
				});
			},
			onShareAppMessage(e) {
				let shareobj = {
					title: this.fileInfo.file_info_json.full_name, //分享的标题
					path: '/pages/news/detail?id=' + this.fileInfo.id, //好友点击分享之后跳转的页面
					imageUrl: "/static/icon/" + this.fileInfo.file_info_json.type + ".png", //内容图片
				}
				return shareobj //一定要返回对象
			},
			confirmModal() {
				// 调用分享接口
				uni.shareFileMessage({
					filePath: this.tmpFileUrl,
					fileName: this.fileInfo.file_info_json.full_name,
					success: () => {
						console.log(err, '分享文件成功');
					},
					fail: (err) => {
						console.log(err, '分享文件失败');
					}
				});
				this.showModal = false
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
				if (newDetailCollectList != "") {
					newDetailCollectList = JSON.parse(newDetailCollectList)
					if (newDetailCollectList[this.fileInfo.id]) {
						this.isCollected = true
					}
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
							this.fileInfo.collect_count = this.fileInfo.collect_count - 1
						}
					}
					this.isCollected = false
				}
				uni.setStorageSync(collectKey, JSON.stringify(newDetailCollectList))
			},
			// 初始化激励视频广告
			initRewardedVideoAd() {
				const ad = uni.createRewardedVideoAd({
					adUnitId: 'adunit-9afd52e76eea1146'
				});
				ad.onLoad(() => {
					console.log('视频广告加载成功');
				});
				ad.onError((err) => {
					console.log('视频广告加载失败', err);
					uni.showToast({
						title: '视频广告加载失败',
						icon: "error",
					})
				});
				ad.onClose((res) => {
					if (res && res.isEnded) {
						// 用户观看完视频，发放奖励
						this.showModal3 = true
						this.downloadFile()
					} else {
						// 用户没有完整观看视频，给出提示
						uni.showToast({
							title: '观看完视频才可以获取上岸附件哦',
							icon: "none",
							duration: 2000
						})
					}
				});
				this.rewardedVideoAd = ad;
			},
			// 展示激励视频广告
			showRewardedVideoAd() {
				if (this.rewardedVideoAd) {
					this.rewardedVideoAd.show().catch(err => {
						console.error(err);
					});
				}
			},
			confirmModal2() {
				this.showRewardedVideoAd()
				this.showModal2 = false
			},
			cancelModal2() {
				this.showModal2 = false
			},
			closeModal2() {
				this.showModal2 = false
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

	.open-share1 {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: lightseagreen;
		margin: auto;
		height: 80rpx;
		font-size: 14px;
	}
</style>