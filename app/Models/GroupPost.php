<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class GroupPost extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'group_id', 'user_id', 'content', 'image',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    public function likes()
    {
        return $this->hasMany(Like::class, 'post_id'); // Sesuaikan foreign key jika perlu
    }

    // --> DAN RELASI INI JUGA ADA <--
    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id'); // Sesuaikan foreign key jika perlu
    }
}
