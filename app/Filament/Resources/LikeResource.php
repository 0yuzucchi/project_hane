<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LikeResource\Pages;
use App\Models\Like;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class LikeResource extends Resource
{
    protected static ?string $model = Like::class;

    protected static ?string $navigationIcon = 'heroicon-o-heart';
    protected static ?string $navigationGroup = 'Content Management';
    protected static ?string $navigationLabel = 'Likes';
    protected static ?string $pluralModelLabel = 'Likes';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('user_id')
                ->relationship('user', 'name')
                ->label('User')
                ->searchable()
                ->required(),

            Select::make('post_id')
                ->relationship('post', 'content')
                ->label('Post')
                ->searchable()
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('user.name')
                ->label('User')
                ->searchable(),

            TextColumn::make('post.content')
                ->label('Post Content')
                ->limit(50)
                ->searchable(),
        ])
        ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLikes::route('/'),
            'create' => Pages\CreateLike::route('/create'),
            'edit' => Pages\EditLike::route('/{record}/edit'),
        ];
    }
}
