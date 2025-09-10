document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.auth-container');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showSignInBtn = document.getElementById('showSignIn');
  
    // Toggle between Sign In and Sign Up views
    showSignUpBtn.addEventListener('click', () => {
      container.classList.add('show-signup');
    });
  
    showSignInBtn.addEventListener('click', () => {
      container.classList.remove('show-signup');
    });
  
    // --- Form Validation ---
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
  
    const setError = (field, message) => {
      const fieldWrapper = field.parentElement;
      const errorDisplay = fieldWrapper.querySelector('.error-msg');
      errorDisplay.innerText = message;
      fieldWrapper.classList.toggle('invalid', !!message);
    };
    
    const validateField = (field) => {
        if (field.checkValidity()) {
            setError(field, '');
            return true;
        } else {
            setError(field, field.validationMessage);
            return false;
        }
    };
  
    const validatePasswordMatch = () => {
      const password = document.getElementById('signUpPassword');
      const confirm = document.getElementById('confirmPassword');
      if (password.value !== confirm.value) {
        setError(confirm, "Passwords do not match.");
        return false;
      } else {
        setError(confirm, "");
        return true;
      }
    };
  
    // Attach real-time validation
    [signInForm, signUpForm].forEach(form => {
      if (!form) return;
      Array.from(form.elements).forEach(field => {
          field.addEventListener('input', () => validateField(field));
      });
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        Array.from(form.elements).forEach(field => {
          if (!validateField(field)) isFormValid = false;
        });
        
        if (form.id === 'signUpForm' && !validatePasswordMatch()) {
          isFormValid = false;
        }
  
        if (isFormValid) {
          // Placeholder for actual form submission (e.g., to an API)
          const successMessage = form.id === 'signInForm'
            ? "Successfully signed in! Redirecting..."
            : "Account created successfully! Please sign in.";
          alert(successMessage);
          form.reset();
           Array.from(form.elements).forEach(field => setError(field, ''));
          if(form.id === 'signUpForm') container.classList.remove('show-signup');
        } else {
          alert("Please correct the errors before submitting.");
        }
      });
    });
  });
  