# dateUtils.ts 使用说明

## 简介

`dateUtils.ts` 是一个基于 `dayjs` 封装的日期工具库，提供了丰富的日期时间处理函数。

## 安装依赖

```bash
npm install dayjs
# 或
pnpm add dayjs
```

## 导入函数

```typescript
import {
  getCurrentDateTime,
  formatDate,
  // ... 其他函数
} from './dateUtils';
```

## 函数列表

### 1. 获取当前时间

#### `getCurrentDateTime(format?)`
获取当前日期时间

```typescript
getCurrentDateTime()                    // '2024-01-15 14:30:25'
getCurrentDateTime(DateFormat.DATE)     // '2024-01-15'
```

#### `getCurrentDate(format?)`
获取当前日期

```typescript
getCurrentDate()                        // '2024-01-15'
getCurrentDate(DateFormat.YEAR_MONTH)   // '2024-01'
```

### 2. 格式化函数

#### `formatDateTime(date, format?)`
格式化日期时间

```typescript
formatDateTime(dayjs('2024-01-15 10:30:00'))              // '2024-01-15 10:30:00'
formatDateTime(new Date('2024-01-15'))                    // '2024-01-15 00:00:00'
formatDateTime('2024-01-15T10:30:00.000Z', DateFormat.DATE) // '2024-01-15'
formatDateTime(1705315845000, DateFormat.TIME)            // '转换为对应时间'
formatDateTime(null)                                      // ''
```

#### `formatDate(date, format?)`
格式化日期（仅日期部分）

```typescript
formatDate(dayjs('2024-01-15 10:30:00'))   // '2024-01-15'
formatDate('2024-01-15')                   // '2024-01-15'
```

#### `formatTime(date, format?)`
格式化时间（仅时间部分）

```typescript
formatTime(dayjs('2024-01-15 10:30:25'))   // '10:30:25'
formatTime(dayjs('2024-01-15 10:30:25'), DateFormat.TIME_MINUTE)  // '10:30'
```

### 3. 解析函数

#### `parseDateTime(date)`
将日期字符串转为 Dayjs 对象

```typescript
parseDateTime('2024-01-15')              // Dayjs对象
parseDateTime(new Date('2024-01-15'))    // Dayjs对象
```

### 4. 验证函数

#### `isValidDate(date)`
判断日期是否有效

```typescript
isValidDate('2024-01-15')        // true
isValidDate('2024-13-45')        // false
isValidDate(null)                // false
```

### 5. 时间戳转换

#### `getTimestamp(date?)`
获取毫秒时间戳

```typescript
getTimestamp(dayjs('2024-01-15'))   // 1705276800000
getTimestamp()                       // 当前时间的毫秒时间戳
```

#### `getTimestampInSeconds(date?)`
获取秒级时间戳

```typescript
getTimestampInSeconds(dayjs('2024-01-15'))  // 1705276800
```

### 6. 日期范围

#### `getDateTimeRange(date)`
获取指定日期的开始和结束时间

```typescript
getDateTimeRange('2024-01-15')
// { startTime: '2024-01-15 00:00:00', endTime: '2024-01-15 23:59:59' }
```

#### `getTodayRange()`
获取今天的开始和结束时间

```typescript
getTodayRange()
// { startTime: '2024-01-15 00:00:00', endTime: '2024-01-15 23:59:59' }
```

### 7. 相对日期计算

#### `getYesterday(format?)`
获取昨天日期

```typescript
getYesterday()                    // '2024-01-14'
getYesterday(DateFormat.DATE_CN)  // '2024年01月14日'
```

#### `getTomorrow(format?)`
获取明天日期

```typescript
getTomorrow()    // '2024-01-16'
```

#### `getWeekStart(format?)`
获取本周开始日期（周一）

```typescript
getWeekStart()   // '2024-01-15' (假设今天是周一)
```

#### `getWeekEnd(format?)`
获取本周结束日期（周日）

```typescript
getWeekEnd()   // '2024-01-21'
```

#### `getMonthStart(format?)`
获取本月第一天

```typescript
getMonthStart()   // '2024-01-01'
```

#### `getMonthEnd(format?)`
获取本月最后一天

```typescript
getMonthEnd()   // '2024-01-31'
```

#### `getQuarterStart(format?)`
获取本季度第一天

```typescript
getQuarterStart()   // '2024-01-01' (Q1)
```

#### `getQuarterEnd(format?)`
获取本季度最后一天

```typescript
getQuarterEnd()   // '2024-03-31' (Q1)
```

#### `getYearStart(format?)`
获取本年开始日期

```typescript
getYearStart()   // '2024-01-01'
```

#### `getYearEnd(format?)`
获取本年结束日期

```typescript
getYearEnd()   // '2024-12-31'
```

### 8. 日期差值计算

#### `getDaysDiff(date1, date2)`
获取两个日期之间的天数差（绝对值）

```typescript
getDaysDiff('2024-01-10', '2024-01-15')  // 5
getDaysDiff('2024-01-15', '2024-01-10')  // 5 (绝对值)
```

#### `getHoursDiff(date1, date2)`
获取两个日期之间的小时数差（绝对值）

```typescript
getHoursDiff('2024-01-15 10:00:00', '2024-01-15 15:00:00')  // 5
```

#### `getMinutesDiff(date1, date2)`
获取两个日期之间的分钟数差（绝对值）

```typescript
getMinutesDiff('2024-01-15 10:00:00', '2024-01-15 10:30:00')  // 30
```

### 9. 日期加减

#### `addDays(date, days, format?)`
添加/减去天数

```typescript
addDays('2024-01-15', 5)     // '2024-01-20'
addDays('2024-01-15', -5)    // '2024-01-10'
```

#### `addMonths(date, months, format?)`
添加/减去月数

```typescript
addMonths('2024-01-15', 2)   // '2024-03-15'
addMonths('2024-01-15', -1)  // '2023-12-15'
```

#### `addYears(date, years, format?)`
添加/减去年数

```typescript
addYears('2024-01-15', 1)    // '2025-01-15'
```

### 10. 日期比较

#### `compareDates(date1, date2)`
比较两个日期的先后顺序

```typescript
compareDates('2024-01-10', '2024-01-15')  // -1 (date1 < date2)
compareDates('2024-01-15', '2024-01-10')  // 1  (date1 > date2)
compareDates('2024-01-15', '2024-01-15')  // 0  (date1 === date2)
```

#### `isBetween(date, startDate, endDate)`
判断日期是否在范围内（包含边界）

```typescript
isBetween('2024-01-15', '2024-01-10', '2024-01-20')  // true
isBetween('2024-01-10', '2024-01-10', '2024-01-20')  // true (等于开始)
isBetween('2024-01-20', '2024-01-10', '2024-01-20')  // true (等于结束)
isBetween('2024-01-05', '2024-01-10', '2024-01-20')  // false
```

### 11. 特殊日期判断

#### `isToday(date)`
判断是否为今天

```typescript
isToday(dayjs())                          // true
isToday(dayjs().subtract(1, 'day'))       // false
```

#### `isYesterday(date)`
判断是否为昨天

```typescript
isYesterday(dayjs().subtract(1, 'day'))   // true
```

#### `isTomorrow(date)`
判断是否为明天

```typescript
isTomorrow(dayjs().add(1, 'day'))         // true
```

### 12. 其他工具函数

#### `getDayOfWeek(date)`
获取星期几（0-6，0 表示周日）

```typescript
getDayOfWeek('2024-01-15')  // 1 (周一)
```

#### `getDaysInMonth(date)`
获取月份的天数

```typescript
getDaysInMonth('2024-01-01')  // 31
getDaysInMonth('2024-02-01')  // 29 (闰年)
```

#### `getAge(birthday)`
根据出生日期计算年龄

```typescript
getAge('1999-01-15')  // 25 (假设当前是2024年)
```

#### `getDaysLeft(targetDate)`
计算剩余天数（相对于今天，负数表示已过期）

```typescript
getDaysLeft(dayjs().add(7, 'day'))       // 7
getDaysLeft(dayjs().subtract(5, 'day'))  // -5
```

#### `getRelativeTime(date)`
获取相对时间描述（依赖于 relativeTime 插件）

```typescript
getRelativeTime(dayjs().subtract(5, 'day'))   // "5 days ago"
getRelativeTime(dayjs().add(3, 'day'))        // "in 3 days"
getRelativeTime(dayjs().subtract(1, 'hour'))  // "an hour ago"
```

## 日期格式常量

```typescript
DateFormat.DATE                    // 'YYYY-MM-DD'
DateFormat.DATETIME                // 'YYYY-MM-DD HH:mm:ss'
DateFormat.DATETIME_MINUTE         // 'YYYY-MM-DD HH:mm'
DateFormat.TIME                    // 'HH:mm:ss'
DateFormat.TIME_MINUTE             // 'HH:mm'
DateFormat.YEAR_MONTH              // 'YYYY-MM'
DateFormat.ISO                     // 'YYYY-MM-DDTHH:mm:ss'
DateFormat.DATE_CN                 // 'YYYY年MM月DD日'
DateFormat.DATETIME_CN             // 'YYYY年MM月DD日 HH时mm分ss秒'
```

## 实际应用场景

### 场景 1：表单查询 - 查询今天的数据

```typescript
import { getTodayRange } from './dateUtils';

const queryTodayData = async () => {
  const { startTime, endTime } = getTodayRange();

  const response = await fetch(api, {
    params: {
      startTime,
      endTime,
    },
  });
};
```

### 场景 2：显示友好日期

```typescript
import { getRelativeTime } from './dateUtils';

const PostItem = ({ post }) => {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>发布时间: {getRelativeTime(post.createdAt)}</p>
      {/* 显示: "2 days ago", "3 hours ago" 等 */}
    </div>
  );
};
```

### 场景 3：会员到期提醒

```typescript
import { getDaysLeft, formatDate } from './dateUtils';

const checkVipStatus = (expireDate: string) => {
  const daysLeft = getDaysLeft(expireDate);

  if (daysLeft < 0) {
    return '会员已过期';
  } else if (daysLeft <= 7) {
    return `会员即将到期，还有 ${daysLeft} 天`;
  } else {
    return `会员有效期至: ${formatDate(expireDate)}`;
  }
};
```

### 场景 4：生日提醒

```typescript
import { isToday, getDaysLeft } from './dateUtils';

const checkBirthday = (birthday: string) => {
  // 假设生日是今年的日期
  const thisYearBirthday = `2024-${birthday.split('-')[1]}-${birthday.split('-')[2]}`;
  const daysUntilBirthday = getDaysLeft(thisYearBirthday);

  if (daysUntilBirthday === 0) {
    console.log('🎂 生日快乐！');
  } else if (daysUntilBirthday > 0) {
    console.log(`距离生日还有 ${daysUntilBirthday} 天`);
  } else {
    // 今年的生日已过，计算到明年生日的天数
    const nextYearBirthday = `2025-${birthday.split('-')[1]}-${birthday.split('-')[2]}`;
    const daysToNext = getDaysLeft(nextYearBirthday);
    console.log(`距离下一个生日还有 ${daysToNext} 天`);
  }
};
```

### 场景 5：年龄验证

```typescript
import { getAge } from './dateUtils';

const validateAge = (birthday: string) => {
  const age = getAge(birthday);

  if (age >= 18) {
    return { valid: true, message: '已成年' };
  } else {
    return {
      valid: false,
      message: `未成年，还需 ${18 - age} 年`,
    };
  }
};
```

### 场景 6：周报表时间范围

```typescript
import { getWeekStart, getWeekEnd } from './dateUtils';

const generateWeeklyReport = () => {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  console.log(`本周报表时间范围: ${weekStart} 至 ${weekEnd}`);

  const response = await fetch('/api/report', {
    params: {
      startDate: weekStart,
      endDate: weekEnd,
    },
  });
};
```

### 场景 7：日期有效性校验

```typescript
import { isValidDate, formatDate } from './dateUtils';

const validateUserInput = (dateString: string) => {
  if (!isValidDate(dateString)) {
    return '请输入有效的日期';
  }

  return formatDate(dateString); // 格式化为标准格式
};
```

## 注意事项

1. **日期格式**：所有函数默认支持 Dayjs 对象、Date 对象、ISO 字符串和时间戳
2. **无效日期处理**：格式化函数对无效日期返回空字符串 `''`
3. **相对时间插件**：使用 `getRelativeTime` 前确保已启用 `relativeTime` 插件（默认已启用）
4. **边界包含**：`isBetween` 函数包含边界值（闭区间）
5. **星期计算**：`getWeekStart` 和 `getWeekEnd` 以周一为一周开始

## 扩展插件

如需使用更多 dayjs 插件，可在 `dateUtils.ts` 中取消对应插件的注释：

```typescript
// 启用 UTC
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// 启用时区
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

// 启用本地化格式
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
```
