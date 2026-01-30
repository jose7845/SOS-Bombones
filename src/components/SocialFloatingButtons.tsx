import { Instagram, Facebook, Share2, X, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SocialFloatingButtons() {
    const [isOpen, setIsOpen] = useState(false);

    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('key, value');
            if (data) {
                const settingsMap = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
                setSettings(settingsMap);
            }
        };
        fetchSettings();
    }, []);

    const socialLinks = [
        {
            name: 'Ubicación',
            icon: <MapPin className="w-6 h-6" />,
            url: 'https://maps.app.goo.gl/CUySEjNxqB8KPv8C7',
            color: 'bg-[#EA4335] hover:bg-[#d93025]'
        },
        {
            name: 'TikTok',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.82-.74-3.89-1.73-.09-.08-.18-.17-.27-.26V13.5c0 2.2-.51 4.39-1.83 6.16-1.49 2.12-4.04 3.55-6.61 3.73-2.3.16-4.73-.25-6.67-1.59-2.31-1.55-3.66-4.46-3.23-7.24.28-2.22 1.48-4.32 3.33-5.59 1.75-1.2 3.94-1.66 6-1.25.07.02.14.05.21.08V12c-1.41-.45-3.07-.11-4.08.97-1.12 1.2-1.2 3.14-.13 4.41.97 1.2 2.78 1.62 4.16 1.01.99-.44 1.58-1.47 1.59-2.54V0z" />
                </svg>
            ),
            url: settings.tiktok_url || 'https://www.tiktok.com/@s.o.s.bombones',
            color: 'bg-black hover:bg-zinc-800'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            url: `https://wa.me/${settings.whatsapp_number || '5493876856022'}`,
            color: 'bg-[#25D366] hover:bg-[#20bd5a]'
        },
        {
            name: 'Instagram',
            icon: <Instagram className="w-6 h-6" />,
            url: settings.instagram_url || 'https://www.instagram.com/s.o.s.bombones/',
            color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90'
        },
        {
            name: 'Facebook',
            icon: <Facebook className="w-6 h-6" />,
            url: settings.facebook_url || 'https://www.facebook.com/S.O.S.BombonesRegaleDulzura?locale=es_LA',
            color: 'bg-[#1877F2] hover:bg-[#166fe5]'
        }
    ];

    return (
        <div
            className="fixed left-6 bottom-6 z-[9999] flex flex-col-reverse gap-3 items-center group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Main Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 z-10
                    ${isOpen ? 'bg-brand-900 rotate-90' : 'bg-accent-500'}
                `}
                aria-label="Redes Sociales"
            >
                {isOpen ? <X className="w-8 h-8" /> : <Share2 className="w-7 h-7" />}
            </button>

            {/* Social Links Sub-menu */}
            {socialLinks.map((social, index) => (
                <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`
                        w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-500 transform
                        ${isOpen
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-10 opacity-0 scale-0 pointer-events-none'}
                        ${social.color}
                    `}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    aria-label={social.name}
                >
                    {social.icon}
                    {/* Tooltip */}
                    <span className="absolute left-14 bg-white text-brand-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/social:opacity-100 transition-opacity shadow-lg border border-brand-50 pointer-events-none">
                        {social.name}
                    </span>
                </a>
            ))}
        </div>
    );
}
