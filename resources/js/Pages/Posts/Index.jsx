// import React from 'react';
// import { Link, usePage } from '@inertiajs/react';

// export default function Index() {
//     const { posts, createUrl } = usePage().props;

//     return (
//         <div className="max-w-2xl mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Timeline</h1>
//             <Link href={createUrl} className="bg-blue-600 text-white px-4 py-2 rounded">
//                 Buat Postingan
//             </Link>

//             <div className="mt-6 space-y-4">
//                 {posts.map(post => (
//                     <div key={post.id} className="border p-4 rounded shadow">
//                         <div className="text-sm text-gray-500 mb-1">oleh: {post.user.name}</div>
//                         <p>{post.content}</p>
//                         {post.image && (
//                             <img src={`/storage/${post.image}`} alt="Post" className="mt-2 rounded max-h-60" />
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
