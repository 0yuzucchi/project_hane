<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('notifications', function (Blueprint $table) {
        // Hapus kolom polymorphic
        $table->dropColumn(['notifiable_type', 'notifiable_id']);

        // Tambahkan kolom user_id
        $table->foreignId('user_id')->constrained()->after('id');
    });
}

public function down()
{
    Schema::table('notifications', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
        $table->dropColumn('user_id');

        $table->string('notifiable_type');
        $table->unsignedBigInteger('notifiable_id');
    });
}

};
