<?php

namespace App\Http\Controllers;

use App\Models\GroupPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupPostController extends Controller
{
    public function store(Request $request, $groupId)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('group_posts', 'public');
        }

        $data['group_id'] = $groupId;
        $data['user_id'] = Auth::id();

        GroupPost::create($data);

        return redirect()->back()->with('success', 'Postingan grup berhasil dibuat!');
    }
}
