// Universal navigation utility for robust internal navigation
export function goTo(page) {
  const base = window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf("/") + 1
  );
  window.location.href = window.location.origin + base + page;
}
