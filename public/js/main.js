document.addEventListener('DOMContentLoaded', () => {
  const logoutLinks = document.querySelectorAll('a[href="/auth/logout"]');
  
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        e.preventDefault();
      }
    });
  });

  const alerts = document.querySelectorAll('.alert:not(.alert-dismissible)');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
});

(function() {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function() {
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.disabled = false;
      }, 3000);
    }
  });
});