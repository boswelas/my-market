import { redirect } from 'next/navigation';

export default function HomePage() {
    redirect('/home');
    return null;
}