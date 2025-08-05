<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReportResource\Pages;
use App\Models\Report;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Content Management';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('reported_by')
                ->label('Reported By')
                ->relationship('reporter', 'name') // relasi ke user yang melaporkan
                ->required(),

            Select::make('reported_user_id')
                ->label('Reported User')
                ->relationship('reportedUser', 'name') // relasi ke user yang dilaporkan
                ->required(),

            Textarea::make('reason')
                ->label('Reason')
                ->required(),

            Textarea::make('details')
                ->label('Details')
                ->nullable(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('reporter.name')->label('Reported By'),
            TextColumn::make('reportedUser.name')->label('Reported User'),
            TextColumn::make('reason')->limit(50)->label('Reason'),
            TextColumn::make('created_at')->dateTime()->label('Reported At'),

        ])->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReports::route('/'),
            'create' => Pages\CreateReport::route('/create'),
            'edit' => Pages\EditReport::route('/{record}/edit'),
        ];
    }
}
