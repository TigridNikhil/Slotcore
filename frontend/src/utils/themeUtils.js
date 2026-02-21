/**
 * Simple helper to update CSS variables for the organization's theme.
 */
export const applyTheme = (primaryColor) => {
  if (!primaryColor) return;

  const root = document.documentElement;

  // Set the main brand color
  root.style.setProperty("--org-primary", primaryColor);

  // Generate some variations based on opacity/alpha for now (fast & standard)
  root.style.setProperty("--org-primary-50", `${primaryColor}10`); // 6% opacity approx
  root.style.setProperty("--org-primary-100", `${primaryColor}20`);
  root.style.setProperty("--org-primary-200", `${primaryColor}40`);
  root.style.setProperty("--org-primary-300", `${primaryColor}70`);
  root.style.setProperty("--org-primary-400", `${primaryColor}a0`);
  root.style.setProperty("--org-primary-500", primaryColor); // Main
  root.style.setProperty("--org-primary-600", primaryColor); // Usually similar to 500 in this context

  // For dark shades we might need manual darkening or just use the color itself
  root.style.setProperty("--org-primary-700", primaryColor);
  root.style.setProperty("--org-primary-800", primaryColor);
  root.style.setProperty("--org-primary-900", primaryColor);
};
