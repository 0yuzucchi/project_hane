<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GroupResource\Pages;
use App\Models\Group;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\Select;

class GroupResource extends Resource
{
    protected static ?string $model = Group::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'User Management';
    protected static ?string $navigationLabel = 'Groups';
    protected static ?string $pluralModelLabel = 'Groups';


    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')
                ->label('Group Name')
                ->required()
                ->maxLength(255),

            Textarea::make('description')
                ->label('Description')
                ->autosize(),

            Select::make('owner_id')
                ->relationship('owner', 'name') // asumsikan relasinya sudah didefinisikan di model Group
                ->label('Owner')
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')
                ->label('Group Name')
                ->searchable(),

            TextColumn::make('description')
                ->label('Description')
                ->limit(50)
                ->toggleable(),
            
                TextColumn::make('created_at')->dateTime()->label('Created At'),
        ])
            ->defaultSort('name');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListGroups::route('/'),
            'create' => Pages\CreateGroup::route('/create'),
            'edit' => Pages\EditGroup::route('/{record}/edit'),
        ];
    }
}
