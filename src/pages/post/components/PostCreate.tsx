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
import { useState, useEffect } from 'react';
import type { PostCreateParams } from '@/types/post';
import { ArticleStatus } from '@/types/post.d';
import { createAndPublishPost, createDraftPost } from '@/services/post.api';
import { getCategoryList } from '@/services/category.api';
import { getTagList } from '@/services/tag.api';
import type { CategoryVo } from '@/types/category';
import type { TagVo } from '@/types/tag';
import { UploadOutlined, SaveOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { convertBooleanFieldsToNumber } from '@/utils/typeConverter';

const { TextArea } = Input;

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const { message: antdMessage } = useAntd();
  const [form] = Form.useForm<PostCreateParams>();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryVo[]>([]);
  const [tags, setTags] = useState<TagVo[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const onFinish = async (values: PostCreateParams, publish: boolean = false) => {
    console.log('onFinish', values, publish);
    setSaving(true);
    try {
      // 处理封面图片
      if (fileList.length > 0 && fileList[0].response) {
        values.coverImage = fileList[0].response.url;
      } else if (fileList.length > 0 && fileList[0].url) {
        values.coverImage = fileList[0].url;
      }

      // 处理定时发布时间
      if (values.publishAt) {
        values.publishAt = dayjs(values.publishAt).format('YYYY-MM-DD HH:mm:ss');
      }

      // 设置发布状态
      values.status = publish ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT;

      // 将Switch组件的boolean值转换为number(0/1)
      const submitValues = convertBooleanFieldsToNumber(values, [
        'top',
        'recommend',
        'allowComment',
      ]);

      // 设置默认值（如果字段未提供）
      if (submitValues.top === undefined) {
        submitValues.top = 0;
      }
      if (submitValues.recommend === undefined) {
        submitValues.recommend = 0;
      }
      if (submitValues.allowComment === undefined) {
        submitValues.allowComment = 1;
      }
      console.log('submit values', submitValues);

      const resp = publish
        ? await createAndPublishPost(submitValues)
        : await createDraftPost(submitValues);
      await new Promise(resolve => setTimeout(resolve, 300)); // 延迟以显示成功消息
      antdMessage.success(`文章"${resp.data.title}"${publish ? '发布' : '保存'}成功`);
      navigate('/post');
    } catch (error) {
      handleHttpError(error);
    }
    setSaving(false);
  };

  // 保存草稿
  const handleSaveDraft = () => {
    form.submit();
  };

  // 发布文章
  const handlePublish = () => {
    form.validateFields().then(values => {
      onFinish(values, true);
    });
  };

  // 根据标题自动生成 slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setFieldsValue({ slug });
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
        title="新建文章"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/post')}>
              返回
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSaveDraft} loading={saving}>
              保存草稿
            </Button>
            <Button type="primary" icon={<SendOutlined />} onClick={handlePublish} loading={saving}>
              发布文章
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={values => onFinish(values, false)}
          initialValues={{
            status: ArticleStatus.DRAFT,
            top: 0,
            recommend: 0,
            allowComment: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="文章标题"
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" onChange={handleTitleChange} />
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
            <TextArea
              placeholder="请输入文章内容（支持 Markdown 格式）"
              rows={20}
              showCount
              maxLength={50000}
            />
          </Form.Item>

          <Form.Item label="文章摘要" name="summary">
            <TextArea
              placeholder="请输入文章摘要（如果不填写，将自动从内容中提取）"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="分类" name="categoryId">
                <Select
                  options={cateroryOptions}
                  placeholder="请选择分类"
                  allowClear
                  loading={loadingCategories}
                  showSearch
                  optionFilterProp="children"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="标签" name="tagIds">
                <Select
                  mode="multiple"
                  options={tagOptions}
                  placeholder="请选择标签（可多选）"
                  allowClear
                  loading={loadingTags}
                  showSearch
                  optionFilterProp="children"
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

export default PostCreate;
