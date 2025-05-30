<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QRequestController;

Route::get('/', function () {
    return view('index');
})->name('index');

Route::get('/qrequest', [QRequestController::class, 'main'])->name('QRequest.main');
Route::post('/qrequest', [QRequestController::class, 'insert'])->name('QRequest.insert');
Route::post('/queue/register', [QRequestController::class, 'apiStore'])
    ->name('QRequest.apiStore');
Route::get('/current-serving', [QRequestController::class, 'showCurrentServingQueue']);
Route::post('/send-queue-email', [QRequestController::class, 'sendQueueEmail']);
Route::post('/queue/cancel', [QRequestController::class, 'cancelQueue']);

