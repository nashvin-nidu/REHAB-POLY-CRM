import { PhoneFrame } from '@/components/patient/PhoneFrame';

export default function PatientApp() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden text-adm-text antialiased font-sora bg-pat-bg">
      <PhoneFrame />
    </div>
  );
}
