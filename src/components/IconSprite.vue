<script setup>
// Sprite SVG único (inserido uma vez no App); os ícones usam <use>, evitando repetir paths no HTML.
</script>

<template>
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <symbol id="i-whatsapp" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        stroke="none"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"
      />
    </symbol>
    <symbol id="i-mail" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 6 8.5 7 8.5-7" />
    </symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </symbol>
    <symbol id="i-arrow-left" viewBox="0 0 24 24">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </symbol>
    <symbol id="i-play" viewBox="0 0 24 24">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-menu" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </symbol>
    <symbol id="i-close" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" />
    </symbol>
    <symbol id="i-search" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.4-4.4" />
    </symbol>
    <symbol id="i-pin" viewBox="0 0 24 24">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" />
    </symbol>
    <symbol id="i-check" viewBox="0 0 24 24">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </symbol>
    <symbol id="i-star" viewBox="0 0 24 24">
      <path fill="currentColor" stroke="none" d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z" />
    </symbol>
    <symbol id="i-google" viewBox="0 0 24 24">
      <path fill="#EA4335" stroke="none" d="M12 10.2v3.9h5.5c-.24 1.26-.97 2.33-2.06 3.05l3.33 2.58c1.94-1.79 3.06-4.42 3.06-7.54 0-.72-.06-1.42-.19-2.09H12Z" />
      <path fill="#34A853" stroke="none" d="M5.84 14.1 5.1 14.67l-2.66 2.07A10 10 0 0 0 12 22c2.7 0 4.96-.89 6.61-2.42l-3.33-2.58c-.9.6-2.05.97-3.28.97-2.52 0-4.66-1.7-5.42-4l-.74.13Z" />
      <path fill="#4A90E2" stroke="none" d="M2.44 7.26A9.9 9.9 0 0 0 2 12c0 1.62.39 3.15 1.08 4.5l3.5-2.72A5.98 5.98 0 0 1 6.27 12c0-.62.11-1.23.31-1.78L2.44 7.26Z" />
      <path fill="#FBBC05" stroke="none" d="M12 5.98c1.47 0 2.78.5 3.81 1.49l2.86-2.86C16.95 3 14.69 2 12 2a10 10 0 0 0-8.92 5.5l3.5 2.72C7.34 7.68 9.48 5.98 12 5.98Z" />
    </symbol>
    <symbol id="i-user" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" /><path d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8" />
    </symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </symbol>
    <symbol id="i-clock" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" />
    </symbol>
    <symbol id="i-facebook" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        stroke="none"
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h2.6l.4-3H13v-1.5c0-.8.2-1.5 1-1.5Z"
      />
    </symbol>
    <symbol id="i-x" viewBox="0 0 24 24">
      <path fill="currentColor" stroke="none" d="M17.6 3H20.5l-6.7 7.7L21.5 21h-5.5l-4.3-5.6L6.5 21H3.6l7.2-8.2L2.7 3h5.6l3.9 5.2L17.6 3Zm-1.9 16.2h1.5L8.4 4.7H6.8l8.9 14.5Z" />
    </symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        stroke="none"
        d="M6.3 9.3H3.5V20.5h2.8V9.3ZM4.9 3.5A1.65 1.65 0 1 0 4.9 6.8 1.65 1.65 0 0 0 4.9 3.5ZM20.5 20.5h-2.8v-5.9c0-1.9-.7-3.2-2.4-3.2-1.3 0-2 0.9-2.3 1.7-.1.3-.1.7-.1 1.1v6.3H10.1s0-10.2 0-11.2h2.8v1.6c.4-.6 1.6-1.9 3.9-1.9 2.8 0 4.9 1.9 4.9 5.8v5.7h-.2Z"
      />
    </symbol>
    <symbol id="i-youtube" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        stroke="none"
        d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2C2 8.76 2 12 2 12s0 3.24.4 4.8a2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77c.4-1.56.4-4.8.4-4.8s0-3.24-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"
      />
    </symbol>
    <symbol id="i-globe" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" />
    </symbol>
    <symbol id="i-article" viewBox="0 0 24 24">
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" /><path d="M8 8h8M8 12h8M8 16h5" />
    </symbol>
  </svg>
</template>
