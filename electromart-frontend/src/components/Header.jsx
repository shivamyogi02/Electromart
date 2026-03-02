import React from 'react'
import { ShoppingCart, Home, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'


export default function Header({ role }) {
const navigate = useNavigate()
function logout() {
localStorage.removeItem('em_user')
navigate('/login')
}
return (
<header className="bg-white shadow sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
<div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(role === 'admin' ? '/admin' : '/user')}>
<img src="/logo.png" alt="Electromart Logo" className="w-8 h-8 rounded" />
<h1 className="text-xl font-bold text-blue-600">Electromart</h1>
</div>


<nav className="flex items-center gap-6">
{role === 'user' && (
<>
<Link to="/user" className="flex items-center gap-1 text-gray-700 hover:text-blue-600"><Home size={18}/>Home</Link>
<Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-blue-600"><ShoppingCart size={18}/>Cart</Link>
</>
)}
<button onClick={logout} className="flex items-center gap-1 text-gray-700 hover:text-red-600"><LogOut size={18}/>Logout</button>
</nav>
</div>
</header>
)
}