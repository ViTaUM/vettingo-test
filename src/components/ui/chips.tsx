type ChipProps = {
  label: string;
};

type ChipGroupProps = {
  chips: ChipProps[];
};

function Chip({ label }: ChipProps) {
  return <div className="bg-accent border-primary text-primary rounded-full border px-2 py-1 text-xs">{label}</div>;
}

export default function ChipGroup({ chips }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Chip key={chip.label} {...chip} />
      ))}
    </div>
  );
}
