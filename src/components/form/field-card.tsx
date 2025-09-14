interface FieldCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function FieldCard({ title, description, children }: FieldCardProps) {
  return (
    <div className="bg-background rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground/80 text-base font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="mt-4 w-full">{children}</div>
    </div>
  );
}
