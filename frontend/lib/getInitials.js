/**
 * Reusable utility to generate initials from a full name.
 * 
 * Examples:
 * - "Priyanshu Raj" -> "PR"
 * - "Harsh Chaudhary" -> "HC"
 * - "Ravi" -> "R"
 * - "" / null / undefined -> "S" (standard fallback for student)
 * 
 * @param {string} name 
 * @returns {string}
 */
export default function getInitials(name) {
  if (!name || typeof name !== 'string') return 'S';
  const trimmed = name.trim();
  if (!trimmed) return 'S';
  
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  // First letter of first word + first letter of last word
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return (first + last).toUpperCase();
}
