<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Buat roles jika belum ada
        $userRole = Role::firstOrCreate(['name' => 'user']);
        // Pengguna biasa
        $user = User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'User',
                'password' => Hash::make('12345678'), // Ganti sesuai kebutuhan
            ]
        );
        $user->assignRole($userRole);
    }
}
