import { Head } from '@inertiajs/react';

function login() {
    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-10 shadow-2xl">
                    <div className="text-center">
                        <img src="/logo.png" alt="Smart Attendance Logo" className="mx-auto h-20 w-20 rounded-full shadow" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-800">เข้าสู่ระบบ Clock in - Clock out</h1>
                        <p className="mt-1 text-sm text-gray-500">โปรดเข้าสู่ระบบด้วยบัญชี Google ของคุณ</p>
                    </div>
                    <button
                        onClick={() => (window.location.href = route('auth.google.redirect'))}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none dark:focus:ring-red-500"
                    >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
                            <path
                                fill="#4285F4"
                                d="M533.5 278.4c0-17.4-1.4-34.1-4-50.3H272v95.3h146.9c-6.4 34.6-25 63.9-53.3 83.5v68h85.9c50.3-46.3 81-114.7 81-196.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M272 544.3c72.6 0 133.5-24.1 178-65.2l-85.9-68c-23.9 16-54.5 25.4-92.1 25.4-70.8 0-130.7-47.8-152.1-112.1H30.1v70.4C74.9 477.1 167.8 544.3 272 544.3z"
                            />
                            <path fill="#FBBC05" d="M119.9 324.4c-10.2-30.3-10.2-62.8 0-93.1v-70.4H30.1c-39.7 78.8-39.7 170.7 0 249.5l89.8-70z" />
                            <path
                                fill="#EA4335"
                                d="M272 214.1c38.8 0 73.5 13.4 100.9 39.8l75.6-75.6C405.5 126.6 344.6 102.5 272 102.5c-104.2 0-197.1 67.2-241.9 163.6l89.8 70c21.4-64.3 81.3-112 152.1-112z"
                            />
                        </svg>
                        เข้าสู่ระบบด้วย Google
                    </button>

                    <p className="text-center text-xs text-gray-400">ระบบสำหรับพนักงานของบริษัทเท่านั้น</p>
                </div>
            </div>
        </>
    );
}

export default login;
