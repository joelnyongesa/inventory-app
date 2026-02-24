import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, Tag, Typography, Badge, Button, Flex, Space, Tooltip, Empty, Skeleton } from 'antd';
import { AlertOutlined, EditOutlined } from '@ant-design/icons';
import usePageLoading from '@/hooks/usePageLoading';

function LowStockSkeleton() {
    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
        </div>
    );
}

const { Title, Text } = Typography;

export default function LowStock({ products }) {
    const loading = usePageLoading();

    const columns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, r) => (
                <Flex vertical gap={0}>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                    <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{r.sku}</span>
                </Flex>
            ),
        },
        {
            title: 'Current Stock',
            dataIndex: 'stock_count',
            key: 'stock_count',
            render: (stock) => (
                <Tag color={stock === 0 ? 'red' : 'orange'}>
                    {stock === 0 ? 'Out of Stock' : stock}
                </Tag>
            ),
        },
        {
            title: 'Reorder Level',
            dataIndex: 'reorder_level',
            key: 'reorder_level',
            responsive: ['sm'],
        },
        {
            title: 'Deficit',
            key: 'deficit',
            responsive: ['sm'],
            render: (_, r) => (
                <Tag color="red">−{r.reorder_level - r.stock_count}</Tag>
            ),
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 64,
            render: (_, r) => (
                <Tooltip title="Edit to restock">
                    <Link href={route('products.edit', r.id)}>
                        <Button icon={<EditOutlined />} size="small" />
                    </Link>
                </Tooltip>
            ),
        },
    ];

    const pagination = {
        current:         products.current_page,
        pageSize:        products.per_page,
        total:           products.total,
        showSizeChanger: true,
        pageSizeOptions: [10, 25, 50],
        showTotal:       (total, [from, to]) => `${from}–${to} of ${total} items needing restock`,
        locale:          { items_per_page: 'items / page' },
        onChange:        (page, pageSize) =>
            router.get(
                route('products.low-stock'),
                { page, per_page: pageSize },
                { preserveState: true, replace: true },
            ),
    };

    return (
        <AppLayout
            header={
                <Space align="center">
                    <AlertOutlined style={{ color: '#cf1322', fontSize: 18 }} />
                    <Title level={4} style={{ margin: 0 }}>Low Stock Alerts</Title>
                    <Badge
                        count={products.total}
                        style={{ background: products.total > 0 ? '#cf1322' : '#52c41a' }}
                        showZero
                    />
                </Space>
            }
        >
            <Head title="Low Stock" />

            {loading ? <LowStockSkeleton /> : (
            <div style={{
                background: '#fff', borderRadius: 8,
                padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                {products.total === 0 ? (
                    <Empty
                        description={
                            <Text type="secondary">All products are adequately stocked.</Text>
                        }
                        style={{ padding: '48px 0' }}
                    />
                ) : (
                    <Table
                        dataSource={products.data}
                        columns={columns}
                        rowKey="id"
                        pagination={pagination}
                        scroll={{ x: 480 }}
                        size="middle"
                        rowClassName={(r) =>
                            r.stock_count === 0 ? 'ant-table-row-danger' : ''
                        }
                    />
                )}
            </div>
            )}
        </AppLayout>
    );
}
