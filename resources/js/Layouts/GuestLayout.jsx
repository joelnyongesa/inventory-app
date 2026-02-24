import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div
            style={{
                display:        'flex',
                minHeight:      '100vh',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                background:     '#F0F2F5',
                padding:        '24px 16px',
            }}
        >
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <Link href="/">
                    <ApplicationLogo style={{ width: 64, height: 64 }} />
                </Link>
                <p
                    style={{
                        marginTop:     8,
                        fontSize:      11,
                        fontWeight:    700,
                        color:         '#284B63',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                    }}
                >
                    Inventory Management
                </p>
            </div>

            <div
                style={{
                    width:        '100%',
                    maxWidth:     420,
                    background:   '#fff',
                    borderRadius: 10,
                    padding:      '28px 32px',
                    boxShadow:    '0 4px 16px rgba(0,0,0,0.09)',
                }}
            >
                {children}
            </div>
        </div>
    );
}
