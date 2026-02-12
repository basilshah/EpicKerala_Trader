import Link from 'next/link';

interface LogoProps {
  /**
   * Size variant for the logo
   * - 'sm': Suitable for navbar (smaller)
   * - 'lg': Suitable for footer (larger)
   */
  size?: 'sm' | 'lg';
  /**
   * Whether the logo should be a clickable link
   */
  linkable?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
}

export default function Logo({ size = 'sm', linkable = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: {
      image: 'h-16 w-auto',
      title: 'text-2xl',
      subtitle: 'text-[10px] tracking-[0.25em]',
    },
    lg: {
      image: 'h-24 w-auto',
      title: 'text-3xl',
      subtitle: 'text-[12px] tracking-[0.3em]',
    },
  };

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/epicLandLogo.webp"
        alt="Epic Kerala"
        className={`${sizeClasses[size].image} rounded-full`}
      />
      <div className="flex flex-col leading-none justify-center">
        <span className={`${sizeClasses[size].title} font-extrabold tracking-tighter text-current`}>
          EPIC <span className="text-secondary font-light">LAND</span>
        </span>
        <span
          className={`${sizeClasses[size].subtitle} text-current opacity-60 uppercase font-medium pl-0.5`}
        >
          Kerala&apos;s Finest
        </span>
      </div>
    </div>
  );

  if (linkable) {
    return (
      <Link href="/" className="group">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
