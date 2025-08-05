<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasRoles, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username', // <-- Pastikan username ada di sini
        'email',
        'password',
        'avatar',
        'bio', // <-- Tambahkan bio untuk kelengkapan profil
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * === RELASI-RELASI APLIKASI ===
     */

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user')->withPivot('role')->withTimestamps();
    }

    public function ownedGroups()
    {
        return $this->hasMany(Group::class, 'owner_id');
    }

    // --- RELASI PERTEMANAN YANG LEBIH BAIK ---
    // Relasi untuk mendapatkan daftar pertemanan dimana user ini yang mengikuti.
    public function followings()
    {
        return $this->hasMany(Friendship::class, 'user_id')->where('status', 'accepted');
    }

    // Relasi untuk mendapatkan daftar pertemanan dimana user ini yang diikuti.
    public function followers()
    {
        return $this->hasMany(Friendship::class, 'friend_id')->where('status', 'accepted');
    }

    /**
     * === FUNGSI AKSES PANEL FILAMENT ===
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasRole('admin');
    }
}