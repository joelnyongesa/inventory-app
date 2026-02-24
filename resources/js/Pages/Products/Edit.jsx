import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Form, Input, InputNumber, Switch, Button,
    Typography, Card, Space, Row, Col,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Edit({ product }) {
    const { data, setData, patch, processing, errors } = useForm({
        name:          product.name,
        sku:           product.sku,
        price:         Number(product.price),
        stock_count:   product.stock_count,
        reorder_level: product.reorder_level,
        is_active:     !!product.is_active,
    });

    const onFinish = () => patch(route('products.update', product.id));

    return (
        <AppLayout
            header={
                <Space align="center">
                    <Link href={route('products.index')}>
                        <Button icon={<ArrowLeftOutlined />} type="text" />
                    </Link>
                    <Title level={4} style={{ margin: 0 }}>Edit Product</Title>
                </Space>
            }
        >
            <Head title="Edit Product" />

            <Row justify="center">
                <Col xs={24} sm={22} md={16} lg={12}>
                    <Card
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Form layout="vertical" onFinish={onFinish} size="large">
                            <Form.Item
                                label="Product Name"
                                validateStatus={errors.name ? 'error' : ''}
                                help={errors.name}
                                required
                            >
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Wireless Mouse"
                                />
                            </Form.Item>

                            <Form.Item
                                label="SKU"
                                validateStatus={errors.sku ? 'error' : ''}
                                help={errors.sku}
                                required
                            >
                                <Input
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                    style={{ fontFamily: 'monospace' }}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label="Price ($)"
                                        validateStatus={errors.price ? 'error' : ''}
                                        help={errors.price}
                                        required
                                    >
                                        <InputNumber
                                            value={data.price}
                                            onChange={(v) => setData('price', v)}
                                            min={0}
                                            precision={2}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Form.Item
                                        label="Stock Count"
                                        validateStatus={errors.stock_count ? 'error' : ''}
                                        help={errors.stock_count}
                                        required
                                    >
                                        <InputNumber
                                            value={data.stock_count}
                                            onChange={(v) => setData('stock_count', v ?? 0)}
                                            min={0}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Form.Item
                                        label="Reorder Level"
                                        validateStatus={errors.reorder_level ? 'error' : ''}
                                        help={errors.reorder_level}
                                        required
                                    >
                                        <InputNumber
                                            value={data.reorder_level}
                                            onChange={(v) => setData('reorder_level', v ?? 0)}
                                            min={0}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Active">
                                <Switch
                                    checked={data.is_active}
                                    onChange={(v) => setData('is_active', v)}
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Space>
                                    <Link href={route('products.index')}>
                                        <Button>Cancel</Button>
                                    </Link>
                                    <Button type="primary" htmlType="submit" loading={processing}>
                                        Save Changes
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}
