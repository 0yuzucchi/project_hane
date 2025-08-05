<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NotificationResource\Pages;
use App\Models\Notification;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;

class NotificationResource extends Resource
{
    protected static ?string $model = Notification::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Content Management';
    protected static ?string $navigationLabel = 'Notifications';
    protected static ?string $pluralModelLabel = 'Notifications';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('user_id')
                ->relationship('user', 'name')
                ->label('Recipient')
                ->searchable()
                ->required(),

            TextInput::make('type')
                ->label('Notification Type')
                ->required(),

            Textarea::make('data')
                ->label('Payload (JSON / Text)')
                ->autosize()
                ->nullable(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('user.name')
                ->label('Recipient')
                ->searchable(),

            TextColumn::make('type')
                ->label('Type')
                ->searchable(),

            IconColumn::make('read_at')
                ->label('Read')
                ->boolean(fn ($state) => !is_null($state)),
            TextColumn::make('created_at')->dateTime()->label('Notified At'),
        ])->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNotifications::route('/'),
            'create' => Pages\CreateNotification::route('/create'),
            'edit' => Pages\EditNotification::route('/{record}/edit'),
        ];
    }
}
