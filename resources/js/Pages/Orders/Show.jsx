import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Typography, Card, Descriptions, Tag, Table,
    Button, Select, Space, Flex, Divider, Row, Col,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const STATUS_COLORS = {
    pending:   'orange',
    confirmed: 'blue',
    fulfilled: 'green',
    cancelled: 'red',
};

const STATUSES = ['pending', 'confirmed', 'fulfilled', 'cancelled'];

export default function Show({ order }) {
    const handleStatusChange = (status) => {
        router.patch(route('orders.update', order.id), { status }, { preserveScroll: true });
    };

    const itemColumns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, r) => (
                <Flex vertical gap={0}>
                    <span style={{ fontWeight: 500 }}>{r.product?.name}</span>
                    <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>
                        {r.product?.sku}
                    </span>
                </Flex>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            key: 'unit_price',
            render: (v) => `$${Number(v).toFixed(2)}`,
            responsive: ['sm'],
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Line Total',
            dataIndex: 'line_total',
            key: 'line_total',
            render: (v) => (
                <Text strong style={{ color: '#3C6E71' }}>${Number(v).toFixed(2)}</Text>
            ),
        },
    ];

    return (
        <AppLayout
            header={
                <Space align="center" wrap>
                    <Link href={route('orders.index')}>
                        <Button icon={<ArrowLeftOutlined />} type="text" />
                    </Link>
                    <Title level={4} style={{ margin: 0 }}>Order #{order.id}</Title>
                    <Tag color={STATUS_COLORS[order.status]}>{order.status?.toUpperCase()}</Tag>
                </Space>
            }
        >
            <Head title={`Order #${order.id}`} />

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={9}>
                    <Card
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Descriptions column={1} size="small" labelStyle={{ color: '#888' }}>
                            <Descriptions.Item label="Customer">
                                {order.customer_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone">
                                {order.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created by">
                                {order.user?.name ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Date">
                                {new Date(order.created_at).toLocaleString()}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider style={{ margin: '12px 0' }} />

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 6 }}>
                                Update Status
                            </Text>
                            <Select
                                value={order.status}
                                onChange={handleStatusChange}
                                style={{ width: '100%' }}
                                disabled={order.status === 'cancelled'}
                                options={STATUSES.map((s) => ({
                                    value: s,
                                    label: s.charAt(0).toUpperCase() + s.slice(1),
                                }))}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={15}>
                    <Card
                        title="Items"
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Table
                            dataSource={order.items}
                            columns={itemColumns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 380 }}
                        />

                        <Divider style={{ margin: '12px 0' }} />

                        <Row justify="end">
                            <Text strong style={{ fontSize: 16 }}>
                                Total:{' '}
                                <span style={{ color: '#3C6E71' }}>
                                    ${Number(order.total).toFixed(2)}
                                </span>
                            </Text>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </AppLayout>
    );
}
