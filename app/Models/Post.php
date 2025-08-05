<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'content', 'image'];

    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function isLikedBy($user)
    {
        return $this->likes->contains('user_id', $user->id);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    
    public function getRouteKeyName()
    {
        return 'id'; // Asumsi kolom UUID Anda bernama 'id'
    }
}
