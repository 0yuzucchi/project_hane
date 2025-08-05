<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InterestResource\Pages;
use App\Models\Interest;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class InterestResource extends Resource
{
    protected static ?string $model = Interest::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Content Management'; // opsional

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')
                ->label('Interest Name')
                ->required()
                ->maxLength(255),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')
                ->label('Interest')
                ->sortable()
                ->searchable(),
            TextColumn::make('created_at')->dateTime()->label('Notified At'),
        ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInterests::route('/'),
            'create' => Pages\CreateInterest::route('/create'),
            'edit' => Pages\EditInterest::route('/{record}/edit'),
        ];
    }
}
