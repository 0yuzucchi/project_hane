<?php
// app/Http/Controllers/User/CommentController.php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'body' => 'required|string|max:500',
        ]);

        Comment::create([
            'post_id' => $request->post_id,
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }
}
