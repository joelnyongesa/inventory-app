import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import usePageLoading from '@/hooks/usePageLoading';

function ProfileSkeleton() {
    const fieldRow = (
        <div className="space-y-1">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-9 rounded bg-gray-100" />
        </div>
    );

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div className="animate-pulse bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <div className="max-w-xl space-y-4">
                        <div className="h-5 w-40 rounded bg-gray-200" />
                        <div className="h-3 w-72 rounded bg-gray-100" />
                        {fieldRow}
                        {fieldRow}
                        <div className="h-9 w-20 rounded bg-gray-200" />
                    </div>
                </div>

                <div className="animate-pulse bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <div className="max-w-xl space-y-4">
                        <div className="h-5 w-36 rounded bg-gray-200" />
                        <div className="h-3 w-64 rounded bg-gray-100" />
                        {fieldRow}
                        {fieldRow}
                        {fieldRow}
                        <div className="h-9 w-28 rounded bg-gray-200" />
                    </div>
                </div>

                <div className="animate-pulse bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <div className="max-w-xl space-y-4">
                        <div className="h-5 w-32 rounded bg-gray-200" />
                        <div className="h-3 w-80 rounded bg-gray-100" />
                        <div className="h-3 w-64 rounded bg-gray-100" />
                        <div className="h-9 w-32 rounded bg-red-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    const loading = usePageLoading();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            {loading ? <ProfileSkeleton /> : (
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
            )}
        </AuthenticatedLayout>
    );
}
