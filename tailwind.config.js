import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    /*
     * Disable Tailwind's CSS Preflight (browser reset) so it does not
     * clobber Ant Design's component base styles. We add a minimal
     * manual reset in app.css instead.
     */
    corePlugins: {
        preflight: false,
    },

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    dark:      '#353535',
                    teal:      '#3C6E71',
                    gray:      '#D9D9D9',
                    blue:      '#284B63',
                },
            },
        },
    },

    plugins: [forms],
};
