import React from 'react';
import Image from 'next/image';

export type NusantaraIconType =
  | 'angklung-note'
  | 'wayang-user'
  | 'joglo-home'
  | 'anyaman-wallet'
  | 'melati-heart'
  | 'gamelan-icon'
  | 'mahkota-crown';

interface NusantaraIconProps {
  icon: NusantaraIconType;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * NusantaraIcon Component
 * Displays custom Indonesian cultural icons
 *
 * @example
 * <NusantaraIcon icon="angklung-note" size={24} />
 * <NusantaraIcon icon="wayang-user" size={32} color="var(--color-emas-nusantara)" />
 */
export const NusantaraIcon: React.FC<NusantaraIconProps> = ({
  icon,
  size = 24,
  className = '',
  color,
}) => {
  const iconPath = `/assets/icons/nusantara/${icon}.svg`;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: color
      }}
    >
      <Image
        src={iconPath}
        alt={icon}
        width={size}
        height={size}
        className="w-full h-full"
        style={{ filter: color ? `drop-shadow(0 0 2px ${color})` : undefined }}
      />
    </div>
  );
};

export default NusantaraIcon;
