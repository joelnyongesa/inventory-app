<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Inventory') }}</title>

        <!-- SEO -->
        <meta name="description" content="Inventory Management — track products, orders, and stock levels in real time.">
        <meta name="robots" content="noindex, nofollow">

        <!-- Open Graph -->
        <meta property="og:type"        content="website">
        <meta property="og:title"       content="Inventory Management">
        <meta property="og:description" content="Track products, orders, and stock levels in real time.">
        <meta property="og:url"         content="{{ url('/') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
