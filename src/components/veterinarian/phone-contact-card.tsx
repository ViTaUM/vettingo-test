import { PhoneIcon } from 'lucide-react';
import ChipGroup from '../ui/chips';

type PhoneContactCardProps = {
  phone: string;
  isPrimary: boolean;
  isWhatsApp: boolean;
  isPublic: boolean;
};

export default function PhoneContactCard({ phone, isPrimary, isWhatsApp, isPublic }: PhoneContactCardProps) {
  const chips = [];

  if (isPrimary) chips.push({ label: 'Primário' });
  if (isWhatsApp) chips.push({ label: 'WhatsApp' });
  if (isPublic) chips.push({ label: 'Público' });

  return (
    <div className="hover:bg-accent hover:border-primary hover:text-primary relative flex cursor-pointer flex-col justify-center gap-4 rounded-lg border border-gray-200 p-4 transition-all duration-300">
      <div className="flex items-center gap-2">
        <PhoneIcon className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">{phone}</span>
      </div>
      <ChipGroup chips={chips} />
    </div>
  );
}
