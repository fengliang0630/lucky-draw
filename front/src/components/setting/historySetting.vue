<template>
	<div class="history-setting">
		<div v-if="!prizeHistoryList.length" class="empty">暂无抽奖数据</div>

		<h1 style="font-size: 25px;text-align: center;">兑奖历史</h1>
		<div>
			<van-field v-model="value" placeholder="请输入用户名" @click="selectPayWay"
			@click-right-icon="search" right-icon="search"/>
		</div>

		<van-card v-for="(item, i) in prizeHistoryList" :key="i"
			:desc="item.description"
			:title="`${item.label}-${item.status === '0' ? '待兑奖' : '已兑奖'}`"
			:thumb="require(`../../assets/images/${item.icon}`)"
			>
			<div slot="tags">
				<div class="tag-item"><van-tag plain type="primary">{{item.wx}}</van-tag></div>
				<div class="tag-item"><van-tag plain type="success">{{item.telephone}}</van-tag></div>
				<div class="tag-item"><van-tag plain type="warning">{{item.random_id}}</van-tag></div>
			</div>
			<div slot="footer">
				<van-button v-if="item.status === '0'" size="mini" type="primary" @click="payLuck(item.id)">兑奖</van-button>
			</div>
		</van-card>

		<van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
	</div>
</template>
<script>
import { Card, Tag, Button, ActionSheet, Field } from 'vant';
import { getPrizeHistory, payLuck } from '@/api';

export default {
	name: "index",
	data() {
		return {
			prizeHistoryList: [],
			radio: '1',
			show: false,
			payWay: null,
			value: '',
			actions: [
				{ name: '手机兑奖', className: 'telephone' },
				{ name: '微信', className: 'wx' },
				{ name: '兑奖标识兑奖', className: 'random_id' }
			]
		};
	},
	created() {
		this.getPrizeHistory();
	},
	methods: {
		search() {
			const params = {};
			params[this.payWay] = this.value;
			debugger;
			this.getPrizeHistory(params);
		},
		selectPayWay() {
			if (!this.payWay) {
				this.show = true;
			}
		},
		onSelect(selectItem) {
			this.payWay = selectItem.className;
			this.show = false;
		},
		payLuck(_id) {
			payLuck(_id).then(data => {
				this.getPrizeHistory();
			});
		},
		getPrizeHistory(_params) {
			getPrizeHistory(_params).then(data => {
				this.prizeHistoryList = data.prizeHistoryList;
			});
		}
	},
	components: {
		'van-card': Card,
		'van-button': Button,
		'van-tag': Tag,
		'van-action-sheet': ActionSheet,
		'van-field': Field
	}
};
</script>
<style lang="stylus" scoped>
	.history-setting {
		.empty {
			font-size: 14px;
			text-align: center;
			margin-top: 50px;
		}

		.tag-item {
			margin: 3px 0;
		}
	}
</style>
