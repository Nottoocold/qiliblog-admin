import { handleHttpError } from '@/utils/http';
import {
  Form,
  Input,
  Select,
  Upload,
  Switch,
  DatePicker,
  Row,
  Col,
  Divider,
  Space,
  Button,
  Card,
} from 'antd';
import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { PostUpdateParams, PostVo } from '@/types/post';
import { ArticleStatus } from '@/types/post.d';
import {
  getPost,
  updatePost,
  publishPost as publishPostApi,
  unpublishPost as unpublishPostApi,
} from '@/services/post.api';
import { getCategoryList } from '@/services/category.api';
import { getTagList } from '@/services/tag.api';
import type { CategoryVo } from '@/types/category';
import type { TagVo } from '@/types/tag';
import {
  UploadOutlined,
  SaveOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { convertBooleanFieldsToNumber } from '@/utils/typeConverter';
// 添加 Markdown 编辑器导入
import MDEditor from '@uiw/react-md-editor';

const { TextArea } = Input;

const PostEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { message: antdMessage } = useAntd();
  const [form] = Form.useForm<PostUpdateParams>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryVo[]>([]);
  const [tags, setTags] = useState<TagVo[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [post, setPost] = useState<PostVo | null>(null);

  const cateroryOptions = categories.map(category => ({
    label: category.name,
    value: category.id,
  }));
  const tagOptions = tags.map(tag => ({ label: tag.name, value: tag.id }));

  // 加载分类列表
  useEffect(() => {
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
  useEffect(() => {
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

  // 加载文章详情
  const loadPost = useCallback(async () => {
    if (!id) {
      antdMessage.error('文章ID不存在');
      navigate('/post');
      return;
    }
    setLoading(true);
    try {
      const resp = await getPost(id);
      const postData = resp.data;
      setPost(postData);

      // 设置表单值
      form.setFieldsValue({
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        summary: postData.summary,
        categoryId: postData.categoryId,
        tagIds: postData.tagIds,
        status: postData.status,
        top: postData.top,
        recommend: postData.recommend,
        allowComment: postData.allowComment,
        publishAt: postData.publishAt
          ? dayjs(postData.publishAt).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        coverImage: postData.coverImage,
      });

      // 设置封面图片
      if (postData.coverImage) {
        setFileList([
          {
            uid: '-1',
            name: 'cover-image',
            status: 'done',
            url: postData.coverImage,
          },
        ]);
      } else {
        setFileList([]);
      }
    } catch (error) {
      handleHttpError(error);
      navigate('/post');
    }
    setLoading(false);
  }, [id, form, navigate, antdMessage]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const onFinish = async (values: PostUpdateParams, publish: boolean = false) => {
    setSaving(true);
    try {
      // 将Switch组件的boolean值转换为number(0/1)
      const submitValues = convertBooleanFieldsToNumber(values, [
        'top',
        'recommend',
        'allowComment',
      ]);

      // 处理封面图片
      if (fileList.length > 0) {
        if (fileList[0].response) {
          submitValues.coverImage = fileList[0].response.url;
        } else if (fileList[0].url) {
          submitValues.coverImage = fileList[0].url;
        }
      } else {
        submitValues.coverImage = undefined;
      }

      // 处理定时发布时间
      if (submitValues.publishAt) {
        submitValues.publishAt = dayjs(submitValues.publishAt).format('YYYY-MM-DD HH:mm:ss');
      }

      await updatePost(submitValues);

      // 如果需要发布或取消发布，调用相应的API
      if (publish && values.status === ArticleStatus.DRAFT) {
        await publishPostApi(values.id);
        antdMessage.success(`文章"${values.title}"发布成功`);
      } else if (!publish && post?.status === ArticleStatus.PUBLISHED) {
        await unpublishPostApi(values.id);
        antdMessage.success(`文章"${values.title}"已取消发布`);
      } else {
        antdMessage.success(`文章"${values.title}"更新成功`);
      }

      navigate('/post');
    } catch (error) {
      handleHttpError(error);
    }
    setSaving(false);
  };

  // 保存
  const handleSave = () => {
    form.submit();
  };

  // 发布/取消发布
  const handlePublish = () => {
    form.validateFields().then(values => {
      const isPublished = post?.status === ArticleStatus.PUBLISHED;
      values.status = isPublished ? ArticleStatus.DRAFT : ArticleStatus.PUBLISHED;
      onFinish(values, !isPublished);
    });
  };

  // 根据标题自动生成 slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const currentSlug = form.getFieldValue('slug');
    // 只有在 slug 为空或者是自动生成的情况下才更新
    if (!currentSlug || currentSlug === post?.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setFieldsValue({ slug });
    }
  };

  // 上传配置
  const uploadProps = {
    name: 'file',
    listType: 'picture' as const,
    fileList,
    onChange: (info: { fileList: UploadFile[] }) => {
      setFileList(info.fileList);
    },
    beforeUpload: () => {
      return false; // 阻止自动上传，由后端处理
    },
  };

  return (
    <>
      <Card
        title={post ? `编辑文章: ${post.title}` : '编辑文章'}
        loading={loading}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/post')}>
              返回
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              保存
            </Button>
            {post && (
              <Button
                type={post.status === ArticleStatus.PUBLISHED ? 'default' : 'primary'}
                icon={post.status === ArticleStatus.PUBLISHED ? <EyeOutlined /> : <SendOutlined />}
                onClick={handlePublish}
                loading={saving}
              >
                {post.status === ArticleStatus.PUBLISHED ? '取消发布' : '发布文章'}
              </Button>
            )}
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={values => onFinish(values, false)}
          initialValues={{
            status: ArticleStatus.DRAFT,
            top: false,
            recommend: false,
            allowComment: true,
          }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="文章标题"
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" onChange={handleTitleChange} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="URL友好标识符 (Slug)"
                name="slug"
                tooltip="如果不填写，将根据标题自动生成"
              >
                <Input placeholder="自动生成" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="文章内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* 替换 TextArea 为 Markdown 编辑器 */}
            <MDEditor height={400} />
          </Form.Item>

          <Form.Item label="文章摘要" name="summary">
            <TextArea
              placeholder="请输入文章摘要（如果不填写，将自动从内容中提取）"
              rows={3}
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="分类" name="categoryId">
                <Select
                  placeholder="请选择分类"
                  allowClear
                  loading={loadingCategories}
                  showSearch
                  options={cateroryOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="标签" name="tagIds">
                <Select
                  mode="multiple"
                  placeholder="请选择标签（可多选）"
                  allowClear
                  loading={loadingTags}
                  showSearch
                  options={tagOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="封面图片" name="coverImage">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传封面</Button>
            </Upload>
          </Form.Item>

          <Divider orientation="left">发布设置</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="定时发布" name="publishAt">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择发布时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item name="top" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Switch checkedChildren="置顶" unCheckedChildren="不置顶" />
                </Form.Item>
                <Form.Item name="recommend" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Switch checkedChildren="推荐" unCheckedChildren="不推荐" />
                </Form.Item>
                <Form.Item name="allowComment" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Switch checkedChildren="允许评论" unCheckedChildren="禁止评论" />
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default PostEdit;
