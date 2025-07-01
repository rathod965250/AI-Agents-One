/**
 * Utility functions for managing agent logos in Supabase storage
 */

const SUPABASE_URL = "https://uilnynmclpohscpsequg.supabase.co";
const BUCKET_NAME = "agent-logos";

/**
 * Generate a logo URL for an agent
 * @param filename - The filename in the agent-logos bucket
 * @returns The full public URL to the logo
 */
export const generateLogoUrl = (filename: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
};

/**
 * Generate a standardized logo filename for an agent
 * @param agentSlug - The agent's slug
 * @param extension - File extension (default: 'png')
 * @returns Standardized filename
 */
export const generateLogoFilename = (agentSlug: string, extension: string = 'png'): string => {
  return `${agentSlug}-logo.${extension}`;
};

/**
 * Get the full logo URL for an agent
 * @param agentSlug - The agent's slug
 * @param extension - File extension (default: 'png')
 * @returns The full public URL to the logo
 */
export const getAgentLogoUrl = (agentSlug: string, extension: string = 'png'): string => {
  const filename = generateLogoFilename(agentSlug, extension);
  return generateLogoUrl(filename);
};

/**
 * Validate if a logo URL is from our Supabase storage
 * @param url - The URL to validate
 * @returns True if it's a valid Supabase storage URL
 */
export const isValidLogoUrl = (url: string): boolean => {
  return url.startsWith(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`);
};

/**
 * Extract filename from a logo URL
 * @param url - The logo URL
 * @returns The filename or null if invalid
 */
export const extractFilenameFromUrl = (url: string): string | null => {
  if (!isValidLogoUrl(url)) return null;
  const parts = url.split('/');
  return parts[parts.length - 1];
};

/**
 * Example usage:
 * 
 * // When uploading a logo for "dalle-creative-studio":
 * const filename = generateLogoFilename('dalle-creative-studio', 'png');
 * // Returns: "dalle-creative-studio-logo.png"
 * 
 * // Get the full URL:
 * const logoUrl = getAgentLogoUrl('dalle-creative-studio', 'png');
 * // Returns: "https://uilnynmclpohscpsequg.supabase.co/storage/v1/object/public/agent-logos/dalle-creative-studio-logo.png"
 * 
 * // Update the database:
 * await supabase
 *   .from('ai_agents')
 *   .update({ logo_url: logoUrl })
 *   .eq('slug', 'dalle-creative-studio');
 */ 