const moment = require('moment');
const time = {
  yesterday: moment().subtract(1, 'days').format('YYYY-MM-D'), // 昨天
  monthday: moment().add(30, 'days').format('YYYY-MM-D'), // 三十天后
  today: moment().format('YYYY-MM-D'), // 今天
  weekStart: moment().startOf('week').format('YYYY-MM-D'),//周一日期
  weekEnd: moment().endOf('week').format('YYYY-MM-D'), //周日日期
  monthEnd: moment().endOf('month').format('YYYY-MM-D'), // 月末时间
  monthStart: moment().startOf('month').format('YYYY-MM-D'), // 月初时间
  yearEnd: moment().endOf('year').format('YYYY-MM-D'), // 年尾时间
  yearStart: moment().startOf('year').format('YYYY-MM-D'), // 年始时间
}

export  default time;
