<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QRequest extends Model
{
    protected $table = 'qrequests';
    
    protected $fillable = [
        'name',
        'student_id',
        'purpose',
        'email',
    ];
}
