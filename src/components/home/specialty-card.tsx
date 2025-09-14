import SpotlightCard from '../ui/spotlight-card';

interface SpecialtyCardProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  count?: string;
  color: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hoverBg: 'group-hover:bg-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hoverBg: 'group-hover:bg-green-600',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hoverBg: 'group-hover:bg-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    hoverBg: 'group-hover:bg-red-600',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    hoverBg: 'group-hover:bg-yellow-600',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-700',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    hoverBg: 'group-hover:bg-indigo-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    hoverBg: 'group-hover:bg-pink-600',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    hoverBg: 'group-hover:bg-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
};

export default function SpecialtyCard(props: SpecialtyCardProps) {
  const colors = colorVariants[props.color as keyof typeof colorVariants] || colorVariants.blue;

  return (
    <SpotlightCard
      className="border border-gray-200 bg-white text-center transition-all duration-300"
      spotlightColor={props.color}>
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${colors.bg} ${colors.text} ${colors.hoverBg} group-hover:text-white`}>
        <props.icon className="h-7 w-7" />
      </div>

      <h3 className="mb-2 text-lg font-bold text-gray-900">{props.name}</h3>
      <p className="mb-3 text-sm text-gray-600">{props.description}</p>

      {props.count && (
        <div
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors.badgeBg} ${colors.badgeText}`}>
          {props.count}
        </div>
      )}
    </SpotlightCard>
  );
}
