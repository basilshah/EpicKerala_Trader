'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface CategorySubLinkProps {
  href: string;
  children: ReactNode;
}

export function CategorySubLink({ href, children }: CategorySubLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <div onClick={handleClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  );
}
