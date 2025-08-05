<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MessageResource\Pages;
use App\Models\Message;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class MessageResource extends Resource
{
    protected static ?string $model = Message::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Communication';
    protected static ?string $navigationLabel = 'Messages';
    protected static ?string $pluralModelLabel = 'Messages';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('sender_id')
                ->relationship('sender', 'name')
                ->label('Sender')
                ->required(),

            Select::make('receiver_id')
                ->relationship('receiver', 'name')
                ->label('Receiver')
                ->required(),

            Textarea::make('message')
                ->label('Message Content')
                ->required()
                ->autosize(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('sender.name')
                ->label('Sender')
                ->searchable(),

            TextColumn::make('receiver.name')
                ->label('Receiver')
                ->searchable(),

            TextColumn::make('message')
                ->label('Message')
                ->limit(80)
                ->wrap(),

            TextColumn::make('created_at')->dateTime()->label('Sent At'),
        ])->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            // Add RelationManagers if needed
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMessages::route('/'),
            'create' => Pages\CreateMessage::route('/create'),
            'edit' => Pages\EditMessage::route('/{record}/edit'),
        ];
    }
}
