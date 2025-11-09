import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Space, type FormInstance } from 'antd';
import React, { useMemo } from 'react';

interface FormFieldConfig {
  name: string;
  label: string;
  enabled?: boolean;
  content: React.ReactNode;
}

interface SearchFormProps {
  form: FormInstance;
  submit: () => void;
  reset: () => void;
  searchMode: 'simple' | 'advance';
  changeSearchMode: () => void;
  fields: FormFieldConfig[];
}

export const SearchForm: React.FC<SearchFormProps> = ({
  form,
  submit,
  reset,
  searchMode,
  changeSearchMode,
  fields,
}) => {
  const expand = useMemo(() => searchMode === 'advance', [searchMode]);
  const realFields = fields.filter(field => field.enabled !== false);
  // 每个表单元素占的栅栏宽度
  const span = 6;
  // 每行的表单元素数量
  const cols = 24 / span;
  // 共有多少行
  const rows = Math.ceil(realFields.length / cols);

  return (
    <Form form={form}>
      <Row gutter={24}>
        {expand
          ? realFields.map(field => (
              <Col span={span} key={field.name}>
                <Form.Item label={field.label} name={field.name}>
                  {field.content}
                </Form.Item>
              </Col>
            ))
          : realFields.slice(0, cols).map(field => (
              <Col span={span} key={field.name}>
                <Form.Item label={field.label} name={field.name}>
                  {field.content}
                </Form.Item>
              </Col>
            ))}
        {rows == 1 && realFields.length < cols ? (
          <>
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              重置
            </Button>
          </>
        ) : null}
      </Row>
      {rows >= 1 && realFields.length >= cols ? (
        <div style={{ textAlign: 'right' }}>
          <Space size="small">
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
            <Button onClick={reset}>重置</Button>
            {rows > 1 ? (
              <a style={{ fontSize: 12 }} onClick={changeSearchMode}>
                <DownOutlined rotate={expand ? 180 : 0} /> {expand ? '收起' : '展开'}
              </a>
            ) : null}
          </Space>
        </div>
      ) : null}
    </Form>
  );
};
