'use strict';

const form = document.getElementById('login-form');
const error = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  error.hidden = true;
  const body = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    window.location.href = '/admin';
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
  }
});
