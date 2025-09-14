import { PlusIcon } from 'lucide-react';

type AddContactCardProps = {
  onClick: () => void;
};

export default function AddContactCard({ onClick }: AddContactCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-accent/25 hover:bg-accent/50 hover:border-primary hover:text-primary relative flex cursor-pointer flex-col justify-center gap-4 rounded-lg border border-gray-200 p-4 transition-all duration-300">
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
          <PlusIcon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
