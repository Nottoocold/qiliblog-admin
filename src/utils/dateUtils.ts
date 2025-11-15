import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

// 常用插件（根据项目需要可启用）
import relativeTime from 'dayjs/plugin/relativeTime';
// import duration from 'dayjs/plugin/duration';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import localizedFormat from 'dayjs/plugin/localizedFormat';
// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

// 启用插件（取消注释以下行来启用插件）
// 启用季度插件
dayjs.extend(quarterOfYear);
// 相对时间插件
dayjs.extend(relativeTime);
// dayjs.extend(duration);
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.extend(localizedFormat);
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

/**
 * 日期格式枚举
 */
export const DateFormat = {
  /** 年月日: YYYY-MM-DD */
  DATE: 'YYYY-MM-DD',
  /** 年月日时分秒: YYYY-MM-DD HH:mm:ss */
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  /** 年月日时分: YYYY-MM-DD HH:mm */
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  /** 时分秒: HH:mm:ss */
  TIME: 'HH:mm:ss',
  /** 时分: HH:mm */
  TIME_MINUTE: 'HH:mm',
  /** 年-月: YYYY-MM */
  YEAR_MONTH: 'YYYY-MM',
  /** 完整日期时间: YYYY-MM-DDTHH:mm:ss */
  ISO: 'YYYY-MM-DDTHH:mm:ss',
  /** 年月日中文格式: YYYY年MM月DD日 */
  DATE_CN: 'YYYY年MM月DD日',
  /** 年月日时分秒中文格式: YYYY年MM月DD日 HH时mm分ss秒 */
  DATETIME_CN: 'YYYY年MM月DD日 HH时mm分ss秒',
} as const;

// 类型别名
export type DateFormatType = (typeof DateFormat)[keyof typeof DateFormat];

/**
 * 获取当前日期时间
 * @param format 日期格式，默认为 YYYY-MM-DD HH:mm:ss
 * @returns 格式化后的日期时间字符串
 */
export const getCurrentDateTime = (
  format: DateFormatType | string = DateFormat.DATETIME
): string => {
  return dayjs().format(format);
};

/**
 * 获取当前日期
 * @param format 日期格式，默认为 YYYY-MM-DD
 * @returns 格式化后的日期字符串
 */
export const getCurrentDate = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().format(format);
};

/**
 * 格式化日期时间
 * @param date 日期时间（可以是 Dayjs 对象、Date 对象、ISO 字符串或时间戳）
 * @param format 日期格式
 * @returns 格式化后的日期时间字符串，如果日期无效则返回空字符串
 */
export const formatDateTime = (
  date: Dayjs | Date | string | number | null | undefined,
  format: DateFormatType | string = DateFormat.DATETIME
): string => {
  if (!date) return '';
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(format) : '';
};

/**
 * 格式化日期
 * @param date 日期
 * @param format 日期格式
 * @returns 格式化后的日期字符串，如果日期无效则返回空字符串
 */
export const formatDate = (
  date: Dayjs | Date | string | number | null | undefined,
  format: DateFormatType | string = DateFormat.DATE
): string => {
  if (!date) return '';
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(format) : '';
};

/**
 * 格式化时间（时分秒）
 * @param date 时间
 * @param format 时间格式
 * @returns 格式化后的时间字符串，如果日期无效则返回空字符串
 */
export const formatTime = (
  date: Dayjs | Date | string | number | null | undefined,
  format: DateFormatType | string = DateFormat.TIME
): string => {
  if (!date) return '';
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(format) : '';
};

/**
 * 日期时间字符串转 Dayjs 对象
 * @param date 日期时间字符串
 * @returns Dayjs 对象
 */
export const parseDateTime = (date: string | Date | number): Dayjs => {
  return dayjs(date);
};

/**
 * 判断日期是否有效
 * @param date 日期
 * @returns 是否有效
 */
export const isValidDate = (date: Dayjs | Date | string | number | null | undefined): boolean => {
  if (!date) return false;

  // 如果是 Dayjs 或 Date 对象，直接使用 isValid
  if (dayjs.isDayjs(date) || date instanceof Date) {
    return dayjs(date).isValid();
  }

  // 对于字符串，使用严格模式验证（防止 2024-02-30 这类无效日期被自动转换）
  if (typeof date === 'string') {
    // 先进行正则格式校验
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
    if (!dateTimeRegex.test(date)) {
      return false;
    }

    // 使用严格模式验证日期
    const parsed = dayjs(date);
    const formatted = parsed.format('YYYY-MM-DD');

    // 验证格式化后的日期是否与原始输入一致
    // 这样可以捕获 2024-02-30 -> 2024-03-01 这类情况
    const originalDatePart = date.split(' ')[0];
    return formatted === originalDatePart && parsed.isValid();
  }

  // 对于时间戳
  if (typeof date === 'number') {
    const parsed = dayjs(date);
    return parsed.isValid();
  }

  return false;
};

/**
 * 获取时间戳（毫秒）
 * @param date 日期，默认为当前时间
 * @returns 毫秒时间戳
 */
export const getTimestamp = (date?: Dayjs | Date | string | number): number => {
  return dayjs(date).valueOf();
};

/**
 * 获取秒级时间戳
 * @param date 日期，默认为当前时间
 * @returns 秒级时间戳
 */
export const getTimestampInSeconds = (date?: Dayjs | Date | string | number): number => {
  return dayjs(date).unix();
};

/**
 * 获取日期时间范围（开始和结束时间）
 * 常用于查询条件
 * @param date 日期
 * @returns 包含 startTime 和 endTime 的对象
 */
export const getDateTimeRange = (
  date: Dayjs | Date | string | number
): { startTime: string; endTime: string } => {
  const dayjsDate = dayjs(date);
  return {
    startTime: dayjsDate.startOf('day').format(DateFormat.DATETIME),
    endTime: dayjsDate.endOf('day').format(DateFormat.DATETIME),
  };
};

/**
 * 获取今天的开始和结束时间
 * @returns 包含 startTime 和 endTime 的对象
 */
export const getTodayRange = (): { startTime: string; endTime: string } => {
  return getDateTimeRange(dayjs());
};

/**
 * 获取昨天的日期
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getYesterday = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().subtract(1, 'day').format(format);
};

/**
 * 获取明天的日期
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getTomorrow = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().add(1, 'day').format(format);
};

/**
 * 获取本周的开始日期（周一）
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getWeekStart = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().startOf('week').add(1, 'day').format(format);
};

/**
 * 获取本周的结束日期（周日）
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getWeekEnd = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().endOf('week').add(1, 'day').format(format);
};

/**
 * 获取本月的第一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getMonthStart = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().startOf('month').format(format);
};

/**
 * 获取本月的最后一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getMonthEnd = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().endOf('month').format(format);
};

/**
 * 获取本季度的第一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getQuarterStart = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().startOf('quarter').format(format);
};

/**
 * 获取本季度的最后一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getQuarterEnd = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().endOf('quarter').format(format);
};

/**
 * 获取本年的第一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getYearStart = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().startOf('year').format(format);
};

/**
 * 获取本年的最后一天
 * @param format 日期格式
 * @returns 格式化后的日期字符串
 */
export const getYearEnd = (format: DateFormatType | string = DateFormat.DATE): string => {
  return dayjs().endOf('year').format(format);
};

/**
 * 获取两个日期之间的天数差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 天数差的绝对值
 */
export const getDaysDiff = (
  date1: Dayjs | Date | string | number,
  date2: Dayjs | Date | string | number
): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return Math.abs(d1.diff(d2, 'day'));
};

/**
 * 获取两个日期之间的小时数差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 小时数差的绝对值
 */
export const getHoursDiff = (
  date1: Dayjs | Date | string | number,
  date2: Dayjs | Date | string | number
): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return Math.abs(d1.diff(d2, 'hour'));
};

/**
 * 获取两个日期之间的分钟数差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 分钟数差的绝对值
 */
export const getMinutesDiff = (
  date1: Dayjs | Date | string | number,
  date2: Dayjs | Date | string | number
): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return Math.abs(d1.diff(d2, 'minute'));
};

/**
 * 添加天数
 * @param date 日期
 * @param days 天数（可以是负数）
 * @param format 返回格式
 * @returns 添加天数后的日期字符串
 */
export const addDays = (
  date: Dayjs | Date | string | number,
  days: number,
  format: DateFormatType | string = DateFormat.DATE
): string => {
  return dayjs(date).add(days, 'day').format(format);
};

/**
 * 添加月数
 * @param date 日期
 * @param months 月数（可以是负数）
 * @param format 返回格式
 * @returns 添加月数后的日期字符串
 */
export const addMonths = (
  date: Dayjs | Date | string | number,
  months: number,
  format: DateFormatType | string = DateFormat.DATE
): string => {
  return dayjs(date).add(months, 'month').format(format);
};

/**
 * 添加年数
 * @param date 日期
 * @param years 年数（可以是负数）
 * @param format 返回格式
 * @returns 添加年数后的日期字符串
 */
export const addYears = (
  date: Dayjs | Date | string | number,
  years: number,
  format: DateFormatType | string = DateFormat.DATE
): string => {
  return dayjs(date).add(years, 'year').format(format);
};

/**
 * 比较两个日期的先后顺序
 * @param date1 日期1
 * @param date2 日期2
 * @returns -1: date1 < date2, 0: date1 === date2, 1: date1 > date2
 */
export const compareDates = (
  date1: Dayjs | Date | string | number,
  date2: Dayjs | Date | string | number
): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  if (d1.isBefore(d2)) return -1;
  if (d1.isAfter(d2)) return 1;
  return 0;
};

/**
 * 判断日期是否在两个日期之间（包含边界）
 * @param date 要判断的日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 是否在范围内
 */
export const isBetween = (
  date: Dayjs | Date | string | number,
  startDate: Dayjs | Date | string | number,
  endDate: Dayjs | Date | string | number
): boolean => {
  const target = dayjs(date);
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // 手动判断是否在范围内（包含边界）
  return (
    (target.isSame(start) || target.isAfter(start)) && (target.isSame(end) || target.isBefore(end))
  );
};

/**
 * 判断是否为今天
 * @param date 日期
 * @returns 是否为今天
 */
export const isToday = (date: Dayjs | Date | string | number): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断是否为昨天
 * @param date 日期
 * @returns 是否为昨天
 */
export const isYesterday = (date: Dayjs | Date | string | number): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * 判断是否为明天
 * @param date 日期
 * @returns 是否为明天
 */
export const isTomorrow = (date: Dayjs | Date | string | number): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

/**
 * 转换为星期几（0-6，0 表示周日）
 * @param date 日期
 * @returns 星期几
 */
export const getDayOfWeek = (date: Dayjs | Date | string | number): number => {
  return dayjs(date).day();
};

/**
 * 获取月份的天数
 * @param date 日期
 * @returns 天数
 */
export const getDaysInMonth = (date: Dayjs | Date | string | number): number => {
  return dayjs(date).daysInMonth();
};

/**
 * 获取年龄
 * @param birthday 出生日期
 * @returns 年龄
 */
export const getAge = (birthday: Dayjs | Date | string | number): number => {
  return dayjs().diff(dayjs(birthday), 'year');
};

/**
 * 计算剩余天数（相对于今天）
 * @param targetDate 目标日期
 * @returns 剩余天数（负数表示已过期）
 */
export const getDaysLeft = (targetDate: Dayjs | Date | string | number): number => {
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');
  return target.diff(today, 'day');
};

/**
 * 获取相对时间描述（如：2 小时前、3 天后）
 * 需要先启用 relativeTime 插件
 * @param date 日期
 * @returns 相对时间描述
 */
export const getRelativeTime = (date: Dayjs | Date | string | number): string => {
  // 注意：需要启用 relativeTime 插件
  return dayjs(date).fromNow();
};

export default {
  getCurrentDateTime,
  getCurrentDate,
  formatDateTime,
  formatDate,
  formatTime,
  parseDateTime,
  isValidDate,
  getTimestamp,
  getTimestampInSeconds,
  getDateTimeRange,
  getTodayRange,
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
  getDaysDiff,
  getHoursDiff,
  getMinutesDiff,
  addDays,
  addMonths,
  addYears,
  compareDates,
  isBetween,
  isToday,
  isYesterday,
  isTomorrow,
  getDayOfWeek,
  getDaysInMonth,
  getAge,
  getDaysLeft,
  getRelativeTime,
};
