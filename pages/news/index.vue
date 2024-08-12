<template>
	<view class="">
		<view class="u-demo-block__content m-t-10">
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="2">
					<view class=""
						style="background-color: lightgray; text-align: center; margin: auto;width: 100%;height: 100%;padding: 6px 0; border-radius: 1px;">
						<span @click="onSelectSearch" style="font-size: 13px;">{{defaultSelect}}</span>
					</view>
				</u-col>
				<u-col span="10">
					<u-search v-model="searchName" :show-action="false" shape="square"
						@search="onChangeSearch"></u-search>
				</u-col>
			</u-row>
		</view>
		<u-picker :show="isShowSelect" :columns="selectColumns" @close="onCloseSearch" @confirm="onConfirmSearch"
			@cancel="onCancelSearch"></u-picker>

		<!-- <u-tabs :list="tabList" @click="clickTab" :current="currentTab"></u-tabs> -->
		<view class="content" style="">
			<itemList @scrolltolower="scrolltolower" :pageList="pageList" />
		</view>
		<dragBall @click-event="onShareNews" v-if="pageList.length > 0"></dragBall>
		<!-- <footerTabar /> -->
	</view>
</template>

<script>
	import {
		request
	} from '../../common/request.js'
	import {
		showUToast
	} from '../../common/util.js'
	import itemList from './item_list.vue'
	import footerTabar from '../common/tabar.vue'
	import dragBall from '../common/drag.vue';
	export default {
		components: {
			footerTabar,
			dragBall,
			itemList
		},
		data() {
			return {
				currentTab: 0,
				currentId: -1,
				tabList: [{
					name: '全部',
					id: 0
				}],
				pageList: [],
				searchData: {
					name: '',
					ids: "",
					status: 1,
					upload_classify_id: -1,
				},
				searchName: '',
				isShowSelect: false,
				defaultSelect: '名称',
				selectColumns: [
					['名称', 'ID']
				],
			}
		},
		onLoad() {
			// 加载分类
			this.getUploadClassifyList()
			this.getUploadFileList(this.currentTab, this.currentId)
		},
		methods: {
			clickTab(value, index) {
				this.searchData.upload_classify_id = value.id
				this.currentId =  value.id
				this.currentTab = value.index
				this.getUploadFileList()
			},
			scrolltolower() {
				this.getUploadFileList()
			},
			getUploadClassifyList() {
				request({
					url: '/api/upload/classify/list',
					method: 'GET',
					data: {
						status: 1,
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
			getUploadFileList() {
				request({
					url: '/api/upload/upload/list',
					method: 'GET',
					data: this.searchData
				}).then(res => {
					if (res.code != 200) {
						showUToast(this.$refs.uToast, 'error', res.msg)
						return
					}
					this.pageList = res.data.list
				}).catch(error => {
					console.error(error);
					showUToast(this.$refs.uToast, 'error', res.msg)
				});
			},
			onChangeSearch() {
				if (this.defaultSelect == "ID") {
					this.searchData.ids = this.searchName
				} else {
					this.searchData.name = this.searchName
				}
				this.getUploadFileList()
			},
			onCloseSearch() {
				// console.log('close');
				this.isShowSelect = false
			},
			onConfirmSearch(e) {
				this.isShowSelect = false
				this.defaultSelect = e.value[0]
			},
			onCancelSearch() {
				// console.log('cancel');
				this.isShowSelect = false
			},
			onSelectSearch() {
				this.isShowSelect = true
			},
			onShareNews(values) {
				var searchData = this.searchData
				// 当前页面发起跳转，并传递参数
				const targetPage = '/pages/news/search_list';

				// 序列化参数
				const queryString = Object.keys(searchData)
					.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchData[key])}`)
					.join('&');

				// 拼接URL
				const url = `${targetPage}?${queryString}`;
				// 跳转到目标页面
				uni.navigateTo({
					url: url
				});
			}
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

	.container2 {
		padding-bottom: 100rpx;
		/* 确保按钮不会被页面内容遮挡 */
	}
</style>