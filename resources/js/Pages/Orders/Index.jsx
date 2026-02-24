import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Table, Button, Input, Tag, Space, Popconfirm,
    Typography, Row, Col, Tabs, Tooltip, Skeleton,
} from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import usePageLoading from '@/hooks/usePageLoading';

const { Title } = Typography;

function OrdersSkeleton() {
    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Row gutter={[12, 12]} style={{ marginBottom: 8 }} align="middle">
                <Col xs={24} sm={16} md={14}>
                    <Skeleton.Input active block />
                </Col>
                <Col xs={24} sm={8} md={10} style={{ textAlign: 'right' }}>
                    <Skeleton.Button active />
                </Col>
            </Row>
            <Space style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8, width: '100%' }}>
                {[...Array(5)].map((_, i) => (
                    <Skeleton.Button key={i} active size="small" style={{ width: 72 }} />
                ))}
            </Space>
            <Skeleton active paragraph={{ rows: 8 }} />
        </div>
    );
}

const STATUS_COLORS = {
    pending:   'orange',
    confirmed: 'blue',
    fulfilled: 'green',
    cancelled: 'red',
};

const TAB_ITEMS = [
    { key: '',          label: 'All'       },
    { key: 'pending',   label: 'Pending'   },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'fulfilled', label: 'Fulfilled' },
    { key: 'cancelled', label: 'Cancelled' },
];

export default function Index({ orders, filters }) {
    const loading = usePageLoading();
    const [search, setSearch] = useState(filters.search ?? '');

    const navigate = (overrides = {}) => {
        const params = { search, ...filters, ...overrides };
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get(route('orders.index'), params, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'Customer',
            key: 'customer',
            render: (_, r) => (
                <Space vertical size={0}>
                    <span style={{ fontWeight: 500 }}>{r.customer_name}</span>
                    <span style={{ color: '#888', fontSize: 12 }}>{r.phone}</span>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s) => (
                <Tag color={STATUS_COLORS[s] ?? 'default'}>{s?.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (v) => `$${Number(v).toFixed(2)}`,
            responsive: ['sm'],
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (d) => new Date(d).toLocaleDateString(),
            responsive: ['md'],
        },
        {
            title: '',
            key: 'actions',
            fixed: 'right',
            width: 80,
            render: (_, r) => (
                <Space>
                    <Tooltip title="View">
                        <Link href={route('orders.show', r.id)}>
                            <Button icon={<EyeOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    {['pending', 'confirmed'].includes(r.status) && (
                        <Popconfirm
                            title="Delete this order?"
                            description="All order items will also be removed."
                            onConfirm={() =>
                                router.delete(route('orders.destroy', r.id), { preserveScroll: true })
                            }
                            okText="Delete"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete">
                                <Button icon={<DeleteOutlined />} size="small" danger />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const pagination = {
        current:         orders.current_page,
        pageSize:        orders.per_page,
        total:           orders.total,
        showSizeChanger: true,
        pageSizeOptions: [10, 15, 25, 50],
        showTotal:       (total, [from, to]) => `${from}–${to} of ${total} orders`,
        locale:          { items_per_page: 'items / page' },
        onChange:        (page, pageSize) => navigate({ page, per_page: pageSize }),
    };

    return (
        <AppLayout header={<Title level={4} style={{ margin: 0 }}>Orders</Title>}>
            <Head title="Orders" />

            {loading ? <OrdersSkeleton /> : (
            <div style={{
                background: '#fff', borderRadius: 8,
                padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                <Row gutter={[12, 12]} style={{ marginBottom: 8 }} align="middle">
                    <Col xs={24} sm={16} md={14}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Search by customer or phone…"
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (!e.target.value) navigate({ search: '', page: 1 });
                                }}
                                onPressEnter={() => navigate({ search, page: 1 })}
                                allowClear
                            />
                            <Button
                                type="primary"
                                onClick={() => navigate({ search, page: 1 })}
                            >
                                Search
                            </Button>
                        </Space.Compact>
                    </Col>

                    <Col xs={24} sm={8} md={10} style={{ textAlign: 'right' }}>
                        <Link href={route('orders.create')}>
                            <Button type="primary" icon={<PlusOutlined />}>New Order</Button>
                        </Link>
                    </Col>
                </Row>

                <Tabs
                    activeKey={filters.status ?? ''}
                    onChange={(key) => navigate({ status: key, page: 1 })}
                    items={TAB_ITEMS}
                    style={{ marginBottom: 8 }}
                />

                <Table
                    dataSource={orders.data}
                    columns={columns}
                    rowKey="id"
                    pagination={pagination}
                    scroll={{ x: 480 }}
                    size="middle"
                />
            </div>
            )}
        </AppLayout>
    );
}
