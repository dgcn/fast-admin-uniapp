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
					<view class="demo-layout bg-purple">大小：232332 KB</view>
				</u-col>
			</u-row>
			<u-row customStyle="margin-bottom: 10px;" style="margin-top: 20px;">
				<u-col span="8">
					<view class="demo-layout bg-purple-light">收藏人数：1111</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout bg-purple">阅读人数：232332</view>
				</u-col>
			</u-row>
		</view>

		<view>
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="4">
					<view class="button-container" style="">
						<span class="demo-layout bg-purple-light" @click="downloadFile()">下载预览 </span>
						<u-icon color="green" size="25" name="/static/icon/download.png"></u-icon>
					</view>
				</u-col>
				<u-col span="4" class="button-col">
					<view class="button-container">
						<span class="demo-layout bg-purple">立即收藏</span>
						<u-icon class="icon-style" size="20" name="/static/icon/collected.png"></u-icon>
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
	export default {
		data() {
			return {
				titleModal: "文件上传附件提醒您",
				modalContent: "您已经获得该文件的操作权限，请选择",
				showModal: false,
				fileInfo: {},
				tmpFileUrl: ''
			};
		},
		onLoad(options) {
			this.getInfo(options.id)
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
				}).catch(error => {
					console.error(error);
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
			onCollect(){
				console.log('onCollect')
				uni.getUserProfile({
					desc: '用于完善会员资料', // 必填，声明获取用户个人信息后的用途
					success: (res) => {
						console.log('userInfo', res.userInfo); // 输出用户信息
						// 处理用户信息
					},
					fail: (err) => {
						console.log('用户信息获取失败', err);
						showUToast(this.$refs.uToast, 'error', err)
						return
					}
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