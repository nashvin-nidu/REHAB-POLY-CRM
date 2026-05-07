'use client';
import { PatientHome } from '@/components/patient/PatientHome';
import { useRouter } from 'next/navigation';

export default function UserHomePage() {
    const router = useRouter();
    return <PatientHome onNavigate={(tab) => {
        if (tab === 'home') router.push('/user');
        else if (tab === 'ai') router.push('/user/chat');
        else router.push(`/user/${tab}`);
    }} />;
}
