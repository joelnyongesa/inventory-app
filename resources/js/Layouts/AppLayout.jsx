import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useNavTour } from '@/hooks/useTour';
import {
    Layout,
    Menu,
    Button,
    Avatar,
    Dropdown,
    Typography,
    Drawer,
    Tour,
    notification,
    theme as antdTheme,
} from 'antd';
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    AlertOutlined,
    MenuOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
    { key: 'dashboard',  href: '/dashboard', icon: <DashboardOutlined />,   label: 'Dashboard'  },
    { key: 'products',   href: '/products',  icon: <AppstoreOutlined />,    label: 'Products'   },
    { key: 'orders',     href: '/orders',    icon: <ShoppingCartOutlined />, label: 'Orders'     },
    { key: 'low-stock',  href: '/low-stock', icon: <AlertOutlined />,       label: 'Low Stock'  },
];

function resolveSelectedKey(pathname) {
    if (pathname.startsWith('/products'))  return 'products';
    if (pathname.startsWith('/orders'))    return 'orders';
    if (pathname.startsWith('/low-stock')) return 'low-stock';
    return 'dashboard';
}

function SideMenu({ selectedKey, collapsed = false, onNavigate }) {
    const items = NAV_ITEMS.map(({ key, href, icon, label }) => ({
        key,
        icon,
        label: (
            <Link href={href} onClick={onNavigate} id={`inv-nav-${key}`}>
                {label}
            </Link>
        ),
    }));

    return (
        <>
            <div
                style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    flexShrink: 0,
                    padding: '0 12px',
                    overflow: 'hidden',
                }}
            >
                {collapsed ? (
                    <ApplicationLogo style={{ width: 32, height: 32, flexShrink: 0 }} />
                ) : (
                    <Text
                        style={{
                            color:       '#3C6E71',
                            fontWeight:  700,
                            fontSize:    18,
                            letterSpacing: 1,
                            whiteSpace:  'nowrap',
                        }}
                    >
                        Inventory
                    </Text>
                )}
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                style={{ background: '#353535', border: 'none', marginTop: 8, flex: 1 }}
                items={items}
            />
        </>
    );
}

export default function AppLayout({ children, header }) {
    const { auth, flash } = usePage().props;
    const { token } = antdTheme.useToken();
    const [notifApi, notifHolder] = notification.useNotification();

    const [collapsed,   setCollapsed]   = useState(false);
    const [drawerOpen,  setDrawerOpen]  = useState(false);
    const [isMobile,    setIsMobile]    = useState(false);

    const menuToggleRef = useRef(null);
    const userAreaRef   = useRef(null);

    const { open: navTourOpen, finish: finishNavTour, dismiss: dismissNavTour } = useNavTour();

    useEffect(() => {
        if (flash?.success) {
            notifApi.success({ message: flash.success, placement: 'topRight', duration: 3 });
        }
        if (flash?.error) {
            notifApi.error({ message: flash.error, placement: 'topRight', duration: 4 });
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 768px)');
        const onChange = (e) => {
            setIsMobile(e.matches);
            if (e.matches) setDrawerOpen(false);
        };
        setIsMobile(mql.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    const pathname    = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
    const selectedKey = resolveSelectedKey(pathname);

    const userDropdown = {
        items: [
            {
                key:   'profile',
                icon:  <SettingOutlined />,
                label: <Link href={route('profile.edit')}>Profile</Link>,
            },
            { type: 'divider' },
            {
                key:    'logout',
                icon:   <LogoutOutlined />,
                danger: true,
                label: (
                    <span onClick={() => router.post(route('logout'))}>
                        Log Out
                    </span>
                ),
            },
        ],
    };

    const userInitial = auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'U';

    // ── Navigation tour steps ─────────────────────────────────────────────
    const navTourSteps = isMobile
        ? [
            {
                title: 'Navigation Menu',
                description: 'Tap this icon to open the navigation drawer and jump to any section of the app.',
                target: () => menuToggleRef.current,
                placement: 'bottomLeft',
            },
            {
                title: 'Your Account',
                description: 'Tap here to view your profile or log out.',
                target: () => userAreaRef.current,
                placement: 'bottomRight',
            },
        ]
        : [
            {
                title: 'Navigation Sidebar',
                description: 'This sidebar is your main navigation hub. Use it to move between all sections of the app.',
                target: () => document.getElementById('inv-sider'),
                placement: 'right',
            },
            {
                title: 'Dashboard',
                description: "Get a bird's-eye view of your inventory — key metrics, recent orders, and stock alerts.",
                target: () => document.getElementById('inv-nav-dashboard'),
                placement: 'right',
            },
            {
                title: 'Products',
                description: 'Add, edit, and manage your entire product catalog from here.',
                target: () => document.getElementById('inv-nav-products'),
                placement: 'right',
            },
            {
                title: 'Orders',
                description: 'Create and track customer orders through their full lifecycle.',
                target: () => document.getElementById('inv-nav-orders'),
                placement: 'right',
            },
            {
                title: 'Low Stock Alerts',
                description: 'Keep an eye on which products are running low and need restocking before they run out.',
                target: () => document.getElementById('inv-nav-low-stock'),
                placement: 'right',
            },
            {
                title: 'Collapse Sidebar',
                description: 'Click this button to collapse the sidebar and gain more screen space when you need it.',
                target: () => menuToggleRef.current,
                placement: 'right',
            },
            {
                title: 'Your Account',
                description: 'Click here to access your profile settings or sign out.',
                target: () => userAreaRef.current,
                placement: 'bottomRight',
            },
        ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {notifHolder}

            {!isMobile && (
                <Sider
                    id="inv-sider"
                    collapsible
                    collapsed={collapsed}
                    trigger={null}
                    width={220}
                    collapsedWidth={64}
                    style={{
                        background:  '#353535',
                        position:    'sticky',
                        top:         0,
                        height:      '100vh',
                        overflowY:   'auto',
                        overflowX:   'hidden',
                        flexShrink:  0,
                    }}
                >
                    <SideMenu
                        selectedKey={selectedKey}
                        collapsed={collapsed}
                    />
                </Sider>
            )}

            {isMobile && (
                <Drawer
                    placement="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    width={220}
                    styles={{
                        body:   { padding: 0, background: '#353535', display: 'flex', flexDirection: 'column' },
                        header: { display: 'none' },
                        wrapper: { boxShadow: '4px 0 16px rgba(0,0,0,0.35)' },
                    }}
                >
                    <SideMenu
                        selectedKey={selectedKey}
                        onNavigate={() => setDrawerOpen(false)}
                    />
                </Drawer>
            )}

            <Layout style={{ background: '#F0F2F5' }}>
                <Header
                    style={{
                        background:    '#284B63',
                        padding:       '0 16px',
                        display:       'flex',
                        alignItems:    'center',
                        justifyContent: 'space-between',
                        height:        64,
                        lineHeight:    '64px',
                        position:      'sticky',
                        top:           0,
                        zIndex:        100,
                        boxShadow:     '0 2px 8px rgba(0,0,0,0.28)',
                    }}
                >
                    <Button
                        ref={menuToggleRef}
                        type="text"
                        icon={
                            isMobile
                                ? <MenuOutlined />
                                : collapsed
                                    ? <MenuUnfoldOutlined />
                                    : <MenuFoldOutlined />
                        }
                        onClick={() =>
                            isMobile
                                ? setDrawerOpen(true)
                                : setCollapsed((c) => !c)
                        }
                        style={{ color: '#fff', fontSize: 18, width: 40, height: 40 }}
                        aria-label="Toggle menu"
                    />

                    <Dropdown menu={userDropdown} placement="bottomRight" arrow>
                        <div
                            ref={userAreaRef}
                            style={{
                                display:    'flex',
                                alignItems: 'center',
                                gap:        8,
                                cursor:     'pointer',
                                padding:    '4px 8px',
                                borderRadius: token.borderRadius,
                                transition: 'background 0.2s',
                            }}
                        >
                            <Avatar
                                size={34}
                                style={{ background: '#3C6E71', fontWeight: 700, flexShrink: 0 }}
                            >
                                {userInitial}
                            </Avatar>
                            {!isMobile && (
                                <Text style={{ color: '#D9D9D9', fontSize: 14 }}>
                                    {auth?.user?.name}
                                </Text>
                            )}
                        </div>
                    </Dropdown>
                </Header>

                {header && (
                    <div
                        style={{
                            background:   '#fff',
                            borderBottom: '1px solid #D9D9D9',
                            padding:      isMobile ? '12px 16px' : '16px 24px',
                        }}
                    >
                        {header}
                    </div>
                )}

                <Content
                    style={{
                        margin:    isMobile ? '16px 12px' : '24px 20px',
                        minHeight: 'calc(100vh - 136px)',
                    }}
                >
                    {children}
                </Content>
            </Layout>

            <Tour
                open={navTourOpen}
                onClose={dismissNavTour}
                onFinish={finishNavTour}
                steps={navTourSteps}
                scrollIntoViewOptions={{ behavior: 'smooth', block: 'center' }}
                zIndex={1050}
            />
        </Layout>
    );
}
