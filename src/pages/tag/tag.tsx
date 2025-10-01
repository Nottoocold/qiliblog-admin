import { getTagPage } from '@/services/tag.api';
import type { TagVo } from '@/types/tag';
import { handleHttpError } from '@/utils/http';
import { useAntdTable } from 'ahooks';
import { Skeleton, Table, type TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';

const query = async (pageParams: { current: number; pageSize: number }, formData: object) => {
  const params = { ...pageParams, ...formData };
  const resp = await getTagPage(params);
  return {
    total: resp.data.total,
    list: resp.data.list,
  };
};
const Tag: React.FC = () => {
  const [form] = useForm();
  const { loading, tableProps } = useAntdTable(query, {
    defaultCurrent: 1,
    defaultPageSize: 10,
    loadingDelay: 300,
    form,
    onError(e) {
      handleHttpError(e);
    },
  });

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

  return (
    <Skeleton active loading={loading}>
      <Table rowKey="id" columns={columns} {...tableProps} />
    </Skeleton>
  );
};

export default Tag;
