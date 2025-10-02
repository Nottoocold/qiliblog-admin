import type { BaseUpdateModalProps } from '@/types/components';
import { handleHttpError } from '@/utils/http';
import { Form, Input, Modal } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { CategoryUpdateParams, CategoryVo } from '@/types/category';
import { getCategory, updateCategory } from '@/services/category.api.ts';

export const CategoryUpdate: React.FC<BaseUpdateModalProps<CategoryVo, CategoryVo>> = props => {
  const { editRecord, onUpdateSuccess, onClose, ...rest } = props;
  const [form] = Form.useForm<CategoryUpdateParams>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const onCancel = () => {
    onClose.apply(null, []);
    form.resetFields();
    setLoading(true);
  };
  const onOpen = useCallback(async () => {
    try {
      const resp = await getCategory(editRecord.id);
      form.setFieldsValue(resp.data);
    } catch (error) {
      handleHttpError(error);
    }
    setLoading(false);
  }, [editRecord, form]);
  const onFinish = async (values: CategoryUpdateParams) => {
    // 实现更新逻辑
    setSaving(true);
    try {
      const resp = await updateCategory(values);
      form.resetFields();
      onUpdateSuccess(resp.data);
    } catch (error) {
      handleHttpError(error);
    }
    setSaving(false);
  };

  useEffect(() => {
    if (rest.open && editRecord?.id) {
      onOpen();
    }
  }, [rest.open, editRecord, onOpen]);

  return (
    <Modal
      title="Update Category"
      {...rest}
      loading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText="取消"
      okText="更新"
      maskClosable={false}
      cancelButtonProps={{ disabled: saving }}
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="ID" name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="分类名称"
          name="name"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
        <Form.Item
          label="URL友好标识符"
          name="slug"
          rules={[{ required: true, message: '请输入URL友好标识符' }]}
        >
          <Input placeholder="请输入URL友好标识符" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
