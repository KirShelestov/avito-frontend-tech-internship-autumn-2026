import { AvatarImage, AvatarRoot } from './Avatar.styles';

export interface AvatarProps {
  name: string;
  initials?: string;
  src?: string | null;
  size?: number;
  className?: string;
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.slice(0, 2);
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`;
}

export function Avatar({ name, initials, src, size = 36, className }: AvatarProps) {
  const label = initials ?? computeInitials(name);

  return (
    <AvatarRoot $size={size} className={className} title={name}>
      {src ? <AvatarImage src={src} alt={name} /> : <span aria-hidden="true">{label}</span>}
    </AvatarRoot>
  );
}
