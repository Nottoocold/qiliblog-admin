import { handleHttpError } from '@/utils/http';
import { createAntdTableQuery } from '@/utils/queryUtils';
import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, Popconfirm, Row, Space, Table, type TableProps } from 'antd';
import React, { useState } from 'react';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { deleteCategory, getCategoryPage } from '@/services/category.api.ts';
import type { CategoryVo } from '@/types/category';
import { CategoryCreate } from '@/pages/category/components/CategoryCreate.tsx';
import { CategoryUpdate } from '@/pages/category/components/CategoryUpdate.tsx';

export const Category: React.FC = () => {
  const query = createAntdTableQuery(getCategoryPage, {
    sortEntry: [
      { name: 'postCount', order: 'desc' },
      { name: 'createTime', order: 'desc' },
    ],
  });
  const [form] = Form.useForm();
  const { message } = useAntd();
  const { tableProps, search, refresh } = useAntdTable(query, {
    form,
    defaultParams: [{ current: 1, pageSize: 10 }, { word: '' }],
    onError(e) {
      handleHttpError(e);
    },
  });
  const { submit, reset } = search;
  const [createOpen, setCreateOpen] = useState(false);
  const [updateState, setUpdateState] = useState<{ open: boolean; editRecord: CategoryVo | null }>({
    open: false,
    editRecord: null,
  });

  const onDelete = async (record: CategoryVo) => {
    return deleteCategory(record.id)
      .then(() => {
        message.success(`分类${record.name}删除成功`);
        refresh();
      })
      .catch(handleHttpError);
  };

  const columns: TableProps<CategoryVo>['columns'] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" onClick={() => setUpdateState({ open: true, editRecord: record })}>
          {text}
        </Button>
      ),
    },
    {
      title: 'URL友好标识符',
      dataIndex: 'slug',
    },
    {
      title: '文章数量',
      dataIndex: 'postCount',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => (
        <Popconfirm
          title={`确定要删除分类${record.name}吗？`}
          cancelText="取消"
          okText="确定"
          onConfirm={() => onDelete(record)}
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
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
          搜索
        </Button>
        <Button onClick={reset} style={{ marginLeft: 16 }}>
          重置
        </Button>
      </Row>
      <Space styles={{ item: { marginBottom: 16 } }}>
        <Button type="primary" onClick={() => setCreateOpen(true)}>
          <PlusOutlined />
          新增
        </Button>
      </Space>
    </Form>
  );

  return (
    <div>
      {searchForm}
      <Table
        rowKey="id"
        columns={columns}
        size="middle"
        {...tableProps}
        pagination={{
          size: 'small',
          showTotal(total, range) {
            return range[0] == range[1]
              ? `共 ${total} 条`
              : `第${range[0]}-${range[1]}条 共 ${total} 条`;
          },
        }}
      />
      <CategoryCreate
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateSuccess={data => {
          setCreateOpen(false);
          message.success(`Tag${data.name}创建成功`);
          refresh();
        }}
      />
      <CategoryUpdate
        open={updateState.open}
        editRecord={updateState.editRecord!}
        onClose={() => setUpdateState({ open: false, editRecord: null })}
        onUpdateSuccess={data => {
          setUpdateState({ open: false, editRecord: null });
          message.success(`Tag${data.name}更新成功`);
          refresh();
        }}
      />
    </div>
  );
};

export default Category;
