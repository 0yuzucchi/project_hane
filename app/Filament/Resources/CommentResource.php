<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CommentResource\Pages;
use App\Models\Comment;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class CommentResource extends Resource
{
    protected static ?string $model = Comment::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-ellipsis';

    protected static ?string $navigationLabel = 'Comments';
    protected static ?string $pluralModelLabel = 'Comments';
    protected static ?string $navigationGroup = 'Content Management';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('post_id')
                ->relationship('post', 'content') // <- ganti ke kolom yg benar
                ->label('Post')
                ->searchable()
                ->required(),

            Select::make('user_id')
                ->relationship('user', 'name')
                ->label('User')
                ->searchable()
                ->required(),

            Textarea::make('body')
                ->label('Comment Content')
                ->required()
                ->autosize(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable(),

                TextColumn::make('post.content') // <- ganti juga di sini
                    ->label('Post')
                    ->limit(30)
                    ->searchable(),

                TextColumn::make('body')
                    ->limit(50)
                    ->label('Comment')
                    ->toggleable(),

                TextColumn::make('created_at')->dateTime()->label('Commented At'),

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
            'index' => Pages\ListComments::route('/'),
            'create' => Pages\CreateComment::route('/create'),
            'edit' => Pages\EditComment::route('/{record}/edit'),
        ];
    }
}
