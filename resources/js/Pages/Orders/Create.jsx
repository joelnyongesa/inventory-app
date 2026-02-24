import { useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Form, Input, Button, Typography, Card,
    Select, InputNumber, Space, Row, Col,
    Divider, Alert,
} from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Create({ products }) {
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    const productOptions = useMemo(
        () => products.map((p) => ({
            value: p.id,
            label: `${p.name}  —  $${Number(p.price).toFixed(2)}`,
        })),
        [products],
    );

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        phone:         '',
        items:         [],
    });

    const addItem = () =>
        setData('items', [...data.items, { product_id: null, quantity: 1 }]);

    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        setData('items', updated);
    };

    const removeItem = (index) =>
        setData('items', data.items.filter((_, i) => i !== index));

    const orderTotal = data.items.reduce((sum, item) => {
        const p = item.product_id ? productMap[item.product_id] : null;
        return sum + (p ? Number(p.price) * (item.quantity || 0) : 0);
    }, 0);

    const onSubmit = () => post(route('orders.store'));

    return (
        <AppLayout
            header={
                <Space align="center">
                    <Link href={route('orders.index')}>
                        <Button icon={<ArrowLeftOutlined />} type="text" />
                    </Link>
                    <Title level={4} style={{ margin: 0 }}>New Order</Title>
                </Space>
            }
        >
            <Head title="New Order" />

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <Card
                        title="Customer"
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Form layout="vertical" size="large">
                            <Form.Item
                                label="Customer Name"
                                validateStatus={errors.customer_name ? 'error' : ''}
                                help={errors.customer_name}
                                required
                            >
                                <Input
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Jane Doe"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                validateStatus={errors.phone ? 'error' : ''}
                                help={errors.phone}
                                required
                            >
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+254 712 345 678"
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card
                        title="Order Items"
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        extra={
                            <Button
                                icon={<PlusOutlined />}
                                onClick={addItem}
                                type="dashed"
                                size="small"
                            >
                                Add Item
                            </Button>
                        }
                    >
                        {errors.items && (
                            <Alert
                                description={errors.items}
                                type="error"
                                showIcon
                                style={{ marginBottom: 12 }}
                            />
                        )}

                        {data.items.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa' }}>
                                No items yet — click "Add Item" to begin.
                            </div>
                        ) : (
                            data.items.map((item, idx) => {
                                const product   = item.product_id ? productMap[item.product_id] : null;
                                const lineTotal = product
                                    ? Number(product.price) * (item.quantity || 0)
                                    : 0;

                                return (
                                    <Row
                                        key={idx}
                                        gutter={[8, 8]}
                                        align="middle"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Col xs={24} sm={12}>
                                            <Select
                                                value={item.product_id}
                                                onChange={(v) => updateItem(idx, 'product_id', v)}
                                                placeholder="Select product…"
                                                style={{ width: '100%' }}
                                                showSearch
                                                optionFilterProp="label"
                                                optionLabelProp="label"
                                                status={errors[`items.${idx}.product_id`] ? 'error' : ''}
                                                options={productOptions}
                                            />
                                        </Col>

                                        <Col xs={8} sm={5}>
                                            <InputNumber
                                                value={item.quantity}
                                                onChange={(v) => updateItem(idx, 'quantity', v)}
                                                min={1}
                                                style={{ width: '100%' }}
                                                placeholder="Qty"
                                                status={errors[`items.${idx}.quantity`] ? 'error' : ''}
                                            />
                                        </Col>

                                        <Col xs={10} sm={5}>
                                            <Text style={{ color: '#3C6E71', fontWeight: 600 }}>
                                                ${lineTotal.toFixed(2)}
                                            </Text>
                                        </Col>

                                        <Col xs={6} sm={2}>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                danger
                                                size="small"
                                                onClick={() => removeItem(idx)}
                                            />
                                        </Col>
                                    </Row>
                                );
                            })
                        )}

                        {data.items.length > 0 && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Row justify="end">
                                    <Text strong style={{ fontSize: 16 }}>
                                        Order Total:{' '}
                                        <span style={{ color: '#3C6E71' }}>
                                            ${orderTotal.toFixed(2)}
                                        </span>
                                    </Text>
                                </Row>
                            </>
                        )}

                        <Divider />

                        <Row justify="end">
                            <Space>
                                <Link href={route('orders.index')}>
                                    <Button>Cancel</Button>
                                </Link>
                                <Button
                                    type="primary"
                                    onClick={onSubmit}
                                    loading={processing}
                                    disabled={data.items.length === 0}
                                >
                                    Create Order
                                </Button>
                            </Space>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}
