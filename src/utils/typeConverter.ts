/**
 * 布尔值与数字(0/1)相互转换工具
 * 解决后端使用0/1表示布尔值，前端组件需要布尔值的问题
 */

/**
 * 将数字(0/1)转换为布尔值
 * @param value - 数字或undefined
 * @returns 布尔值，默认为false
 * @example
 * numberToBoolean(1) // true
 * numberToBoolean(0) // false
 * numberToBoolean(undefined) // false
 */
export const numberToBoolean = (value: number | undefined): boolean => {
  return value === 1;
};

/**
 * 将布尔值转换为数字(0/1)
 * @param value - 布尔值或undefined
 * @returns 数字，默认为0
 * @example
 * booleanToNumber(true) // 1
 * booleanToNumber(false) // 0
 * booleanToNumber(undefined) // 0
 */
export const booleanToNumber = (value: boolean | undefined): number => {
  return value === true ? 1 : 0;
};

/**
 * 将字符串转换为数字(0/1)
 * @param value - '0'、'1'或其他字符串
 * @returns 数字，默认为0
 * @example
 * stringToNumber('1') // 1
 * stringToNumber('0') // 0
 * stringToNumber('true') // 0
 */
export const stringToNumber = (value: string | undefined): number => {
  return value === '1' ? 1 : 0;
};

/**
 * 将数字(0/1)转换为字符串
 * @param value - 数字或undefined
 * @returns '0'或'1'，默认为'0'
 * @example
 * numberToString(1) // '1'
 * numberToString(0) // '0'
 * numberToString(undefined) // '0'
 */
export const numberToString = (value: number | undefined): string => {
  return value === 1 ? '1' : '0';
};

/**
 * 批量转换对象中的数字字段为布尔值
 * @param obj - 要转换的对象
 * @param fields - 需要转换的字段名数组
 * @returns 转换后的新对象
 * @example
 * const data = { top: 1, recommend: 0, allowComment: 1 };
 * convertNumberFieldsToBoolean(data, ['top', 'recommend', 'allowComment']);
 * // { top: true, recommend: false, allowComment: true }
 */
export const convertNumberFieldsToBoolean = <T extends Record<string, unknown>>(
  obj: T,
  fields: string[]
): T => {
  const result = { ...obj };
  fields.forEach(field => {
    if (field in result) {
      result[field as keyof T] = numberToBoolean(result[field] as number | undefined) as T[keyof T];
    }
  });
  return result;
};

/**
 * 批量转换对象中的布尔字段为数字
 * @param obj - 要转换的对象
 * @param fields - 需要转换的字段名数组
 * @returns 转换后的新对象
 * @example
 * const data = { top: true, recommend: false, allowComment: true };
 * convertBooleanFieldsToNumber(data, ['top', 'recommend', 'allowComment']);
 * // { top: 1, recommend: 0, allowComment: 1 }
 */
export const convertBooleanFieldsToNumber = <T extends Record<string, unknown>>(
  obj: T,
  fields: string[]
): T => {
  const result = { ...obj };
  fields.forEach(field => {
    if (field in result) {
      result[field as keyof T] = booleanToNumber(
        result[field] as boolean | undefined
      ) as T[keyof T];
    }
  });
  return result;
};
