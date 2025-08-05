<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class AssignRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Buat role admin jika belum ada
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        // Ambil user pertama (atau ubah berdasarkan email)
        $user = User::first();

        if ($user) {
            $user->assignRole('admin');
            $this->command->info("User '{$user->email}' diberi role admin.");
        } else {
            $this->command->warn("Tidak ada user ditemukan.");
        }
    }
}
