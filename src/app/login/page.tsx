'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<boolean>(false);

    const handleLogin = () => {
        if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
            document.cookie = `site_access=${password}; path=/;`;
            redirect('/'); // Redirect to the home page
        } else {
            setError(true);
            toast('Incorrect password', {
                description: 'Please enter the correct password to access the site.',
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className='bg-white p-8 rounded-lg shadow-lg w-11/12 flex flex-col'>
                <h1>Login</h1>
                <div className="flex flex-row gap-4 ">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        placeholder="Enter password"
                        className={error ? 'border-red-500 border-2' : ''}
                    />
                    <Button onClick={handleLogin}>Login</Button>
                </div>
            </div>
        </div>
    );
}