import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

const appName = import.meta.env.VITE_APP_NAME || 'Inventory';

/*
 * Ant Design theme tokens — maps the project palette to antd's design system.
 *
 *   #3C6E71  (teal)       → colorPrimary   buttons, links, active states
 *   #284B63  (deep blue)  → hover / active variants
 *   #353535  (dark)       → base text colour
 *   #FFFFFF  (white)      → container backgrounds
 *   #D9D9D9  (light gray) → borders, dividers
 */
const antdTheme = {
    token: {
        colorPrimary:           '#3C6E71',
        colorPrimaryHover:      '#284B63',
        colorPrimaryActive:     '#284B63',
        colorTextBase:          '#353535',
        colorBgContainer:       '#FFFFFF',
        colorBgLayout:          '#F0F2F5',
        colorBorder:            '#D9D9D9',
        colorBorderSecondary:   '#D9D9D9',
        borderRadius:           6,
        fontFamily:
            "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 14,
    },
    components: {
        Layout: {
            siderBg:   '#353535',
            headerBg:  '#284B63',
            bodyBg:    '#F0F2F5',
            triggerBg: '#2A2A2A',
        },
        Menu: {
            darkItemBg:           '#353535',
            darkSubMenuItemBg:    '#2A2A2A',
            darkItemSelectedBg:   '#3C6E71',
            darkItemHoverBg:      'rgba(60,110,113,0.25)',
            darkItemSelectedColor: '#FFFFFF',
            darkItemColor:        '#D9D9D9',
        },
        Button: {
            colorPrimary:      '#3C6E71',
            colorPrimaryHover: '#284B63',
        },
    },
};

createInertiaApp({
    title: (title) => `${title} — ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            /*
             * StyleProvider(layer=true) writes antd's CSS-in-JS output into
             * a native CSS @layer named "antd". Because Tailwind utility
             * classes are NOT inside any CSS layer they automatically have
             * higher cascade priority — so `className="text-red-500"` always
             * beats an antd default when you need to override something.
             */
            <StyleProvider layer>
                <ConfigProvider theme={antdTheme}>
                    <App {...props} />
                </ConfigProvider>
            </StyleProvider>,
        );
    },

    progress: { color: '#3C6E71' },
});
