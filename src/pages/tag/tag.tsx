import { deleteTag, getTagPage } from '@/services/tag.api';
import type { TagVo } from '@/types/tag';
import { handleHttpError } from '@/utils/http';
import { createAntdTableQuery } from '@/utils/queryUtils';
import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Popconfirm, Space, Table, type TableProps } from 'antd';
import React, { useMemo, useState } from 'react';
import { TagCreate } from './components/TagCreate';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { TagUpdate } from './components/TagUpdate';
import { SearchForm } from '@/components/SearchForm/SearchForm';

const Tag: React.FC = () => {
  const query = createAntdTableQuery(getTagPage, {
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
  const { type, changeType, submit, reset } = search;
  const [createOpen, setCreateOpen] = useState(false);
  const [updateState, setUpdateState] = useState<{ open: boolean; editRecord: TagVo | null }>({
    open: false,
    editRecord: null,
  });

  const onDelete = async (record: TagVo) => {
    return deleteTag(record.id)
      .then(() => {
        message.success(`标签${record.name}删除成功`);
        refresh();
      })
      .catch(handleHttpError);
  };

  const columns: TableProps<TagVo>['columns'] = [
    {
      title: '标签名称',
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
          title={`确定要删除标签${record.name}吗？`}
          cancelText="取消"
          okText="确定"
          onConfirm={() => onDelete(record)}
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  const searchConfig = useMemo(() => {
    return [
      {
        label: '关键词',
        name: 'word',
        content: <Input placeholder="name/slug" />,
      },
    ];
  }, []);

  return (
    <div>
      <SearchForm
        form={form}
        submit={submit}
        reset={reset}
        searchMode={type}
        changeSearchMode={changeType}
        fields={searchConfig}
      />
      <Space styles={{ item: { marginBottom: 16 } }}>
        <Button type="primary" onClick={() => setCreateOpen(true)}>
          <PlusOutlined />
          新增
        </Button>
      </Space>
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
      <TagCreate
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateSuccess={data => {
          setCreateOpen(false);
          message.success(`Tag${data.name}创建成功`);
          refresh();
        }}
      />
      <TagUpdate
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

export default Tag;
