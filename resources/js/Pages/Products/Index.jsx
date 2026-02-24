import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Table, Button, Input, Select, Tag, Space,
    Popconfirm, Typography, Row, Col, Tooltip, Skeleton,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    AlertOutlined, SearchOutlined,
} from '@ant-design/icons';
import usePageLoading from '@/hooks/usePageLoading';

const { Title } = Typography;

function ProductsSkeleton() {
    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }} align="middle">
                <Col xs={24} sm={14} md={12}>
                    <Skeleton.Input active block />
                </Col>
                <Col xs={14} sm={6} md={5}>
                    <Skeleton.Input active block />
                </Col>
                <Col xs={10} sm={4} md={7} style={{ textAlign: 'right' }}>
                    <Skeleton.Button active />
                </Col>
            </Row>
            <Skeleton active paragraph={{ rows: 8 }} />
        </div>
    );
}

export default function Index({ products, filters }) {
    const loading = usePageLoading();
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides = {}) => {
        const params = { search, ...filters, ...overrides };
        Object.keys(params).forEach((k) => {
            if (!params[k] || params[k] === 'all') delete params[k];
        });
        router.get(route('products.index'), params, { preserveState: true, replace: true });
    };

    const columns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, r) => (
                <Space vertical size={0}>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                    <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{r.sku}</span>
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (v) => `$${Number(v).toFixed(2)}`,
            responsive: ['sm'],
        },
        {
            title: 'Stock',
            dataIndex: 'stock_count',
            key: 'stock_count',
            render: (stock, r) => {
                const isOut = stock === 0;
                const isLow = !isOut && stock < r.reorder_level;
                return (
                    <Space size={4}>
                        <span style={{ color: isOut ? '#cf1322' : isLow ? '#fa8c16' : '#222' }}>
                            {stock}
                        </span>
                        {(isOut || isLow) && (
                            <Tooltip title={isOut ? 'Out of stock' : 'Below reorder level'}>
                                <AlertOutlined style={{ color: isOut ? '#cf1322' : '#fa8c16' }} />
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Reorder',
            dataIndex: 'reorder_level',
            key: 'reorder_level',
            responsive: ['md'],
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (v) => (
                <Tag color={v ? '#3C6E71' : 'default'}>{v ? 'Active' : 'Inactive'}</Tag>
            ),
        },
        {
            title: '',
            key: 'actions',
            fixed: 'right',
            width: 88,
            render: (_, r) => (
                <Space>
                    <Tooltip title="Edit">
                        <Link href={route('products.edit', r.id)}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete this product?"
                        description="Products with existing order items cannot be deleted."
                        onConfirm={() =>
                            router.delete(route('products.destroy', r.id), { preserveScroll: true })
                        }
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button icon={<DeleteOutlined />} size="small" danger />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const pagination = {
        current:         products.current_page,
        pageSize:        products.per_page,
        total:           products.total,
        showSizeChanger: true,
        pageSizeOptions: [10, 15, 25, 50],
        showTotal:       (total, [from, to]) => `${from}–${to} of ${total} products`,
        locale:          { items_per_page: 'items / page' },
        onChange:        (page, pageSize) => applyFilters({ page, per_page: pageSize }),
    };

    return (
        <AppLayout header={<Title level={4} style={{ margin: 0 }}>Products</Title>}>
            <Head title="Products" />

            {loading ? <ProductsSkeleton /> : (
            <div style={{
                background: '#fff', borderRadius: 8,
                padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }} align="middle">
                    <Col xs={24} sm={14} md={12}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Search by name or SKU…"
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (!e.target.value) applyFilters({ search: '', page: 1 });
                                }}
                                onPressEnter={() => applyFilters({ search, page: 1 })}
                                allowClear
                            />
                            <Button
                                type="primary"
                                onClick={() => applyFilters({ search, page: 1 })}
                            >
                                Search
                            </Button>
                        </Space.Compact>
                    </Col>

                    <Col xs={14} sm={6} md={5}>
                        <Select
                            value={filters.status || undefined}
                            onChange={(v) => applyFilters({ status: v ?? 'all', page: 1 })}
                            placeholder="Filter by status"
                            style={{ width: '100%' }}
                            allowClear
                            options={[
                                { value: 'active',   label: 'Active products'   },
                                { value: 'inactive', label: 'Inactive products' },
                            ]}
                        />
                    </Col>

                    <Col xs={10} sm={4} md={7} style={{ textAlign: 'right' }}>
                        <Link href={route('products.create')}>
                            <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
                        </Link>
                    </Col>
                </Row>

                <Table
                    dataSource={products.data}
                    columns={columns}
                    rowKey="id"
                    pagination={pagination}
                    scroll={{ x: 560 }}
                    size="middle"
                />
            </div>
            )}
        </AppLayout>
    );
}
