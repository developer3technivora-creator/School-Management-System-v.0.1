import React, { useState } from 'react';
import { useAuth } from '../contexts/AppContext';
import { AcademicCapIcon, GoogleIcon } from './Icons';

const InputField: React.FC<{ 
    id: string, 
    type: string, 
    label: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    required?: boolean, 
    autoComplete?: string,
    hasError?: boolean 
}> = ({ id, type, label, value, onChange, required = true, autoComplete, hasError }) => {
    const baseInputClasses = "peer bg-slate-100/50 dark:bg-slate-800/50 border text-slate-900 dark:text-white text-sm rounded-lg block w-full p-3 placeholder-transparent focus:outline-none focus:ring-2 transition-colors";
    const errorInputClasses = "border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500";
    const normalInputClasses = "border-slate-300 dark:border-slate-700 focus:ring-blue-500/50 focus:border-blue-500";
    
    const baseLabelClasses = "absolute left-3 -top-2.5 text-xs bg-white dark:bg-slate-800/60 px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:dark:bg-slate-800/60";
    const errorLabelClasses = "text-red-600 dark:text-red-500 peer-focus:text-red-500";
    const normalLabelClasses = "text-slate-500 dark:text-slate-400 peer-focus:text-blue-500";

    return (
        <div className="relative">
            <input 
                type={type} 
                id={id} 
                value={value} 
                onChange={onChange} 
                className={`${baseInputClasses} ${hasError ? errorInputClasses : normalInputClasses}`}
                required={required} 
                placeholder={label}
                autoComplete={autoComplete}
            />
            <label 
                htmlFor={id} 
                className={`${baseLabelClasses} ${hasError ? errorLabelClasses : normalLabelClasses}`}
            >
                {label}
            </label>
        </div>
    );
};

export const AuthPage: React.FC = () => {
    type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetSent';
    const [view, setView] = useState<AuthView>('login');
    const { login, register, loading, loginWithGoogle, resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const validateRegistration = () => {
        if (!fullName.trim()) return "Full Name is required.";
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return "Please enter a valid email.";
        if (password.length < 6) return "Password must be at least 6 characters long.";
        if (!mobile.match(/^\d{10,15}$/)) return "Please enter a valid mobile number (10-15 digits).";
        if (!address.trim()) return "Address is required.";
        return null;
    }

    const clearFormState = () => {
        setError(null);
        setMessage(null);
        setEmail('');
        setPassword('');
        setFullName('');
        setMobile('');
        setAddress('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (view === 'login') {
            const err = await login(email, password);
            if (err) setError(err);
        } else if (view === 'register') {
            const validationError = validateRegistration();
            if (validationError) {
                setError(validationError);
                return;
            }
            const err = await register(fullName, email, password, mobile, address);
            if (err) {
                setError(err)
            } else {
                setMessage("Registration successful! Please check your email to verify your account.");
                setView('login'); // or a new 'verificationSent' view
            }
        } else if (view === 'forgotPassword') {
            if (!email) {
                setError("Please enter your email address.");
                return;
            }
            const res = await resetPassword(email);
            if (res.error) {
                setError(res.message);
            } else {
                setMessage(res.message);
                setView('resetSent');
            }
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const err = await loginWithGoogle();
        if (err) setError(err);
    }
    
    const renderTitle = () => {
        switch(view) {
            case 'login': return 'Welcome Back';
            case 'register': return 'Create Account';
            case 'forgotPassword': return 'Reset Password';
            case 'resetSent': return 'Check Your Email';
        }
    }
    
    const renderSubtitle = () => {
        switch(view) {
            case 'login': return 'Sign in to access your dashboard';
            case 'register': return 'Get started with your new account';
            case 'forgotPassword': return 'Enter your email to receive a password reset link.';
            case 'resetSent': return message;
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md p-8 space-y-5 bg-white rounded-xl shadow-lg dark:bg-slate-800/60 dark:backdrop-blur-sm dark:border dark:border-slate-700">
                <div className="text-center">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {renderTitle()}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {renderSubtitle()}
                    </p>
                </div>
                
                {view !== 'resetSent' && (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {view === 'register' && (
                            <>
                                <InputField id="fullName" type="text" label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" hasError={!!error && error.includes("Name")} />
                                <InputField id="mobile" type="tel" label="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} autoComplete="tel" hasError={!!error && error.includes("mobile")} />
                                <InputField id="address" type="text" label="Address" value={address} onChange={e => setAddress(e.target.value)} autoComplete="street-address" hasError={!!error && error.includes("Address")} />
                            </>
                        )}
                        
                        {(view === 'login' || view === 'register' || view === 'forgotPassword') && (
                            <InputField id="email" type="email" label="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" hasError={!!error && (error.includes("email") || error.includes("credentials"))} />
                        )}

                        {(view === 'login' || view === 'register') && (
                            <InputField id="password" type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={view === 'login' ? "current-password" : "new-password"} hasError={!!error && (error.includes("Password") || error.includes("credentials"))} />
                        )}
                        
                        {view === 'login' && (
                            <div className="text-right text-sm">
                                <button type="button" onClick={() => { setView('forgotPassword'); clearFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
                        
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    view === 'login' ? 'Sign In' : view === 'register' ? 'Register' : 'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {(view === 'login' || view === 'register') && (
                    <>
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
                    </>
                )}
                
                <div className="text-sm text-center">
                    {view === 'login' && (
                        <button onClick={() => { setView('register'); clearFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                            Don't have an account? Sign Up
                        </button>
                    )}
                    {(view === 'register' || view === 'forgotPassword' || view === 'resetSent') && (
                        <button onClick={() => { setView('login'); clearFormState(); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                            Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
