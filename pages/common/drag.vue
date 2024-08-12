<template>
	<view class="float-icon" :style="{right: right + 'px', bottom: bottom + 'px'}" @touchstart="touchStart"
		@touchmove="touchMove" @touchend="touchEnd">
		<image src="/static/logo.png" style="width: 50rpx;height: 50rpx;" @click="onClick"></image>
	</view>
</template>
<script>
	export default {
		name: 'dragBall',
		data() {
			return {
				startX: 0,
				startY: 0,
				moveX: 0,
				moveY: 0,
				right: 20,
				bottom: 100,
			}
		},
		methods: {
			touchStart(e) {
				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY
			},
			touchMove(e) {
				this.moveX = e.touches[0].clientX - this.startX
				this.moveY = e.touches[0].clientY - this.startY
				this.right -= this.moveX
				this.bottom -= this.moveY
				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY
			},
			touchEnd(e) {
				// do something
			},
			onClick() {
				this.$emit('click-event');
			}
		},
	}
</script>
<style>
	.float-icon {
		position: fixed;
		width: 50px;
		height: 50px;
		border-radius: 25px;
		background-color: #83deff;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
</style>