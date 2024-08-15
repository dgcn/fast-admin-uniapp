<template>
	<view>
		<view class="content">
			<itemList @scrolltolower="scrolltolower" :pageList="pageList" />
		</view>
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
	export default {
		components: {
			itemList
		},
		data() {
			return {
				searchData: {
					name: '',
					ids: '',
					upload_classify_id: '',
					status: ''
				},
				pageList: []
			}
		},
		onLoad(options){
			  if (options.arrayData) {
			      // 将接收到的字符串转换回数组
			      const receivedArrayData = JSON.parse(decodeURIComponent(options.arrayData));
				  this.searchData =receivedArrayData
			    }
			this.getUploadFileList()
		},
		methods: {
			scrolltolower() {
				this.getUploadFileList()
			},
			getUploadFileList(tabIndex, uploadClassifyId) {
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
</style>