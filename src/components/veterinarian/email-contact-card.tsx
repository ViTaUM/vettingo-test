import { MailIcon } from 'lucide-react';
import ChipGroup from '../ui/chips';

type EmailContactCardProps = {
  email: string;
  isPrimary: boolean;
  isPublic: boolean;
};

export default function EmailContactCard({ email, isPrimary, isPublic }: EmailContactCardProps) {
  const chips = [];

  if (isPrimary) chips.push({ label: 'Primário' });
  if (isPublic) chips.push({ label: 'Público' });

  return (
    <div className="hover:bg-accent hover:border-primary hover:text-primary relative flex cursor-pointer flex-col justify-center gap-4 rounded-lg border border-gray-200 p-4 transition-all duration-300">
      <div className="flex items-center gap-2">
        <MailIcon className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">{email}</span>
      </div>
      <ChipGroup chips={chips} />
    </div>
  );
}
