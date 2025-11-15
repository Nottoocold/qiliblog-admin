import { useCallback } from 'react';
import type { FormInstance } from 'antd';
import { convertBooleanFieldsToNumber, convertNumberFieldsToBoolean } from '@/utils/typeConverter';

/**
 * 处理表单中数字(0/1)与布尔值转换的自定义Hook
 * 用于后端使用0/1，但前端表单组件（如Switch）需要布尔值的场景
 */

interface UseNumberBooleanFormReturn<T> {
  /**
   * 从后端数据加载到表单（number → boolean）
   */
  loadDataToForm: (data: Partial<T>, form: FormInstance) => void;

  /**
   * 从表单获取数据提交到后端（boolean → number）
   * @param values 表单值
   * @param fields 需要转换的字段名
   * @returns 转换后的值
   */
  getFormValuesForSubmit: (values: T, fields?: string[]) => T;

  /**
   * 设置表单初始值（将这些字段设置为0）
   */
  setInitialValues: (fields: string[]) => Record<string, number>;
}

/**
 * 创建处理数字/布尔值转换的表单Hook
 * @param convertFields 需要转换的字段名数组，如 ['top', 'recommend', 'allowComment']
 * @returns 包含转换方法的Hook
 */
export const createNumberBooleanFormHook = <T extends Record<string, any>>(
  convertFields: string[]
): (() => UseNumberBooleanFormReturn<T>) => {
  return () => {
    /**
     * 从后端数据加载到表单（将number转换为boolean）
     */
    const loadDataToForm = useCallback((data: Partial<T>, form: FormInstance) => {
      const convertedData = convertNumberFieldsToBoolean(data as T, convertFields);
      form.setFieldsValue(convertedData);
    }, []);

    /**
     * 从表单获取数据提交到后端（将boolean转换为number）
     */
    const getFormValuesForSubmit = useCallback((values: T, fields?: string[]): T => {
      const fieldsToConvert = fields || convertFields;
      return convertBooleanFieldsToNumber(values, fieldsToConvert);
    }, []);

    /**
     * 获取初始值（将这些字段设置为0）
     */
    const setInitialValues = useCallback((fields: string[]) => {
      return fields.reduce(
        (acc, field) => {
          acc[field] = 0;
          return acc;
        },
        {} as Record<string, number>
      );
    }, []);

    return {
      loadDataToForm,
      getFormValuesForSubmit,
      setInitialValues,
    };
  };
};

/**
 * 文章表单专用的Hook
 * 转换字段：top, recommend, allowComment
 */
export const useArticleNumberBooleanForm = createNumberBooleanFormHook<{
  top?: number;
  recommend?: number;
  allowComment?: number;
  publishAt?: string;
}>(['top', 'recommend', 'allowComment']);
