export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";

  // Allow all Unicode letters and spaces
  const nameRegex = /^[\p{L}\p{Zs}]+$/u;

  if (!nameRegex.test(name)) {
    return "Name can only contain letters and spaces";
  }

  return null;
}

export const validateEmailFormat = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";

  return null;
}

export const validatePassword = (password: string): string | null => {
  if (password.length <= 5) return "Password must be at least more than 5 characters";

  const lowPasswordPatterns = [
    /^([a-zA-Z])\1+$/,             // aaaa, bbbb
    /^([0-9])\1+$/,                // 1111, 2222
    /^(.+)\1+$/,                   // ababab, xyzxyz
    /^(123456|abcdef|qwerty|letmein|password|admin)$/i, // common passwords
  ];

  for (const pattern of lowPasswordPatterns) {
    if (pattern.test(password)) return "Password is too weak or predictable";
  }

  return null; // ✅ Password is good
}