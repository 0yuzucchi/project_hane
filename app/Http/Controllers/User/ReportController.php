<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request, User $user)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        Report::create([
            'reported_by' => Auth::id(),
            'reported_user_id' => $user->id,
            'reason' => $request->reason,
            'details' => $request->details,
        ]);

        return back()->with('message', 'Laporan berhasil dikirim.');
    }
}
