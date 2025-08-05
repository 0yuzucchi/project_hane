<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;

class PostDetailController extends Controller
{
    public function show(Post $post, Request $request)
    {
        $post->load([
            'user',
            'comments.user',
            'likes'
        ]);

        return Inertia::render('PostDetail', [
            'auth' => [
                'user' => $request->user(),
            ],
            'post' => $post,
            'hasLiked' => $post->likes->contains('user_id', $request->user()->id),
            'likesCount' => $post->likes->count(),
        ]);
    }
}
