import { handleHttpError } from '@/utils/http';
import { createAntdTableQuery } from '@/utils/queryUtils';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useAntdTable, useCreation } from 'ahooks';
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Tag,
  Select,
  DatePicker,
  Card,
  Typography,
  Dropdown,
  type MenuProps,
  Row,
  Col,
  Empty,
  Spin,
  Divider,
  Pagination,
} from 'antd';
import React from 'react';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { SearchForm } from '@/components/SearchForm/SearchForm';
import {
  deletePost,
  getPostPage,
  publishPost,
  unpublishPost,
  copyPost,
  batchDeletePosts,
} from '@/services/post.api';
import type { PostVo } from '@/types/post';
import { ArticleStatus } from '@/types/post.d';
import { getCategoryList } from '@/services/category.api';
import { getTagList } from '@/services/tag.api';
import type { CategoryVo } from '@/types/category';
import type { TagVo } from '@/types/tag';
import { useNavigate } from 'react-router-dom';
import { getEndOfDay, getRelativeTime, getStartOfDay } from '@/utils/dateUtils';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Paragraph, Title } = Typography;

const Post: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [categories, setCategories] = React.useState<CategoryVo[]>([]);
  const [tags, setTags] = React.useState<TagVo[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);
  const [loadingTags, setLoadingTags] = React.useState(false);

  const query = useCreation(() => {
    return createAntdTableQuery(getPostPage, {
      sortEntry: [{ name: 'createTime', order: 'desc' }],
      beforeRequest(params) {
        // 处理时间范围查询
        const { dateRange, ...rest } = params;
        if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
          return {
            ...rest,
            dateRange: [getStartOfDay(dateRange[0]), getEndOfDay(dateRange[1])],
          };
        }
        return params;
      },
    });
  }, []);

  const [form] = Form.useForm();
  const { message: antdMessage, modal } = useAntd();
  const { run, params, tableProps, search, refresh } = useAntdTable(query, {
    form,
    defaultParams: [
      { current: 1, pageSize: 4 },
      { word: '', status: undefined, categoryId: undefined, tagId: undefined, dateRange: [] },
    ],
    defaultType: 'simple',
    debounceWait: 300,
    refreshOnWindowFocus: true,
    onError(e) {
      handleHttpError(e);
    },
  });
  const { type, changeType, submit, reset } = search;

  // 加载分类列表
  React.useEffect(() => {
    setLoadingCategories(true);
    getCategoryList()
      .then(resp => {
        setCategories(resp.data);
      })
      .catch(handleHttpError)
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  // 加载标签列表
  React.useEffect(() => {
    setLoadingTags(true);
    getTagList()
      .then(resp => {
        setTags(resp.data);
      })
      .catch(handleHttpError)
      .finally(() => {
        setLoadingTags(false);
      });
  }, []);

  // 状态标签映射
  const statusTagMap: Record<number, { color: string; text: string }> = {
    [ArticleStatus.DRAFT]: { color: 'default', text: '草稿' },
    [ArticleStatus.PUBLISHED]: { color: 'success', text: '已发布' },
    [ArticleStatus.PRIVATE]: { color: 'warning', text: '私密' },
  };

  // 删除文章
  const onDelete = async (record: PostVo) => {
    return deletePost(record.id)
      .then(() => {
        antdMessage.success(`文章"${record.title}"删除成功`);
        refresh();
      })
      .catch(handleHttpError);
  };

  // 发布文章
  const onPublish = async (record: PostVo) => {
    return publishPost(record.id)
      .then(() => {
        antdMessage.success(`文章"${record.title}"发布成功`);
        refresh();
      })
      .catch(handleHttpError);
  };

  // 取消发布文章
  const onUnpublish = async (record: PostVo) => {
    return unpublishPost(record.id)
      .then(() => {
        antdMessage.success(`文章"${record.title}"已取消发布`);
        refresh();
      })
      .catch(handleHttpError);
  };

  // 复制文章
  const onCopy = async (record: PostVo) => {
    return copyPost(record.id)
      .then(() => {
        antdMessage.success(`文章"${record.title}"复制成功`);
        refresh();
      })
      .catch(handleHttpError);
  };

  // 批量删除
  const onBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      antdMessage.warning('请选择要删除的文章');
      return;
    }
    return batchDeletePosts(selectedRowKeys as string[])
      .then(() => {
        antdMessage.success(`成功删除 ${selectedRowKeys.length} 篇文章`);
        setSelectedRowKeys([]);
        refresh();
      })
      .catch(handleHttpError);
  };

  // 搜索表单配置
  const searchConfig = useCreation(() => {
    return [
      {
        label: '关键词',
        name: 'word',
        content: <Input placeholder="搜索标题或内容" prefix={<SearchOutlined />} />,
      },
      {
        label: '状态',
        name: 'status',
        content: (
          <Select placeholder="请选择状态" allowClear>
            <Option value={ArticleStatus.DRAFT}>草稿</Option>
            <Option value={ArticleStatus.PUBLISHED}>已发布</Option>
            <Option value={ArticleStatus.PRIVATE}>私密</Option>
          </Select>
        ),
      },
      {
        label: '分类',
        name: 'categoryId',
        content: (
          <Select
            placeholder="请选择分类"
            allowClear
            loading={loadingCategories}
            showSearch
            optionFilterProp="children"
          >
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        label: '标签',
        name: 'tagId',
        content: (
          <Select
            placeholder="请选择标签"
            allowClear
            loading={loadingTags}
            showSearch
            optionFilterProp="children"
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        label: '发布时间',
        name: 'dateRange',
        content: <RangePicker placeholder={['开始时间', '结束时间']} />,
      },
    ];
  }, [categories, tags, loadingCategories, loadingTags]);

  // 处理时间范围查询
  const handleSearch = () => {
    const values = form.getFieldsValue();
    if (values.dateRange && values.dateRange.length === 2) {
      //values.dateRange = [formatDateTime(values.dateRange[0]), formatDateTime(values.dateRange[1])];
    }
    submit();
  };

  // 获取操作菜单
  const getActionMenu = (record: PostVo): MenuProps['items'] => {
    return [
      {
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />,
        onClick: () => navigate(`/post/${record.id}/edit`),
      },
      {
        key: 'copy',
        label: '复制',
        icon: <CopyOutlined />,
        onClick: () => onCopy(record),
      },
      {
        type: 'divider',
      },
      ...(record.status === ArticleStatus.DRAFT
        ? [
            {
              key: 'publish',
              label: '发布',
              icon: <CheckCircleOutlined />,
              onClick: () => onPublish(record),
            },
          ]
        : record.status === ArticleStatus.PUBLISHED
          ? [
              {
                key: 'unpublish',
                label: '取消发布',
                icon: <CloseCircleOutlined />,
                onClick: () => onUnpublish(record),
              },
            ]
          : []),
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          modal.confirm({
            title: '确认删除',
            content: `确定要删除文章"${record.title}"吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              await onDelete(record);
            },
          });
        },
      },
    ];
  };

  const posts = tableProps.dataSource || [];
  const loading = tableProps.loading || false;
  const pagination = tableProps.pagination;
  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          文章管理
        </Title>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`确定要删除选中的 ${selectedRowKeys.length} 篇文章吗？`}
              onConfirm={onBatchDelete}
            >
              <Button danger icon={<DeleteOutlined />}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/post/new')}>
            新建文章
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <SearchForm
          form={form}
          submit={handleSearch}
          reset={() => {
            form.resetFields();
            reset();
            setSelectedRowKeys([]);
          }}
          searchMode={type}
          changeSearchMode={changeType}
          fields={searchConfig}
        />
      </Card>

      <Spin spinning={loading}>
        {posts.length === 0 ? (
          <Empty description="暂无文章" />
        ) : (
          <Row gutter={[16, 16]}>
            {posts.map((post: PostVo) => {
              const statusTag = statusTagMap[post.status];
              return (
                <Col key={post.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    cover={
                      post.coverImage ? (
                        <img
                          alt={post.title}
                          src={post.coverImage}
                          style={{ height: 200, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 200,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 48,
                          }}
                        >
                          {post.title.charAt(0)}
                        </div>
                      )
                    }
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/post/${post.id}/edit`)}
                      >
                        编辑
                      </Button>,
                      <Dropdown menu={{ items: getActionMenu(post) }} trigger={['click']}>
                        <Button type="link">更多</Button>
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ margin: 0, flex: 1, cursor: 'pointer' }}
                            onClick={() => navigate(`/post/${post.id}/edit`)}
                          >
                            {post.title}
                          </Paragraph>
                          <Tag color={statusTag.color} style={{ marginLeft: 8, flexShrink: 0 }}>
                            {statusTag.text}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          {post.summary ? (
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 8, color: '#666' }}
                            >
                              {post.summary}
                            </Paragraph>
                          ) : (
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 8, color: '#999' }}
                            >
                              暂无摘要
                            </Paragraph>
                          )}
                          <Divider style={{ margin: '8px 0' }} />
                          <Space size="small">
                            <Tag color="blue">{post.category.name}</Tag>
                            {post.tagList && post.tagList.length > 0
                              ? post.tagList
                                  .slice(0, 3)
                                  .map((tag, index) => <Tag key={index}>{tag.name}</Tag>)
                              : null}
                            {post.tagList && post.tagList.length > 3 && (
                              <Tag>+{post.tagList.length - 3}</Tag>
                            )}
                          </Space>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                            <Space split={<span>·</span>}>
                              <span>
                                <EyeOutlined /> {post.viewCount}
                              </span>
                              {post.authorName && <span>{post.authorName}</span>}
                              {post.status === 1 ? (
                                <span>{getRelativeTime(post.publishedTime)} published</span>
                              ) : null}
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Spin>

      {pagination && pagination.total > 0 && (
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showTotal={(total, range) =>
              range[0] === range[1]
                ? `第 ${range[0]}} 条，共 ${total} 条`
                : `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={(page, pageSize) => {
              run({ current: page, pageSize }, params[1]!);
            }}
          />
        </div>
      )}
    </>
  );
};

export default Post;
