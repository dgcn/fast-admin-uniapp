<template>
	<view>
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
	export default {
		data() {
			return {
				pageList: []
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				var newDetailCollectList = uni.getStorageSync('newDetailCollect')
				if (newDetailCollectList) {
					newDetailCollectList = JSON.parse(newDetailCollectList)
				} else {
					newDetailCollectList = {}
				}
				this.pageList = newDetailCollectList
			},
			OnNavigator(id) {
				uni.navigateTo({
					url: `/pages/news/detail?id=${id}`
				});
			},
			toOperate(){}
		}
	}
</script>

<style>

</style>