import { getTagPage } from '@/services/tag.api';
import type { TagVo } from '@/types/tag';
import { handleHttpError } from '@/utils/http';
import { createAntdTableQuery } from '@/utils/queryUtils';
import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, Row, Table, type TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';

const Tag: React.FC = () => {
  const query = createAntdTableQuery(getTagPage, { sortEntry: [{ name: 'id', order: 'desc' }] });
  const [form] = useForm();
  const { tableProps, search } = useAntdTable(query, {
    form,
    defaultParams: [{ current: 1, pageSize: 10 }, { word: '' }],
    onError(e) {
      handleHttpError(e);
    },
  });
  const { submit, reset } = search;

  const columns: TableProps<TagVo>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'URL友好标识符',
      dataIndex: 'slug',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ];

  const searchForm = (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label="关键词" name="word">
            <Input placeholder="name/slug" />
          </Form.Item>
        </Col>
        <Button type="primary" onClick={submit}>
          Search
        </Button>
        <Button onClick={reset} style={{ marginLeft: 16 }}>
          Reset
        </Button>
      </Row>
    </Form>
  );

  return (
    <div>
      {searchForm}
      <Table rowKey="id" columns={columns} {...tableProps} />
    </div>
  );
};

export default Tag;
