
import React, { useState } from 'react';
import { useAuth } from '../contexts/AppContext';
import { AcademicCapIcon, GoogleIcon } from './Icons';

const InputField: React.FC<{ id: string, type: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, autoComplete?: string }> = ({ id, type, label, value, onChange, required = true, autoComplete }) => (
    <div className="relative">
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={onChange} 
            className="peer bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg block w-full p-3 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" 
            required={required} 
            placeholder={label}
            autoComplete={autoComplete}
        />
        <label 
            htmlFor={id} 
            className="absolute left-3 -top-2.5 text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-slate-800/60 px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:dark:bg-slate-800/60"
        >
            {label}
        </label>
    </div>
);

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loading, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateRegistration = () => {
        if (!fullName.trim()) return "Full Name is required.";
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return "Please enter a valid email.";
        if (password.length < 6) return "Password must be at least 6 characters long.";
        if (!mobile.match(/^\d{10,15}$/)) return "Please enter a valid mobile number (10-15 digits).";
        if (!address.trim()) return "Address is required.";
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
            const err = await login(email, password);
            if (err) setError(err);
        } else {
            const validationError = validateRegistration();
            if (validationError) {
                setError(validationError);
                return;
            }
            const err = await register(fullName, email, password, mobile, address);
            if (err) setError(err);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const err = await loginWithGoogle();
        if (err) setError(err);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md p-8 space-y-5 bg-white rounded-xl shadow-lg dark:bg-slate-800/60 dark:backdrop-blur-sm dark:border dark:border-slate-700">
                <div className="text-center">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {isLogin ? "Sign in to access your dashboard" : "Get started with your new account"}
                    </p>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <InputField id="fullName" type="text" label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
                            <InputField id="mobile" type="tel" label="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} autoComplete="tel" />
                            <InputField id="address" type="text" label="Address" value={address} onChange={e => setAddress(e.target.value)} autoComplete="street-address" />
                        </>
                    )}
                    <InputField id="email" type="email" label="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                    <InputField id="password" type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} />

                    {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
                    
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300">
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center py-3 px-4 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <GoogleIcon className="h-5 w-5 mr-3" />
                        Sign in with Google
                    </button>
                </div>
                
                <div className="text-sm text-center">
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};