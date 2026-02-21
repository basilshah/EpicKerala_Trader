export const colorPalette = {
  // Primary navigation colors - using theme colors
  nav: {
    active: {
      text: 'text-primary',
      underline: 'bg-primary',
    },
    inactive: {
      text: 'text-slate-600',
      hover: 'hover:text-foreground',
    },
    signOut: {
      hover: {
        bg: 'hover:bg-red-50',
        border: 'hover:border-red-300',
        text: 'hover:text-red-600',
      },
    },
  },

  // Dashboard stat cards - using theme colors
  stats: {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      iconBg: 'bg-primary',
      border: 'border-primary',
    },
    secondary: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      iconBg: 'bg-secondary',
      border: 'border-secondary',
    },
    success: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-500',
      border: 'border-emerald-500',
    },
    warning: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      iconBg: 'bg-orange-500',
      border: 'border-orange-500',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      iconBg: 'bg-yellow-500',
      border: 'border-yellow-500',
    },
  },

  // Common UI colors
  card: {
    bg: 'bg-card',
    border: 'border-border',
    shadow: 'shadow-md',
    shadowHover: 'hover:shadow-lg',
    shadowSelected: 'shadow-lg',
  },

  // Text colors - using darker colors for better visibility
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-700',
    tertiary: 'text-slate-600',
  },

  // Badge colors
  badge: {
    active: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
    },
    draft: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
    },
    approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
    },
  },
};
