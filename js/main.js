import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

// IMPORTANT: Replace these placeholders with your actual Supabase URL and PUBLIC KEY before deployment
const SUPABASE_URL = 'https://euzcnqcwpkpktgqdgzbs.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_xhMEhdnDkQWUZDXn6URTWw_wbPoI3_9';

let supabaseClient;
try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
} catch (error) {
  console.warn('Supabase client failed to initialize. Make sure to provide valid credentials.');
}

document.addEventListener('DOMContentLoaded', () => {

  // Sticky Navbar Logic
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Initial check for scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }

  // Smooth Scrolling for anchor links (if any internal links exist)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Contact Form Submission logic
  const contactForm = document.getElementById('contactForm');
  if (contactForm && supabaseClient) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      try {
        const { data, error } = await supabaseClient
          .from('contact_messages')
          .insert([{ name, email, message }]);

        if (error) {
          throw error;
        }

        // Show success alert
        showAlert('success', 'Message sent successfully! We will get back to you soon.');
        contactForm.reset();

      } catch (error) {
        console.error('Error sending message:', error);
        showAlert('danger', 'Error sending message. Please try again later or check credentials/configuration.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

});

// Helper function to show bootstrap alerts dynamically
function showAlert(type, message) {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alertDiv);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150); // wait for fade transition
  }, 5000);
}
