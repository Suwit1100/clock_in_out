<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar_url' => $googleUser->getAvatar(),
                    'display_name' => $googleUser->getName(),
                    'password' => bcrypt(uniqid())
                ]
            );

            Auth::login($user, true);

            // dd(Auth::user());

            return redirect()->intended('/check-in-out');
        } catch (\Exception $e) {
            return redirect('/')->withErrors([
                'login' => 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้: ' . $e->getMessage()
            ]);
        }
    }
}
