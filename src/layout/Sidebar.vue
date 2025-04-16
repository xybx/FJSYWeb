<template>
	<div class="sidebar">
		<el-menu
			class="sidebar-el-menu"
			:default-active="onRoutes"
			:collapse="collapse"
			background-color="#324157"
			text-color="#bfcbd9"
			active-text-color="#409EFF"
			unique-opened
			router
		>
			<template v-for="item in menuData">
				<template v-if="item.CHILDREN">
					<el-submenu :index="item.PATH" :key="item.PID">
						<template slot="title">
							<i class="iconfont" :class="item.ICON"></i>
							<span slot="title">{{ item.TITLE }}</span>
						</template>
						<template v-for="subItem in item.CHILDREN">
							<el-submenu v-if="subItem.CHILDREN" :index="subItem.PATH">
								<template slot="title">{{ subItem.TITLE }}</template>
								<el-menu-item v-for="(threeItem, i) in subItem.CHILDREN" :key="i" :index="threeItem.PATH">{{
									threeItem.TITLE
								}}</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.PATH">{{ subItem.TITLE }}</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.PATH" :key="item.PID">
						<i class="iconfont" :class="item.ICON"></i>
						<span slot="title">{{ item.TITLE }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
import { getRuleModule } from '@/api/home-api';
import bus from './bus';
export default {
	data() {
		return {
			collapse: false,
			menuData: []
		};
	},
	computed: {
		onRoutes() {
			return this.$route.path.replace('/', '');
		}
	},
	created() {
		// 通过 Event Bus 进行组件间通信，来折叠侧边栏
		bus.$on('collapse', (msg) => {
			this.collapse = msg;
			bus.$emit('collapse-content', msg);
		});
	},
	mounted() {
		let token = sessionStorage.getItem("token");
		if (token == null || token == '') {
			this.$router.push({
				path: "/login",
			});
			return;
		}
		this.getMenuList();
	},
	methods: {
		async getMenuList() {
			let user = JSON.parse(sessionStorage.getItem('user'));
			let params = {
				groupname: '21',
				thisGroupName: '21',
				thisPagePath: ''
			}
			let token = sessionStorage.getItem('token');
			const res = await getRuleModule(params, token);
			if (res.code === 200) {
				this.menuData = res.data.html;
			}
		}
	}
};
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 200px;
}
.sidebar > ul {
	height: 100%;
}
.iconfont {
	margin-right: 10px;
	color: #bfcbd9;
}
</style>
