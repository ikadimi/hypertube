<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/registre', 'RegistreController@index');
Route::post('/login', 'LoginController@index');
Route::post('/forgot', 'LoginController@forgot');

Route::get('/verifMail/{rand}', 'RegistreController@verifMail')
->where('rand', '[a-zA-Z0-9]+');

// Route::get('login/github', 'LoginController@redirectToProvider');
Route::get('login/github', 'LoginController@handleProviderCallback');