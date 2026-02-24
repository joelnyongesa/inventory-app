export default function ApplicationLogo(props) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Clipboard body */}
            <rect x="6" y="12" width="36" height="32" rx="4" fill="#284B63" />

            {/* Clip tab */}
            <rect x="18" y="6" width="12" height="10" rx="3" fill="#3C6E71" />

            {/* Clip hole */}
            <rect x="21" y="7.5" width="6" height="5" rx="1.5" fill="#eef2f5" />

            {/* Header band (covers base of clip) */}
            <rect x="6" y="15" width="36" height="6" fill="#1d3a50" />

            {/* List row 1 */}
            <circle cx="12" cy="28" r="2" fill="#3C6E71" />
            <rect x="17" y="26.75" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.75)" />

            {/* List row 2 */}
            <circle cx="12" cy="35" r="2" fill="#3C6E71" />
            <rect x="17" y="33.75" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.75)" />

            {/* List row 3 (shorter — in-progress) */}
            <circle cx="12" cy="42" r="2" fill="rgba(60,110,113,0.45)" />
            <rect x="17" y="40.75" width="11" height="2.5" rx="1.25" fill="rgba(255,255,255,0.35)" />
        </svg>
    );
}
