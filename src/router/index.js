/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 11:16:10
 * @FilePath: \fjsy-web\src\router\index.js
 * @Description: 请填写描述
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component: () => import('../layout/Home.vue'),
        meta: { title: '福建省院智慧规划平台运维端' },
        children: [
            {
                path: '/mapservice',
                component: () => import('../views/dataresource/MapService.vue'),
                meta: {
                    title: '地图服务'
                }
            },
            {
                path: '/historyprj',
                component: () => import('../views/historyprj/historyprj.vue'),
                meta: {
                    title: '历史项目数据'
                }
            },
            {
                path: '/historyprjList',
                component: () => import('../views/historyprj/HistoryprjList.vue'),
                meta: {
                    title: '查询统计数据'
                }
            },
            {
                path: '/highQuality',
                component: () => import('../views/spaceAdjust/highQuality/highQuality.vue'),
                meta: {
                    title: '高质量发展'
                }
            },
            {
                path: '/cityHealth',
                component: () => import('../views/spaceAdjust/cityHealth/CityHealth.vue'),
                meta: {
                    title: '城市体检指标'
                }
            },
            {
                path: '/cityQualityPromote',
                component: () => import('../views/spaceAdjust/cityQualityPromote/CityQualityPromote.vue'),
                meta: {
                    title: '城市建设品质提升'
                }
            },
            {
                path: '/mapservice_szxc',
                component: () => import('../views/dataresource/MapService.vue'),
                meta: {
                    title: '数字乡村地图服务'
                }
            },
            {
                path: '/spacecalc',
                component: () => import('../views/basicconfig/SpaceCalc.vue'),
                meta: {
                    title: '空间计算引擎'
                }
            },
            {
                path: '/geoserver',
                component: () => import('../views/basicconfig/GeoServer.vue'),
                meta: {
                    title: '地图服务器'
                }
            },
            {
                path: '/achievement',
                component: () => import('../views/basicconfig/achievement.vue'),
                meta: {
                    title: '系列成果'
                }
            },
            {
                path: '/sdedatabase',
                component: () => import('../views/basicconfig/SdeDatabase.vue'),
                meta: {
                    title: '空间数据库'
                }
            },
            {
                path: '/basemapconfig',
                component: () => import('../views/basicconfig/BasemapConfig.vue'),
                meta: {
                    title: '底图配置'
                }
            },
            {
                path: '/condition',
                component: () => import('../views/onemap/Condition.vue'),
                meta: {
                    title: '条件查询'
                }
            },
            {
                path: '/hxdownload',
                component: () => import('../views/onemap/HxDownload.vue'),
                meta: {
                    title: '红线下载'
                }
            },
            {
                path: '/locate',
                component: () => import('../views/onemap/QueryLocate.vue'),
                meta: {
                    title: '查询定位'
                }
            },
            {
                path: '/locate_szxc',
                component: () => import('../views/onemap/QueryLocate.vue'),
                meta: {
                    title: '查询定位'
                }
            },
            {
                path: '/locatechild',
                component: () => import('../views/onemap/LocateChild.vue'),
                meta: {
                    title: '定位-子图层'
                }
            },
            {
                path: '/departadmin',
                component: () => import('../views/safemanage/DepartAdmin.vue'),
                meta: {
                    title: '部门管理'
                }
            },
            {
                path: '/roleadmin',
                component: () => import('../views/safemanage/RoleAdmin.vue'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: '/setroleauth',
                name: 'setroleauth',
                component: () => import('../views/safemanage/SetRoleAuth2.vue'),
                meta: {
                    title: '角色权限配置'
                }
            },
            {
                path: '/setroleedit',
                name: 'setroleedit',
                component: () => import('../views/safemanage/RoleEdit.vue'),
                meta: {
                    title: '角色信息权限设置'
                }
            },
            {
                path: '/peopleadmin',
                component: () => import('../views/safemanage/PeopleAdmin.vue'),
                meta: {
                    title: '人员管理'
                }
            },
            {
                path: '/dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { title: '系统首页' }
            },
            {
                path: '/citymanage',
                component: () => import('../views/onemap/citymanage/citymanage.vue'),
                meta: { title: '城市经营' }
            },
            {
                path: '/review',
                component: () => import('../views/onemap/review/review.vue'),
                meta: { title: '合规审查' }
            },
            {
                path: '/area',
                component: () => import('../views/onemap/City.vue'),
                meta: { title: '行政区划' }
            },
            {
                path: '/onemapmenu',
                component: () => import('../views/basicconfig/onemapmenu/onemapmenu.vue'),
                meta: { title: '菜单管理' }
            },
            {
                path: '/onemapmenuauth',
                component: () => import('../views/basicconfig/onemapmenu/onemapmenuauth.vue'),
                meta: { title: '菜单权限列表' }
            },
            {
                path: '/menuchild',
                component: () => import('../views/basicconfig/onemapmenu/addsecondeList.vue'),
                meta: { title: '二级子菜单' }
            },
            {
                path: '/menusecondchild',
                component: () => import('../views/basicconfig/onemapmenu/addThridList .vue'),
                meta: { title: '三级子菜单' }
            },
            {
                path: '/systemmenu',
                component: () => import('../views/systemconfig/SystemMenuMange/SystemMenuMange.vue'),
                meta: { title: '系统菜单管理' }
            },
            {
                path: '/sonmenu',
                component: () => import('../views/systemconfig/SystemMenuMange/SonMenu.vue'),
                meta: {
                    title: '系统子菜单'
                }
            },
            {
                path: '/evaluation',
                component: () => import('../views/evaluation/evaluation.vue'),
                meta: { title: '分析评价' }
            },
            {
                path: '/topicmap',
                component: () => import('../views/onemap/topicmap/topicmap.vue'),
                meta: { title: '专题图' }
            },
            {
                path: '/404',
                component: () => import('../views/404.vue'),
                meta: { title: '404' }
            },
            {
                path: '/wiki',
                component: () => import('../views/onemap/Knowledge.vue'),
                meta: {
                    title: '知识库'
                }
            },
            {
                path: '/wiki_szxc',
                component: () => import('../views/onemap/Knowledge.vue'),
                meta: {
                    title: '知识库'
                }
            },
            {
                path: '/wikifile',
                component: () => import('../views/onemap/KnowledgeFile.vue'),
                meta: {
                    title: '知识库文件'
                }
            },
            {
                path: '/landanaly',
                component: () => import('../views/onemap/ProjectCheck.vue'),
                meta: {
                    title: '项目核查'
                }
            },
            {
                path: '/dictconfig',
                component: () => import('../views/basicconfig/dictconfig.vue'),
                meta: {
                    title: '系统字典配置'
                }
            },
            {
                path: '/dynamicmonitor',
                component: () => import('../views/monitor/DynamicMonitor.vue'),
                meta: {
                    title: '动态监测'
                }
            },
            {
                path: '/regularassess',
                component: () => import('../views/monitor/RegularAssess.vue'),
                meta: {
                    title: '定期评估'
                }
            },
            {
                path: '/assesslist',
                component: () => import('../views/monitor/AssessList.vue'),
                meta: {
                    title: '指标列表项'
                }
            },
            {
                path: '/test',
                component: () => import('../views/test.vue'),
                meta: {
                    title: '文件上传'
                }
            },
            {
                path: '/ledger',
                component: () => import('../views/onemap/ledger/ledger.vue'),
                meta: {
                    title: '统计台账'
                }
            },
            {
                path: '/ledgerChild',
                component: () => import('../views/onemap/ledger/ledgerChild.vue'),
                meta: {
                    title: '统计台账子菜单'
                }
            },
            {
                path: '/plan',
                component: () => import('../views/planreview/planresultsdatas.vue'),
                meta: {
                    title: '成果数据管理'
                }
            },
            {
                path: '/opinionlist',
                component: () => import('../views/pulicservice/Idea.vue'),
                meta: {
                    title: '意见征集'
                }
            },
            {
                path: '/wfjblist',
                component: () => import('../views/pulicservice/Illegal.vue'),
                meta: {
                    title: '违法举报'
                }
            },
            {
                path: '/gkgslist',
                component: () => import('../views/pulicservice/Publicity.vue'),
                meta: {
                    title: '公开公示'
                }
            },
            {
                path: '/setPublicityLayers',
                component: () => import('../views/pulicservice/PublicityLayers.vue'),
                meta: { title: '公开公示地图服务列表' }
            },
            {
                path: '/typelist',
                component: () => import('../views/pulicservice/Typelist.vue'),
                meta: {
                    title: '公众服务类型管理'
                }
            },
            {
                path: '/logmanage',
                component: () => import('../views/logmanage/logmanage.vue'),
                meta: {
                    title: '日志列表'
                }
            },
            {
                path: '/administrativeDivision',
                component: () => import('../views/fujianOverview/shfj/AdministrativeDivision'),
                meta: {
                    title: '山海福建-行政区划'
                }
            },
            {
                path: '/socialEconomics',
                component: () => import('../views/fujianOverview/shfj/SocialEconomics'),
                meta: {
                    title: '山海福建-社会经济'
                }
            },
            {
                path: '/peopleChange',
                component: () => import('../views/fujianOverview/shfj/PeopleChange'),
                meta: {
                    title: '山海福建-人口变迁'
                }
            },
            {
                path: '/natureDefense',
                component: () => import('../views/fujianOverview/zrxt/NatureDefense'),
                meta: {
                    title: '自然系统-自然保护'
                }
            },
            {
                path: '/farmResource',
                component: () => import('../views/fujianOverview/zrxt/FarmResource'),
                meta: {
                    title: '自然系统-农业资源'
                }
            },
            {
                path: '/mountainWater',
                component: () => import('../views/fujianOverview/zrxt/MountainWater'),
                meta: {
                    title: '自然系统-山水格局'
                }
            },
            {
                path: '/seaSpace',
                component: () => import('../views/fujianOverview/zrxt/SeaSpace'),
                meta: {
                    title: '自然系统-海洋空间'
                }
            },
            {
                path: '/industryPromote',
                component: () => import('../views/fujianOverview/kjhl/IndustryPromote'),
                meta: {
                    title: '空间活力-产业发展'
                }
            },
            {
                path: '/businessVitality',
                component: () => import('../views/fujianOverview/kjhl/BusinessVitality'),
                meta: {
                    title: '空间活力-商业活力'
                }
            },
            {
                path: '/touristAttractions',
                component: () => import('../views/fujianOverview/kjhl/TouristAttractions'),
                meta: {
                    title: '空间活力-旅游景点'
                }
            },

            {
                path: '/areaInnovation',
                component: () => import('../views/fujianOverview/kjcx/AreaInnovation'),
                meta: {
                    title: '科技创新-区域创新'
                }
            },
            {
                path: '/innovationIndex',
                component: () => import('../views/fujianOverview/kjcx/InnovationIndex'),
                meta: {
                    title: '科技创新-科研场所'
                }
            },
            {
                path: '/sciencePlace',
                component: () => import('../views/fujianOverview/kjcx/SciencePlace'),
                meta: {
                    title: '科技创新-创新指标'
                }
            },

            {
                path: '/housingRealEstate',
                component: () => import('../views/fujianOverview/csjs/HousingRealEstate'),
                meta: {
                    title: '城市建设-住房地产'
                }
            },
            {
                path: '/roadTraffic',
                component: () => import('../views/fujianOverview/csjs/RoadTraffic'),
                meta: {
                    title: '城市建设-道路交通'
                }
            },
            {
                path: '/publicServer',
                component: () => import('../views/fujianOverview/csjs/PublicServer'),
                meta: {
                    title: '城市建设-公共服务'
                }
            },
            {
                path: '/werb',
                component: () => import('../views/fujianOverview/csjs/WERB'),
                meta: {
                    title: '城市建设-水电气路桥'
                }
            },
            {
                path: '/historyCulture',
                component: () => import('../views/fujianOverview/csjs/HistoryCulture'),
                meta: {
                    title: '城市建设-历史文化'
                }
            },
            {
                path: '/systemUseDuration',
                component: () => import('../views/systemMonitor/UseDuration'),
                meta: {
                    title: '系统使用时长'
                }
            },
            {
                path: '/demographicPortraits',
                component: () => import('../views/figure/DemographicPortraits'),
                meta: {
                    title: '人口画像'
                }
            },
            {
                path: '/regionalEconomy',
                component: () => import('../views/figure/RegionalEconomy'),
                meta: {
                    title: '区域经济'
                }
            },
            {
                path: '/siteLayout',
                component: () => import('../views/figure/SiteLayout'),
                meta: {
                    title: '用地布局'
                }
            },
            {
                path: '/publicServiceFacilities',
                component: () => import('../views/figure/PublicServiceFacilities'),
                meta: {
                    title: '公服设施'
                }
            }

        ]
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/tokenlogin',
        component: () => import('../views/TokenLogin.vue'),
        meta: {
            title: '权限登录'
        }
    },
    {
        path: '*',
        redirect: '/404'
    }
]
const router = new Router({
    routes,
});
router.beforeEach((to, from, next) => {
    let hastoken = localStorage.getItem("token")
    if (hastoken) {
        if (to.path === '/login') {
            next({ path: '/home' })
        } else next()
    } else {
        next()
    }
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => err)
}
export default router

