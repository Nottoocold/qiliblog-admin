import { getTag, updateTag } from '@/services/tag.api';
import type { BaseUpdateModalProps } from '@/types/components';
import type { TagUpdateParams, TagVo } from '@/types/tag';
import { handleHttpError } from '@/utils/http';
import { Form, Input, Modal } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

export const TagUpdate: React.FC<BaseUpdateModalProps<TagVo, TagVo>> = props => {
  const { editRecord, onUpdateSuccess, onClose, ...rest } = props;
  const [form] = Form.useForm<TagUpdateParams>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const onCancel = () => {
    onClose.apply(null, []);
    form.resetFields();
    setLoading(true);
  };
  const onOpen = useCallback(async () => {
    try {
      const resp = await getTag(editRecord.id);
      form.setFieldsValue(resp.data);
    } catch (error) {
      handleHttpError(error);
    }
    setLoading(false);
  }, [editRecord, form]);
  const onFinish = async (values: TagUpdateParams) => {
    // 实现更新逻辑
    setSaving(true);
    try {
      const resp = await updateTag(values);
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
      title="Update Tag"
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
