import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Banknote, Users, CreditCard, ArrowLeftRight, Building, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Usuarios', href: '/usuarios', icon: Users },
    { name: 'Cuentas', href: '/cuentas', icon: Banknote },
    { name: 'Transacciones', href: '/transacciones', icon: ArrowLeftRight },
    { name: 'Tarjetas', href: '/tarjetas', icon: CreditCard },
    { name: 'Préstamos', href: '/prestamos', icon: CreditCard },
    { name: 'Sucursales', href: '/sucursales', icon: Building },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Sistema Bancario</h1>
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;