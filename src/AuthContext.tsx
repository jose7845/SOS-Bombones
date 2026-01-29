
import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    profile: any | null;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            // Verificación instantánea vía metadata
            if (currentUser?.app_metadata?.role === 'admin') {
                setIsAdmin(true);
            }

            // Desactivamos loading inmediatamente para mostrar el Navbar/App
            setLoading(false);

            if (currentUser) {
                fetchProfile(currentUser.id);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            // Verificación instantánea vía metadata
            if (currentUser?.app_metadata?.role === 'admin') {
                setIsAdmin(true);
            } else if (!currentUser) {
                setIsAdmin(false);
            }

            // Desactivamos loading inmediatamente para mostrar el Navbar/App
            setLoading(false);

            if (currentUser) {
                // No usamos await aquí para no bloquear la UI
                fetchProfile(currentUser.id);
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            console.log('Fetching profile for user:', userId);

            // Timeout de 5 segundos
            const { data, error } = await Promise.race([
                supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single(),
                new Promise<any>((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout fetching profile')), 5000)
                )
            ]);

            if (error) {
                console.error("Error fetching profile:", error);
            } else if (data) {
                console.log('Profile loaded:', data);
                setProfile(data);
                setIsAdmin(data.role === 'admin');
            }
        } catch (error) {
            console.error("Error:", error);
        }
        // Nota: ya no seteamos loading a false aquí porque se hace arriba 
        // para dar una respuesta instantánea al usuario
    };

    const signOut = async () => {
        console.log('AuthContext: Iniciando signOut...');
        await supabase.auth.signOut();
        console.log('AuthContext: signOut completado');
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, profile, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
