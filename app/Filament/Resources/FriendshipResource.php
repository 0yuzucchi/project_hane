<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FriendshipResource\Pages;
use App\Models\Friendship;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;


class FriendshipResource extends Resource
{
    protected static ?string $model = Friendship::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = 'User Management';


    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('user_id')
                ->relationship('user', 'name')
                ->required(),

            Select::make('friend_id')
                ->relationship('friend', 'name')
                ->required(),

            Select::make('status')
                ->options([
                    'pending' => 'Pending',
                    'accepted' => 'Accepted',
                    'blocked' => 'Blocked',
                ])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('User')->searchable(),
                TextColumn::make('friend.name')->label('Friend')->searchable(),
                BadgeColumn::make('status')->colors([
                    'pending' => 'warning',
                    'accepted' => 'success',
                    'blocked' => 'danger',
                ]),
            ])
            ->defaultSort('id', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFriendships::route('/'),
            'create' => Pages\CreateFriendship::route('/create'),
            'edit' => Pages\EditFriendship::route('/{record}/edit'),
        ];
    }
}
