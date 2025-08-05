<?php

namespace App\Filament\Resources\FriendshipResource\Pages;

use App\Filament\Resources\FriendshipResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFriendship extends EditRecord
{
    protected static string $resource = FriendshipResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
