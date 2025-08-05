import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import LeftSidebar from '@/Components/LeftSidebar';
import RightSidebar from '@/Components/RightSidebar';
import { Bars3Icon, UserPlusIcon, CheckIcon, XMarkIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/solid';

// 1. Impor SweetAlert2
import Swal from 'sweetalert2';

// Komponen Tombol Aksi untuk Pencarian Pengguna
function SearchUserActionButton({ user, onAdd }) {
    const { auth } = usePage().props;
    if (user.friendship_status === 'pending' && user.request_sent_by === auth.user.id) {
        return (
            <button disabled className="flex items-center gap-1.5 text-sm bg-stone-200 text-stone-600 font-bold px-3 py-1.5 rounded-full cursor-not-allowed">
                <ClockIcon className="h-4 w-4" /> Pending
            </button>
        );
    }
    return (
        <button type="button" onClick={(e) => { e.stopPropagation(); onAdd(user.id); }} className="flex items-center gap-1.5 text-sm bg-blue-600 text-white font-bold px-3 py-1.5 rounded-full hover:bg-blue-700">
            <UserPlusIcon className="h-4 w-4" /> Tambah
        </button>
    );
}

// Komponen Kartu Pengguna yang bisa diklik
function UserCard({ user, children }) {
    if (!user) {
        return <div className="p-4 border-b border-stone-200">Data tidak valid.</div>;
    }

    const profileUrl = user.username 
        ? `/profile/${user.username}` 
        : `/profile/id/${user.id}`;
        
    // Fungsi untuk navigasi
    const handleNavigate = () => {
        router.get(profileUrl);
    };

    return (
        // Ganti <Link> dengan <div>. Tambahkan onClick dan cursor-pointer.
        <div onClick={handleNavigate} className="w-full text-left cursor-pointer">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-stone-200 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex-shrink-0">
                        {user.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt={user.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-stone-200 flex items-center justify-center">
                                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-stone-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-stone-800 truncate">{user.name}</p>
                        <p className="text-sm text-stone-500 truncate">@{user.username || 'user'}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                    {children}
                </div>
            </div>
        </div>
    );
}


export default function FriendshipIndex({ pending, friends, myGroups, recommendedGroups }) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsSearching(true);
        setHasSearched(true);
        try {
            const response = await fetch(`/search-users?query=${query}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Gagal mencari pengguna', error);
        } finally {
            setIsSearching(false);
        }
    };

    const sendRequest = (userId) => {
        router.post(`/friend-request/${userId}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setResults((prev) =>
                    prev.map((user) =>
                        user.id === userId
                            ? { ...user, friendship_status: 'pending', request_sent_by: auth.user.id }
                            : user
                    )
                );
            }
        });
    };

    const handleAccept = (friendshipId, userName) => {
        router.post(`/friend-response/${friendshipId}`, { status: 'accepted' }, { 
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Anda sekarang berteman dengan ${userName}`,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        });
    };

    const handleDecline = (friendshipId, userName) => {
        Swal.fire({
            title: 'Tolak Permintaan?',
            text: `Anda akan menolak permintaan pertemanan dari ${userName}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'Ya, tolak',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/friend-response/${friendshipId}`, { status: 'declined' }, { preserveScroll: true });
            }
        });
    };
    
    const handleRemove = (friendId, friendName) => {
        Swal.fire({
            title: 'Hapus Pertemanan?',
            text: `Anda yakin ingin menghapus ${friendName} dari daftar teman?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'Ya, hapus pertemanan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/friend-remove/${friendId}`, { 
                    preserveScroll: true,
                    onSuccess: () => {
                         Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'info',
                            title: 'Pertemanan telah dihapus.',
                            showConfirmButton: false,
                            timer: 3000,
                        });
                    }
                });
            }
        });
    };

    const tabs = [
        { id: 'friends', label: `Daftar Teman (${friends.length})` },
        { id: 'pending', label: `Permintaan (${pending.length})` },
        { id: 'search', label: 'Cari Teman' },
    ];

    return (
        <div className="bg-light-bg min-h-screen text-stone-800">
            <div className="flex w-full max-w-screen-xl mx-auto">
                <LeftSidebar auth={auth} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 w-full lg:ml-24 xl:ml-80">
                    <main className="w-full max-w-none lg:max-w-[600px] min-h-screen border-x-0 lg:border-x border-stone-200">
                        <div className="sticky top-0 bg-light-bg/80 backdrop-blur-md z-10 px-4 py-3 border-b border-stone-200 flex items-center gap-4">
                            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 rounded-full"><Bars3Icon className="h-6 w-6" /></button>
                            <h1 className="text-xl font-bold">Pertemanan</h1>
                        </div>

                        <div className="border-b border-stone-200">
                            <nav className="flex">
                                {tabs.map(tab => (
                                    <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 text-center font-bold p-3 text-sm sm:text-base hover:bg-stone-100 transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-stone-500'}`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        <div>
                            {activeTab === 'friends' && (
                                <div>
                                    {friends.length === 0 ? (
                                        <p className="p-4 text-stone-500 text-center">Anda belum memiliki teman.</p>
                                    ) : (
                                        friends.map(friendship => (
                                            <UserCard key={friendship.id} user={friendship.friend}>
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleRemove(friendship.friend.id, friendship.friend.name); 
                                                    }} 
                                                    className="flex items-center gap-1.5 text-sm text-red-600 font-semibold px-3 py-1.5 rounded-full hover:bg-red-50"
                                                >
                                                    <TrashIcon className="h-4 w-4" /> Hapus
                                                </button>
                                            </UserCard>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'pending' && (
                                <div>
                                    {pending.length === 0 ? (
                                        <p className="p-4 text-stone-500 text-center">Tidak ada permintaan pertemanan.</p>
                                    ) : (
                                        pending.map(request => (
                                            <UserCard key={request.id} user={request.user}>
                                                <div className="flex gap-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleAccept(request.id, request.user.name); 
                                                        }} 
                                                        className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                                                    >
                                                        <CheckIcon className="h-5 w-5"/>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleDecline(request.id, request.user.name); 
                                                        }} 
                                                        className="p-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200"
                                                    >
                                                        <XMarkIcon className="h-5 w-5"/>
                                                    </button>
                                                </div>
                                            </UserCard>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'search' && (
                                <div>
                                    <form onSubmit={handleSearch} className="flex gap-2 p-4 border-b border-stone-200">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Cari nama atau username..."
                                            className="w-full bg-stone-100 text-stone-800 border-stone-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button type="submit" disabled={isSearching} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50">
                                            {isSearching ? '...' : 'Cari'}
                                        </button>
                                    </form>

                                    {isSearching && <p className="p-4 text-center text-stone-500">Mencari...</p>}
                                    {!isSearching && hasSearched && results.length === 0 && <p className="p-4 text-center text-stone-500">Pengguna tidak ditemukan.</p>}
                                    
                                    {results.map(user => (
                                        <UserCard key={user.id} user={user}>
                                            <SearchUserActionButton user={user} onAdd={sendRequest} />
                                        </UserCard>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                <RightSidebar myGroups={myGroups} recommendedGroups={recommendedGroups} />
            </div>
        </div>
    );
}