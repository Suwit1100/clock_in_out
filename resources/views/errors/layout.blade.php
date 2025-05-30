<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Error')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet">


    <style>
        * {
            font-family: "IBM Plex Sans Thai", sans-serif;
            font-style: normal;
        }

        :root {
            /* Light mode colors from your app.css */
            --background: oklch(0.99 0.002 85);
            --foreground: oklch(0.15 0.01 260);
            --card: oklch(1 0.003 85);
            --primary: oklch(0.85 0.18 75);
            --primary-foreground: oklch(0.12 0.02 260);
            --secondary: oklch(0.32 0.08 255);
            --secondary-foreground: oklch(0.98 0.005 85);
            --muted: oklch(0.96 0.008 85);
            --muted-foreground: oklch(0.5 0.015 260);
            --accent: oklch(0.95 0.04 80);
            --border: oklch(0.92 0.01 85);
            --destructive: oklch(0.6 0.2 25);
        }

        body {
            background: var(--background);
            color: var(--foreground);
            font-family: 'IBM Plex Sans Thai', ui-sans-serif, system-ui, sans-serif;
            transition: all 0.3s ease;
        }

        /* Floating animation */
        @keyframes float {

            0%,
            100% {
                transform: translateY(0px) rotate(0deg);
            }

            33% {
                transform: translateY(-10px) rotate(1deg);
            }

            66% {
                transform: translateY(5px) rotate(-1deg);
            }
        }

        /* Pulse animation */
        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.7;
            }
        }

        /* Bounce animation */
        @keyframes bounceIn {
            0% {
                transform: scale(0.3) translateY(-50px);
                opacity: 0;
            }

            50% {
                transform: scale(1.1) translateY(-10px);
                opacity: 0.8;
            }

            100% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }

        /* Slide in animation */
        @keyframes slideInUp {
            0% {
                transform: translateY(50px);
                opacity: 0;
            }

            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Gradient animation */
        @keyframes gradientShift {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }

        .error-code {
            animation: bounceIn 1s ease-out, gradientShift 3s ease infinite 1s, scaleGlow 4s ease-in-out infinite 2s;
            background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
        }

        .error-code::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 160%;
            height: 160%;
            background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
            opacity: 0.15;
            border-radius: 50%;
            z-index: -1;
            animation: glowPulse 4s ease-in-out infinite;
            filter: blur(30px);
            /* เพิ่มความนุ่ม */
        }

        .error-message {
            animation: slideInUp 0.8s ease-out 0.3s both;
        }

        .error-message h1 {
            position: relative;
            overflow: hidden;
        }

        .error-message h1::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            animation: typing 2s ease-out 1.5s forwards;
        }

        .error-description {
            animation: slideInUp 0.8s ease-out 0.6s both;
        }

        .error-actions {
            animation: slideInUp 0.8s ease-out 0.9s both;
        }

        .floating-shape {
            animation: float 6s ease-in-out infinite;
        }

        .floating-shape:nth-child(2) {
            animation-delay: -2s;
        }

        .floating-shape:nth-child(3) {
            animation-delay: -4s;
        }

        /* Glassmorphism effect */
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Button hover effects */
        .btn-primary {
            background: var(--primary);
            color: var(--primary-foreground);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .btn-primary:hover::before {
            left: 100%;
        }

        .btn-primary:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 35px rgba(133, 77, 14, 0.4);
        }

        .btn-primary:active {
            animation: shake 0.5s ease-in-out;
        }

        .btn-secondary {
            background: var(--secondary);
            color: var(--secondary-foreground);
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --background: oklch(0.22 0.03 270.61);
                --foreground: oklch(0.95 0.01 85);
                --card: oklch(0.12 0.025 260);
                --primary: oklch(0.88 0.2 78);
                --primary-foreground: oklch(0.08 0.02 260);
                --secondary: oklch(0.4 0.12 250);
                --secondary-foreground: oklch(0.96 0.01 85);
                --muted: oklch(0.2 0.02 260);
                --muted-foreground: oklch(0.7 0.02 85);
                --accent: oklch(0.25 0.03 260);
                --border: oklch(0.25 0.03 260);
            }

            .glass {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
    </style>
</head>

<body class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 pointer-events-none">
        <!-- Floating shapes -->
        <div class="floating-shape absolute top-20 left-20 w-32 h-32 rounded-full opacity-20"
            style="background: var(--primary);"></div>
        <div class="floating-shape absolute top-40 right-32 w-24 h-24 rounded-full opacity-15"
            style="background: var(--secondary);"></div>
        <div class="floating-shape absolute bottom-32 left-1/4 w-20 h-20 rounded-full opacity-25"
            style="background: var(--accent);"></div>

        <!-- Grid pattern -->
        <div class="absolute inset-0 opacity-5"
            style="background-image: radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0); background-size: 50px 50px;">
        </div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
        <!-- Error card -->
        <div
            class="glass rounded-3xl p-12 md:p-16 lg:p-20 shadow-2xl transform hover:scale-105 transition-all duration-500 min-h-[200px] flex flex-col justify-center">
            <!-- Error code -->
            <div class="error-code text-9xl md:text-[12rem] lg:text-[14rem] font-black mb-8 leading-none relative">
                @yield('code', '404')
            </div>

            <!-- Error message -->
            <div class="error-message mb-6">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style="color: var(--foreground);">
                    @yield('title', 'Page Not Found')
                </h1>
            </div>

            <!-- Error description -->
            <div class="error-description mb-8">
                <p class="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed"
                    style="color: var(--muted-foreground);">
                    @yield('message', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')
                </p>
            </div>

            <!-- Action buttons -->
            <div class="error-actions flex flex-col sm:flex-row gap-4 justify-center items-center">


                @yield('redirect')
            </div>

            <!-- Additional help -->
            <div class="mt-8 pt-6 border-t opacity-60" style="border-color: var(--border);">
                <p class="text-sm" style="color: var(--muted-foreground);">
                    Need help?
                    <a href="/contact" class="underline hover:no-underline transition-all duration-200"
                        style="color: var(--primary);">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>

        <!-- Fun interactive elements -->
        <div class="mt-8 flex justify-center space-x-4">
            <div class="w-3 h-3 rounded-full animate-bounce" style="background: var(--primary); animation-delay: 0s;">
            </div>
            <div class="w-3 h-3 rounded-full animate-bounce"
                style="background: var(--secondary); animation-delay: 0.1s;"></div>
            <div class="w-3 h-3 rounded-full animate-bounce" style="background: var(--accent); animation-delay: 0.2s;">
            </div>
        </div>
    </div>

    <!-- Subtle particles effect -->
    <script>
        // Add some interactive sparkles on mouse move
        document.addEventListener('mousemove', function(e) {
            if (Math.random() < 0.1) {
                createSparkle(e.clientX, e.clientY);
            }
        });

        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute pointer-events-none';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = 'var(--primary)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.animation = 'pulse 1s ease-out forwards, fadeOut 1s ease-out forwards';
            sparkle.style.transform = 'translate(-50%, -50%)';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }

        // Add fadeOut animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
            }
        `;
        document.head.appendChild(style);
    </script>
</body>

</html>
