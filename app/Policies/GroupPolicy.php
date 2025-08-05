<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;

class GroupPolicy
{
    /**
     * Hanya pemilik group (owner) yang boleh update.
     */
    public function update(User $user, Group $group): bool
    {
        return $user->id === $group->owner_id;
    }

    /**
     * Hanya pemilik group yang boleh delete.
     */
    public function delete(User $user, Group $group): bool
    {
        return $user->id === $group->owner_id;
    }
}
