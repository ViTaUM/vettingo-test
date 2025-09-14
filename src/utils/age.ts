export function calculateAge(birthDate: Date): { years: number; months: number } {
  const today = new Date();
  const birth = new Date(birthDate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
}

export function formatAge(birthDate: Date): string {
  const { years, months } = calculateAge(birthDate);

  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'}, ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

export function getAgeInMonths(birthDate: Date): number {
  const { years, months } = calculateAge(birthDate);
  return years * 12 + months;
}
