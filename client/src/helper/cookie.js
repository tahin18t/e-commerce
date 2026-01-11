// ✅ Set Cookie
export function setCookie(name, value, days = 7) {
  const expires = days
    ? `; max-age=${days * 24 * 60 * 60}`
    : "";
  document.cookie = `${name}=${value}; path=/; SameSite=Lax${expires}`;
}

// ✅ Read Cookie
export function readCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find(c => c.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
}

// ✅ Delete Cookie
export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ✅ Check if cookie exists (login check helper)
export function hasCookie(name) {
  return readCookie(name) !== null;
}

// ✅ Get all cookies as object (optional but useful)
export function getAllCookies() {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, val] = cookie.split("=");
    acc[key] = val;
    return acc;
  }, {});
}
