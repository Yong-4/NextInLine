<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QRequestController;

Route::get('/', function () {
    return view('index');
})->name('index');

Route::get('/qrequest', [QRequestController::class, 'main'])->name('QRequest.main');
Route::post('/qrequest', [QRequestController::class, 'insert'])->name('QRequest.insert');
