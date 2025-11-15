/**
 * dateUtils.ts 使用示例
 * 本文件展示了 dateUtils.ts 中所有函数的用法
 */

import {
  // 日期格式常量
  DateFormat,

  // 获取当前时间
  getCurrentDateTime,
  getCurrentDate,

  // 格式化函数
  formatDateTime,
  formatDate,
  formatTime,

  // 解析函数
  parseDateTime,

  // 验证函数
  isValidDate,

  // 时间戳转换
  getTimestamp,
  getTimestampInSeconds,

  // 日期范围
  getDateTimeRange,
  getTodayRange,

  // 日期计算（相对当前时间）
  getYesterday,
  getTomorrow,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
  getQuarterStart,
  getQuarterEnd,
  getYearStart,
  getYearEnd,

  // 日期差值计算
  getDaysDiff,
  getHoursDiff,
  getMinutesDiff,

  // 日期加减
  addDays,
  addMonths,
  addYears,

  // 日期比较
  compareDates,
  isBetween,

  // 特殊判断
  isToday,
  isYesterday,
  isTomorrow,

  // 其他工具
  getDayOfWeek,
  getDaysInMonth,
  getAge,
  getDaysLeft,
  getRelativeTime,
} from './dateUtils';
import dayjs from 'dayjs';

// ==================== 1. 日期格式常量 ====================
console.log('=== 日期格式常量 ===');
console.log('DATE:', DateFormat.DATE); // YYYY-MM-DD
console.log('DATETIME:', DateFormat.DATETIME); // YYYY-MM-DD HH:mm:ss
console.log('TIME:', DateFormat.TIME); // HH:mm:ss
console.log('YEAR_MONTH:', DateFormat.YEAR_MONTH); // YYYY-MM

// ==================== 2. 获取当前时间 ====================
console.log('\n=== 获取当前时间 ===');
console.log('当前日期时间:', getCurrentDateTime());
console.log('当前日期:', getCurrentDate());
console.log('自定义格式:', getCurrentDateTime(DateFormat.YEAR_MONTH));

// ==================== 3. 格式化日期 ====================
console.log('\n=== 格式化日期 ===');
// 格式化 Dayjs 对象
const dayjsDate = dayjs('2024-01-15 10:30:00');
console.log('Dayjs对象:', formatDateTime(dayjsDate));
console.log('Dayjs对象(仅日期):', formatDate(dayjsDate));

// 格式化 Date 对象
const jsDate = new Date('2024-01-15T10:30:00');
console.log('Date对象:', formatDateTime(jsDate));
console.log('Date对象(仅日期):', formatDate(jsDate));

// 格式化 ISO 字符串
console.log('ISO字符串:', formatDateTime('2024-01-15T10:30:00.000Z'));

// 格式化时间戳
const timestamp = new Date('2024-01-15').getTime();
console.log('时间戳:', formatDateTime(timestamp, DateFormat.DATE));

// 格式化时间部分
console.log('时间部分:', formatTime(dayjsDate)); // 10:30:00
console.log('时间部分(自定义):', formatTime(dayjsDate, DateFormat.TIME_MINUTE)); // 10:30

// 无效日期处理
console.log('无效日期:', formatDateTime('invalid-date')); // ''
console.log('空值:', formatDateTime(null)); // ''

// ==================== 4. 解析日期 ====================
console.log('\n=== 解析日期 ===');
const parsedFromString = parseDateTime('2024-01-15');
console.log('字符串转Dayjs:', parsedFromString.format('YYYY-MM-DD'));

const parsedFromDate = parseDateTime(new Date('2024-01-15'));
console.log('Date对象转Dayjs:', parsedFromDate.format('YYYY-MM-DD'));

// ==================== 5. 验证日期 ====================
console.log('\n=== 验证日期 ===');
console.log('有效日期(字符串):', isValidDate('2024-01-15')); // true
console.log('有效日期(Date):', isValidDate(new Date('2024-01-15'))); // true
console.log('无效日期:', isValidDate('2024-13-45')); // false
console.log('空值:', isValidDate(null)); // false

// ==================== 6. 时间戳转换 ====================
console.log('\n=== 时间戳转换 ===');
const testDate = dayjs('2024-01-15 12:30:45');
console.log('毫秒时间戳:', getTimestamp(testDate)); // 1705315845000
console.log('秒级时间戳:', getTimestampInSeconds(testDate)); // 1705315845
console.log('当前毫秒时间戳:', getTimestamp());

// ==================== 7. 日期范围 ====================
console.log('\n=== 日期范围 ===');
const range = getDateTimeRange('2024-01-15');
console.log('指定日期的范围:', range);
// { startTime: '2024-01-15 00:00:00', endTime: '2024-01-15 23:59:59' }

const todayRange = getTodayRange();
console.log('今天的范围:', todayRange);

// ==================== 8. 相对日期计算 ====================
console.log('\n=== 相对日期计算 ===');
console.log('昨天:', getYesterday());
console.log('明天:', getTomorrow());
console.log('本周开始(周一):', getWeekStart());
console.log('本周结束(周日):', getWeekEnd());
console.log('本月开始:', getMonthStart());
console.log('本月结束:', getMonthEnd());
console.log('本季度开始:', getQuarterStart());
console.log('本季度结束:', getQuarterEnd());
console.log('本年开始:', getYearStart());
console.log('本年结束:', getYearEnd());

// ==================== 9. 日期差值计算 ====================
console.log('\n=== 日期差值计算 ===');
console.log('天数差(绝对值):', getDaysDiff('2024-01-10', '2024-01-15')); // 5
console.log('小时数差:', getHoursDiff('2024-01-15 10:00:00', '2024-01-15 15:00:00')); // 5
console.log('分钟数差:', getMinutesDiff('2024-01-15 10:00:00', '2024-01-15 10:30:00')); // 30

// ==================== 10. 日期加减 ====================
console.log('\n=== 日期加减 ===');
console.log('添加5天:', addDays('2024-01-15', 5)); // 2024-01-20
console.log('减去5天:', addDays('2024-01-15', -5)); // 2024-01-10
console.log('添加2个月:', addMonths('2024-01-15', 2)); // 2024-03-15
console.log('添加1年:', addYears('2024-01-15', 1)); // 2025-01-15

// ==================== 11. 日期比较 ====================
console.log('\n=== 日期比较 ===');
console.log('date1 < date2:', compareDates('2024-01-10', '2024-01-15')); // -1
console.log('date1 > date2:', compareDates('2024-01-15', '2024-01-10')); // 1
console.log('date1 === date2:', compareDates('2024-01-15', '2024-01-15')); // 0

// 判断日期是否在范围内（包含边界）
console.log('是否在范围内:', isBetween('2024-01-15', '2024-01-10', '2024-01-20')); // true
console.log('是否等于开始:', isBetween('2024-01-10', '2024-01-10', '2024-01-20')); // true
console.log('是否等于结束:', isBetween('2024-01-20', '2024-01-10', '2024-01-20')); // true
console.log('是否在范围外:', isBetween('2024-01-05', '2024-01-10', '2024-01-20')); // false

// ==================== 12. 特殊日期判断 ====================
console.log('\n=== 特殊日期判断 ===');
const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const tomorrow = dayjs().add(1, 'day');

console.log('是否今天:', isToday(today)); // true
console.log('是否昨天:', isYesterday(yesterday)); // true
console.log('是否明天:', isTomorrow(tomorrow)); // true

// ==================== 13. 其他工具函数 ====================
console.log('\n=== 其他工具函数 ===');
console.log('星期几(0=周日):', getDayOfWeek('2024-01-15')); // 1 (周一)
console.log('月份天数:', getDaysInMonth('2024-02-01')); // 29 (2024是闰年)

// 计算年龄
const birthday = '1999-01-15';
console.log('年龄:', getAge(birthday));

// 计算剩余天数
const futureDate = dayjs().add(7, 'day');
console.log('剩余天数:', getDaysLeft(futureDate)); // 7
console.log('已过期天数:', getDaysLeft(dayjs().subtract(5, 'day'))); // -5

// 相对时间描述
console.log('相对时间(5天前):', getRelativeTime(dayjs().subtract(5, 'day')));
console.log('相对时间(3天后):', getRelativeTime(dayjs().add(3, 'day')));
console.log('相对时间(1小时前):', getRelativeTime(dayjs().subtract(1, 'hour')));

// ==================== 14. 实际应用场景示例 ====================
console.log('\n=== 实际应用场景 ===');

// 场景1：表单查询 - 获取今天的日期范围
const queryRange = getTodayRange();
console.log('查询今天的数据:', queryRange);
// 用于API请求: { startTime: '2024-01-15 00:00:00', endTime: '2024-01-15 23:59:59' }

// 场景2：显示友好日期
const postDate = dayjs().subtract(2, 'day');
console.log('文章发布时间:', getRelativeTime(postDate)); // "2 days ago"

// 场景3：计算会员剩余天数
const vipExpireDate = '2025-01-15';
console.log('VIP剩余天数:', getDaysLeft(vipExpireDate));

// 场景4：生日提醒
const userBirthday = '2024-06-15';
const daysUntilBirthday = getDaysLeft(userBirthday);
if (daysUntilBirthday === 0) {
  console.log('生日快乐！');
} else if (daysUntilBirthday > 0) {
  console.log(`距离生日还有 ${daysUntilBirthday} 天`);
}

// 场景5：年龄验证
const userAge = getAge('2005-01-15');
if (userAge >= 18) {
  console.log('已成年');
} else {
  console.log(`未成年，还需 ${18 - userAge} 年`);
}

// 场景6：周报表时间范围
const weekStart = getWeekStart();
const weekEnd = getWeekEnd();
console.log('本周报表时间范围:', `${weekStart} 至 ${weekEnd}`);

// 场景7：日期有效性校验
const invalidDate1 = '2024-02-30'; // 无效日期：2月没有30日
const invalidDate2 = '2024-04-31'; // 无效日期：4月没有31日
const invalidDate3 = '2024-13-01'; // 无效日期：没有13月
const validDate = '2024-02-29'; // 有效日期：2024是闰年

console.log(`'${invalidDate1}' 是否有效:`, isValidDate(invalidDate1)); // false
console.log(`'${invalidDate2}' 是否有效:`, isValidDate(invalidDate2)); // false
console.log(`'${invalidDate3}' 是否有效:`, isValidDate(invalidDate3)); // false
console.log(`'789' 是否有效:`, isValidDate(789)); // false
console.log(`'${validDate}' 是否有效:`, isValidDate(validDate)); // true

export default {};
