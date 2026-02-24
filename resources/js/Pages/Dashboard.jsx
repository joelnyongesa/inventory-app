import { useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Empty, Space, Flex, Button, Skeleton, Tour } from 'antd';
import {
    AppstoreOutlined,
    ShoppingCartOutlined,
    AlertOutlined,
    DollarOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import usePageLoading from '@/hooks/usePageLoading';
import { usePageTour } from '@/hooks/useTour';

const { Title, Text } = Typography;

function DashboardSkeleton() {
    return (
        <>
            <Row gutter={[16, 16]}>
                {[...Array(4)].map((_, i) => (
                    <Col xs={24} sm={12} xl={6} key={i}>
                        <Card
                            variant="borderless"
                            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                            styles={{ body: { padding: '20px 24px' } }}
                        >
                            <Skeleton.Avatar active shape="square" size={40} style={{ marginBottom: 12 }} />
                            <Skeleton active title={{ width: '55%' }} paragraph={{ rows: 1, width: '35%' }} />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={14}>
                    <Card
                        title={<Skeleton.Input active size="small" style={{ width: 130 }} />}
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Skeleton active paragraph={{ rows: 5 }} />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card
                        title={<Skeleton.Input active size="small" style={{ width: 150 }} />}
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

const STATS = [
    { title: 'Total Products',   icon: <AppstoreOutlined />,    color: '#3C6E71', bg: 'rgba(60,110,113,0.10)' },
    { title: 'Active Orders',    icon: <ShoppingCartOutlined />, color: '#284B63', bg: 'rgba(40,75,99,0.10)'   },
    { title: 'Low Stock Items',  icon: <AlertOutlined />,       color: '#cf1322', bg: 'rgba(207,19,34,0.08)'  },
    { title: 'Revenue (month)',  icon: <DollarOutlined />,      color: '#353535', bg: 'rgba(53,53,53,0.06)',  prefix: '$' },
];

const STATUS_COLORS = { pending: 'orange', confirmed: 'blue', fulfilled: 'green', cancelled: 'red' };

const ORDER_COLUMNS = [
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer' },
    {
        title: 'Status', dataIndex: 'status', key: 'status',
        render: (s) => <Tag color={STATUS_COLORS[s] ?? 'default'}>{s?.toUpperCase()}</Tag>,
    },
    {
        title: 'Total', dataIndex: 'total', key: 'total',
        render: (v) => `$${Number(v).toFixed(2)}`,
    },
];

const LOW_STOCK_COLUMNS = [
    {
        title: 'Product', key: 'product',
        render: (_, r) => (
            <Flex vertical gap={0}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                <span style={{ color: '#888', fontSize: 11, fontFamily: 'monospace' }}>{r.sku}</span>
            </Flex>
        ),
    },
    {
        title: 'Stock / Reorder', key: 'stock',
        render: (_, r) => (
            <Space size={4}>
                <Tag color={r.stock_count === 0 ? 'red' : 'orange'}>{r.stock_count}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>/ {r.reorder_level}</Text>
            </Space>
        ),
    },
];

export default function Dashboard({ stats = {}, recentOrders = [], lowStockAlerts = [] }) {
    const loading = usePageLoading();

    const statsRef         = useRef(null);
    const recentOrdersRef  = useRef(null);
    const lowStockAlertsRef = useRef(null);

    const { open: tourOpen, finish: finishTour } = usePageTour('dashboard', loading);

    const tourSteps = [
        {
            title: 'Overview Metrics',
            description: 'These cards show your key business metrics at a glance — total products, active orders, low-stock items, and monthly revenue.',
            target: () => statsRef.current,
            placement: 'bottom',
        },
        {
            title: 'Recent Orders',
            description: 'Your latest customer orders appear here so you can track activity at a glance. Click any order for full details.',
            target: () => recentOrdersRef.current,
            placement: 'top',
        },
        {
            title: 'Low Stock Alerts',
            description: 'Products that have fallen below their reorder level are highlighted here. Act quickly before they run out.',
            target: () => lowStockAlertsRef.current,
            placement: 'top',
        },
    ];

    const {
        totalProducts  = 0,
        activeOrders   = 0,
        lowStockItems  = 0,
        monthlyRevenue = 0,
    } = stats;

    const values = [totalProducts, activeOrders, lowStockItems, monthlyRevenue];

    return (
        <AppLayout
            header={
                <Title level={4} style={{ margin: 0, color: '#353535' }}>
                    Dashboard
                </Title>
            }
        >
            <Head title="Dashboard" />

            {loading ? <DashboardSkeleton /> : (
            <>
            <div ref={statsRef}>
                <Row gutter={[16, 16]}>
                    {STATS.map((stat, i) => (
                        <Col xs={24} sm={12} xl={6} key={stat.title}>
                            <Card
                                variant="borderless"
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                                styles={{ body: { padding: '20px 24px' } }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: 8, background: stat.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 20, color: stat.color, marginBottom: 12,
                                }}>
                                    {stat.icon}
                                </div>
                                <Statistic
                                    title={<Text style={{ color: '#888', fontSize: 13 }}>{stat.title}</Text>}
                                    value={values[i]}
                                    prefix={stat.prefix}
                                    valueStyle={{ color: stat.color, fontWeight: 700, fontSize: 28, lineHeight: 1.2 }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={14}>
                    <div ref={recentOrdersRef}>
                        <Card
                            title={<Text strong style={{ color: '#353535' }}>Recent Orders</Text>}
                            variant="borderless"
                            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            {recentOrders.length > 0 ? (
                                <Table
                                    dataSource={recentOrders}
                                    columns={ORDER_COLUMNS}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                            ) : (
                                <Empty
                                    description={<Text type="secondary">No orders yet.</Text>}
                                    style={{ padding: '24px 0' }}
                                />
                            )}
                        </Card>
                    </div>
                </Col>

                <Col xs={24} lg={10}>
                    <div ref={lowStockAlertsRef}>
                        <Card
                            title={<Text strong style={{ color: '#353535' }}>Low Stock Alerts</Text>}
                            variant="borderless"
                            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                            extra={
                                lowStockAlerts.length > 0 && (
                                    <Link href={route('products.low-stock')}>
                                        <Button type="link" size="small" icon={<ArrowRightOutlined />}>
                                            View All
                                        </Button>
                                    </Link>
                                )
                            }
                        >
                            {lowStockAlerts.length > 0 ? (
                                <Table
                                    dataSource={lowStockAlerts}
                                    columns={LOW_STOCK_COLUMNS}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                            ) : (
                                <Empty
                                    description={<Text type="secondary">All products adequately stocked.</Text>}
                                    style={{ padding: '24px 0' }}
                                />
                            )}
                        </Card>
                    </div>
                </Col>
            </Row>
            </>
            )}

            <Tour
                open={tourOpen}
                onClose={finishTour}
                onFinish={finishTour}
                steps={tourSteps}
                scrollIntoViewOptions={{ behavior: 'smooth', block: 'center' }}
                zIndex={1050}
            />
        </AppLayout>
    );
}
