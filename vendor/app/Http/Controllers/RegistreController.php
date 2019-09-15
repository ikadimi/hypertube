<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
Use Exception;
Use App\Mail\verifMail;

class RegistreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $valid = json_decode($request->credentials, true);
        $rules = [
            'first_name' => 'required|alpha|min:3|max:20',
            'last_name' => 'required|alpha|min:3|max:20',
            'username' => 'required|alpha_num|min:3|max:20',
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:5',           
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ];
        $validator = \Validator::make($valid, $rules);
        if ($validator->fails())
            return response($validator->messages()->first(), 422);
        try
        {
            $credentials = json_decode($request->credentials); 
            if (DB::table('users')->where('username', '=', $credentials->username)->count() > 0) {
                return 'Username Already Exists';
            }
            else if (DB::table('users')->where('email', '=', $credentials->email)->count() > 0) {
                return 'Email Already Exists';
            }
            $name = $request->myImage->store('images');
            $rand = str_shuffle($credentials->username . mt_rand());
            $id = DB::table('users')->insertGetId(
                ['username' => $credentials->username,
                'avatar' => $name,
                'first_name' => $credentials->first_name,
                'last_name' => $credentials->last_name,
                'email' => $credentials->email,
                'verification_code' => $rand,
                'password' => Hash::make($credentials->password)]
            );
            \Mail::to($credentials->email)->send(new verifMail($id, $credentials->username, $rand));
            return 'success';
        }
        catch(Exception $e)
        {
            return ($e->getMessage());
        }
    }

    public function verifMail(Request $request)
    {
        $verif = DB::table('users')
            ->where('verification_code', $request->route('rand'))
            ->update(['verification_code' => 0, 'email_verified' => 1]);
        if ($verif == 1)
            return view('EmailCheck', ['status' => 'success', 'msg' => "You Email has been verified"]);
        else
            return view('EmailCheck', ['status' => 'failure', 'msg' => "Wrong Request"]); 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
