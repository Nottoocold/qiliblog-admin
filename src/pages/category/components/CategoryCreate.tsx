import type { BaseCreateModalProps } from '@/types/components';
import { handleHttpError } from '@/utils/http';
import { Form, Input, Modal } from 'antd';
import type React from 'react';
import { useState } from 'react';
import type { CategoryCreateParams, CategoryVo } from '@/types/category';
import { createCategory } from '@/services/category.api.ts';

export const CategoryCreate: React.FC<BaseCreateModalProps<CategoryVo>> = props => {
  const { onCreateSuccess, onClose, ...rest } = props;
  const [form] = Form.useForm<CategoryCreateParams>();
  const [saving, setSaving] = useState(false);
  const onCancel = () => {
    onClose.apply(null, []);
    form.resetFields();
  };
  const onFinish = async (values: CategoryCreateParams) => {
    // 实现创建逻辑
    setSaving(true);
    try {
      const resp = await createCategory(values);
      form.resetFields();
      onCreateSuccess(resp.data);
    } catch (error) {
      handleHttpError(error);
    }
    setSaving(false);
  };

  return (
    <Modal
      title="Create Category"
      {...rest}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText="取消"
      okText="创建"
      maskClosable={false}
      cancelButtonProps={{ disabled: saving }}
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
