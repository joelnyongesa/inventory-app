import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, post, processing, errors } = useForm({
        email:    'joel@inventoryapp.com',
        password: 'Inventory@2025',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div
                style={{
                    background:   '#e6f4ff',
                    border:       '1px solid #91caff',
                    borderRadius: 6,
                    padding:      '10px 14px',
                    marginBottom: 20,
                    fontSize:     13,
                    color:        '#0958d9',
                    lineHeight:   1.5,
                }}
            >
                Demo credentials are pre-filled. Click <strong>Log in</strong> to explore the app.
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        readOnly
                        style={{ background: '#fafafa', cursor: 'default' }}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        readOnly
                        style={{ background: '#fafafa', cursor: 'default' }}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
