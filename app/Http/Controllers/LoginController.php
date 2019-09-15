<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
Use App\Mail\Forgot_ps;

class LoginController extends Controller
{
    public function index(Request $request)
    {
        $user = DB::table('users')
                ->where('username', $request->get('username'))
                ->first();
        if ($user == NULL)
        {
            return (response()->json([
                'status' => 'failure',
                'msg' => "Username Doesn't Exist"
                ]));
        }
        else 
        {
            if  (Hash::check($request->get('password'), $user->password))
            {
                if ($user->email_verified == 1)
                    return (response()->json([
                        'status' => 'success',
                        'msg' => "Welcome"
                        ]));
                else
                {
                    return (response()->json([
                        'status' => 'failure',
                        'msg' => "Email is not verified"
                        ]));
                }
            }
            else
            {
                return (response()->json([
                    'status' => 'failure',
                    'msg' => "Wrong password"
                    ]));
            }
        }
    }

    public function forgot(Request $request)
    {
        $user = DB::table('users')
                ->where('email', $request->get('email'))
                ->first();
        if ($user == NULL)
        {
            return (response()->json([
            'status' => 'failure',
            'msg' => "Email Doesn't Exist"
            ]));
        }
        else
        {
            $rand = str_shuffle($user->username . mt_rand());
            DB::table('users')
                ->where('email', $request->get('email'))
                ->update(['password' => Hash::make($rand)]);
            \Mail::to($request)->send(new Forgot_ps($user->username, $rand));
            return (response()->json([
                'status' => 'success',
                'msg' => "Email has been sent"
            ]));
        }
    }

    public function redirectToProvider()
    {
        return \Socialite::driver('github')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback(Request $request)
    {
        $user = \Socialite::driver('github')->stateless()->user();

        $check = DB::table('users')
                ->where('password', $user->getId())
                ->first();
        if (!$check)
        {
            $id = DB::table('users')->insertGetId(
                [
                'username' => $user->getNickname(),
                'avatar' => $user->getAvatar(),
                'first_name' => $user->getNickname(),
                'last_name' => $user->getNickname(),
                'email' => $user->getEmail(),
                'verification_code' => 0,
                'email_verified' => 1,
                'password' => $user->getId()]
            );
            return (response()->json([
                'status' => 'success',
                'msg' => "First time logging"
            ]));
        }
        else
            return (response()->json([
                'status' => 'success',
                'msg' => "Old user"
            ]));
        // $user->token;
    }
}
