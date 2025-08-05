<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\User\CommentController;
use App\Http\Controllers\User\LikeController;
use App\Http\Controllers\User\ReportController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\PostDetailController;
use App\Http\Controllers\User\GroupController;
use App\Http\Controllers\GroupPostController;

// 👤 TAMU (GUEST)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/', function () {
        return Inertia::render('Home', [
            'message' => 'Welcome to Hane 羽!',
        ]);
    })->name('home');
});

// 🔐 PENGGUNA TERAUTENTIKASI (AUTH)
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // =======================================================
    // ====> RUTIN PENCARIAN DIPINDAHKAN KE SINI & DIPERBAIKI <====
    // =======================================================
    Route::get('/search', [PostController::class, 'search'])->name('search'); // Nama rute diubah menjadi '/search'

    // Post
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PostDetailController::class, 'show'])->name('posts.show');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])
        ->name('posts.destroy')
        ->middleware('auth');

    Route::get('/group-posts/{groupPost}', [GroupController::class, 'showPost'])->name('group-posts.show');

    // Comment
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');

    // Likes
    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');

    // Report user
    Route::post('/report-user/{user}', [ReportController::class, 'store'])->name('reports.store');

    // Friendship
    Route::get('/friendships', [FriendshipController::class, 'index'])->name('friendships.index');
    Route::get('/search-users', [FriendshipController::class, 'searchUsers'])->name('friendships.search');

    // PERUBAHAN: Gunakan {user} agar cocok dengan method `sendRequest(User $user)`
    Route::post('/friend-request/{user}', [FriendshipController::class, 'sendRequest'])->name('friendships.request');

    // PERUBAHAN: Gunakan {friendship} agar cocok dengan method `respondRequest(Friendship $friendship)`
    Route::post('/friend-response/{friendship}', [FriendshipController::class, 'respondRequest'])->name('friendships.respond');

    // PERUBAHAN: Gunakan {user} agar cocok dengan method `removeFriend(User $user)`
    Route::delete('/friend-remove/{user}', [FriendshipController::class, 'removeFriend'])->name('friendships.remove');
    Route::get('/search-users', [FriendshipController::class, 'searchUsers']);



    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
        Route::post('/check-username', [ProfileController::class, 'checkUsername'])->name('profile.checkUsername');


        Route::get('/profile/{user:username}', [ProfileController::class, 'showPublicProfile'])
    ->name('profile.public.show');

    Route::get('/profile/id/{user}', [ProfileController::class, 'showPublicProfile'])
    ->name('profile.public.show.by.id');


    // Rute-rute terkait grup
    Route::post('/groups/{group}/join', [GroupController::class, 'join'])->name('groups.join');
    Route::post('/groups/{group}/leave', [GroupController::class, 'leave'])->name('groups.leave');

    // Group
    Route::prefix('groups')->name('groups.')->group(function () {
        Route::get('/', [GroupController::class, 'index'])->name('index');
        Route::get('/create', [GroupController::class, 'create'])->name('create');
        Route::post('/', [GroupController::class, 'store'])->name('store');
        Route::get('/{group}', [GroupController::class, 'show'])->name('show');

        // Hanya pemilik yang bisa akses edit, update, dan delete
        Route::middleware('can:update,group')->group(function () {
            Route::get('/{group}/edit', [GroupController::class, 'edit'])->name('edit');
            Route::put('/{group}', [GroupController::class, 'update'])->name('update');
            Route::delete('/{group}', [GroupController::class, 'destroy'])->name('destroy');
        });

        // Postingan di dalam grup
        Route::post('/{group}/posts', [GroupPostController::class, 'store'])->name('posts.store');
    });

    // Logout
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});
