const { createClient } = supabase;
const supabaseClient = createClient(
  'https://fbyrnwwvkzfnnurgrgmd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieXJud3d2a3pmbm51cmdyZ21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzQ4MjcsImV4cCI6MjA2MjgxMDgyN30.2ya_pHmZj-x_wEoT0j-uOqmMfyKnSeRCPi06cAgqRvo'
);

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

async function checkAuth() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    window.location.href = 'home.html';
  }
}

// Iniciar sesión con Google
async function loginWithGoogle() {
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/FinanApp/home.html`
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error en login con Google:', error);
    showMessage('Error', 'No se pudo iniciar sesión con Google: ' + error.message);
  }
}

// Registro con email
async function handleEmailSignup(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    // Validaciones
    if (!nombre || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Registrar usuario
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
        emailRedirectTo: `${window.location.origin}/FinanApp/home.html`
      }
    });

    if (error) throw error;

    // Mostrar mensaje de éxito
    showMessage(
      'Verifica tu email', 
      'Te hemos enviado un enlace de confirmación a tu correo electrónico. ' +
      'Por favor verifica tu email para activar tu cuenta.'
    );

    // Limpiar formulario
    event.target.reset();

  } catch (error) {
    console.error('Error en registro:', error);
    showMessage('Error en registro', error.message);
  }
}

// Iniciar sesión con email
async function handleEmailLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Redirigir a home si el login es exitoso
    window.location.href = 'home.html';

  } catch (error) {
    console.error('Error en login:', error);
    showMessage('Error en inicio de sesión', error.message);
    
    // Verificar si el error es por email no verificado
    if (error.message.includes('Email not confirmed')) {
      showMessage(
        'Email no verificado', 
        'Por favor verifica tu email antes de iniciar sesión. ' +
        'Revisa tu bandeja de entrada y carpeta de spam.'
      );
    }
  }
}