import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
const Settings = () => {
  redirect('/dashboard/settings/security');
};

export default Settings;
