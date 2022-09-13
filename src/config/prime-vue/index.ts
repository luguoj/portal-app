import PrimeVue from "primevue/config";
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './custom.scss'
import {App} from "@vue/runtime-core";
import {FilterMatchMode} from "primevue/api";

export function applyPrimeVue(app: App): void {
    app.use(PrimeVue, {
        locale: {
            startsWith: '开头',
            contains: '包含',
            notContains: '不包含',
            endsWith: '结尾',
            equals: '等于',
            notEquals: '不等于',
            noFilter: '不过滤',
            lt: '小于',
            lte: '小于等于',
            gt: '大于',
            gte: '大于等于',
            dateIs: '等于',
            dateIsNot: '不等于',
            dateBefore: '之前',
            dateAfter: '之后',
            clear: '清除',
            apply: '应用',
            matchAll: '满足所有',
            matchAny: '满足任意',
            addRule: '添加规则',
            removeRule: '删除规则',
            accept: '确认',
            reject: '拒绝',
            choose: '选择',
            upload: '上传',
            cancel: '取消',
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
            today: '今天',
            weekHeader: '周',
            firstDayOfWeek: 0,
            dateFormat: 'mm/dd/yy',
            weak: '星期',
            medium: 'Medium',
            strong: 'Strong',
            passwordPrompt: '输入密码',
            emptyFilterMessage: '没有找到结果',
            emptyMessage: '没有有效选项'
        },
        filterMatchModeOptions: {
            string: [
                FilterMatchMode.STARTS_WITH,
                FilterMatchMode.CONTAINS,
                FilterMatchMode.NOT_CONTAINS,
                FilterMatchMode.ENDS_WITH,
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS
            ],
            text: [
                FilterMatchMode.STARTS_WITH,
                FilterMatchMode.CONTAINS,
                FilterMatchMode.NOT_CONTAINS,
                FilterMatchMode.ENDS_WITH,
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS
            ],
            number: [
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS,
                FilterMatchMode.LESS_THAN,
                FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
                FilterMatchMode.GREATER_THAN,
                FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
            ],
            numeric: [
                FilterMatchMode.EQUALS,
                FilterMatchMode.NOT_EQUALS,
                FilterMatchMode.LESS_THAN,
                FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
                FilterMatchMode.GREATER_THAN,
                FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
            ],
            date: [
                FilterMatchMode.DATE_IS,
                FilterMatchMode.DATE_IS_NOT,
                FilterMatchMode.DATE_BEFORE,
                FilterMatchMode.DATE_AFTER
            ]
        }
    })
}