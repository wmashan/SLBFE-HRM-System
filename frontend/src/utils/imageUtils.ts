/**
 * Image utility functions for handling profile pictures and other images
 */

/**
 * Get full image URL from relative path
 * @param relativePath - Relative path from backend (e.g., /uploads/profiles/image.jpg)
 * @returns Full URL to the image or undefined if no path provided
 */
export const getImageUrl = (relativePath?: string): string | undefined => {
  if (!relativePath) return undefined;
  
  // If already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Get backend base URL
  // In development: http://localhost:5001
  // In production: should be configured to match your backend URL
  const backendUrl = 'http://localhost:5001';
  
  // Ensure relative path starts with /
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${backendUrl}${path}`;
};

/**
 * Get placeholder image URL based on name initials
 * @param name - Full name for generating avatar placeholder
 * @returns Data URL for placeholder image
 */
export const getPlaceholderAvatar = (name: string): string => {
  // Generate a color based on the name
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-red-500 to-pink-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-purple-600',
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Handle image load error with fallback
 * @param event - Image error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  img.style.display = 'none';
  
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <svg class="w-full h-full p-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    `;
  }
};
