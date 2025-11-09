import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, type RegisterData } from '../services/authService';

interface RegisterFormData extends RegisterData {
  ConfirmPassword: string;
}
const Register = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        Email: '',
        Nombre: '',
        DNI: '',
        Direccion: '',
        Telefono: '',
        IdSucursal: 1, // Valor por defecto, podrías obtenerlo de un selector
        PasswordHash: '',
        ConfirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'IdSucursal' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (formData.PasswordHash !== formData.ConfirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.PasswordHash.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setIsLoading(true);
            // Extraemos ConfirmPassword ya que no lo necesitamos en el backend
            const { ConfirmPassword, ...registerData } = formData;

            const response = await authService.register(registerData);

            if (response.error) {
                setError(response.error);
            } else {
                // Redirigir al login después de un registro exitoso
                navigate('/login', { state: { success: '¡Registro exitoso! Por favor inicia sesión.' } });
            }
        } catch (error: any) {
            setError(error.message || 'Error al registrar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Crear una cuenta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Completa el formulario para registrarte
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md" role="alert">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre completo *
                                </label>
                                <input
                                    id="Nombre"
                                    name="Nombre"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="Juan Pérez"
                                    value={formData.Nombre}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo electrónico *
                                </label>
                                <input
                                    id="Email"
                                    name="Email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="DNI" className="block text-sm font-medium text-gray-700 mb-1">
                                    DNI *
                                </label>
                                <input
                                    id="DNI"
                                    name="DNI"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="12345678"
                                    value={formData.DNI}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="Telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono *
                                </label>
                                <input
                                    id="Telefono"
                                    name="Telefono"
                                    type="tel"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="+54 9 11 1234-5678"
                                    value={formData.Telefono}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="Direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección *
                                </label>
                                <input
                                    id="Direccion"
                                    name="Direccion"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="Calle Falsa 123"
                                    value={formData.Direccion}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="IdSucursal" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sucursal *
                                </label>
                                <select
                                    id="IdSucursal"
                                    name="IdSucursal"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    value={formData.IdSucursal}
                                    onChange={(e) => setFormData({ ...formData, IdSucursal: parseInt(e.target.value) })}
                                    disabled={isLoading}
                                >
                                    <option value="1">Sucursal Central</option>
                                    <option value="2">Sucursal Norte</option>
                                    <option value="3">Sucursal Sur</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="PasswordHash" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña *
                                </label>
                                <input
                                    id="PasswordHash"
                                    name="PasswordHash"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="••••••••"
                                    value={formData.PasswordHash}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar contraseña *
                                </label>
                                <input
                                    id="ConfirmPassword"
                                    name="ConfirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="••••••••"
                                    value={formData.ConfirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02] transition-all duration-200'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
