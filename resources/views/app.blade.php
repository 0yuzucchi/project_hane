<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title inertia>Hane</title>
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
