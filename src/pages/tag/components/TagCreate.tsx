import { createTag } from '@/services/tag.api';
import type { BaseCreateModalProps } from '@/types/components';
import type { TagCreateParams, TagVo } from '@/types/tag';
import { handleHttpError } from '@/utils/http';
import { Form, Input, Modal } from 'antd';
import type React from 'react';
import { useState } from 'react';

export const TagCreate: React.FC<BaseCreateModalProps<TagVo>> = props => {
  const { onCreateSuccess, onClose, ...rest } = props;
  const [form] = Form.useForm<TagCreateParams>();
  const [saving, setSaving] = useState(false);
  const onCancel = () => {
    onClose.apply(null, []);
    form.resetFields();
  };
  const onFinish = async (values: TagCreateParams) => {
    // 实现创建逻辑
    setSaving(true);
    try {
      const resp = await createTag(values);
      form.resetFields();
      onCreateSuccess(resp.data);
    } catch (error) {
      handleHttpError(error);
    }
    setSaving(false);
  };

  return (
    <Modal
      title="Create Tag"
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
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
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
