const form = document.getElementById('studentLoginForm');

const nameInput = document.getElementById('studentName');
const emailInput = document.getElementById('studentEmail');
const passwordInput = document.getElementById('studentPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

const togglePassword = document.getElementById('togglePassword');

function showError(input, target, message) {
  input.classList.add('input-error');
  input.classList.remove('input-success');

  target.textContent = message;

  return false;
}

function showSuccess(input, target) {
  input.classList.remove('input-error');
  input.classList.add('input-success');

  target.textContent = '';

  return true;
}

function validateName() {
  const name = nameInput.value.trim();

  if (!name) {
    return showError(
      nameInput,
      nameError,
      'Please enter your full name.'
    );
  }

  if (name.length < 3) {
    return showError(
      nameInput,
      nameError,
      'Name must contain at least 3 characters.'
    );
  }

  if (!/^[a-zA-Z ]+$/.test(name)) {
    return showError(
      nameInput,
      nameError,
      'Name can contain letters and spaces only.'
    );
  }

  return showSuccess(
    nameInput,
    nameError
  );
}

function validateEmail() {
  const email = emailInput.value
    .trim()
    .toLowerCase();

  if (!email) {
    return showError(
      emailInput,
      emailError,
      'Please enter your university email.'
    );
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return showError(
      emailInput,
      emailError,
      'Enter a valid email address.'
    );
  }

  const validUniversityEmail =
    email.endsWith('@chitkara.edu') ||
    email.endsWith('@chitkara.edu.in');

  if (!validUniversityEmail) {
    return showError(
      emailInput,
      emailError,
      'Use your Chitkara University email.'
    );
  }

  return showSuccess(
    emailInput,
    emailError
  );
}

function validatePassword() {
  const password =
    passwordInput.value;

  if (!password) {
    return showError(
      passwordInput,
      passwordError,
      'Please enter your password.'
    );
  }

  if (password.length < 6) {
    return showError(
      passwordInput,
      passwordError,
      'Password must contain at least 6 characters.'
    );
  }

  return showSuccess(
    passwordInput,
    passwordError
  );
}

if (togglePassword) {
  togglePassword.addEventListener(
    'click',
    () => {
      const hidden =
        passwordInput.type === 'password';

      passwordInput.type =
        hidden ? 'text' : 'password';

      togglePassword.textContent =
        hidden ? 'Hide' : 'Show';
    }
  );
}

nameInput.addEventListener(
  'blur',
  validateName
);

emailInput.addEventListener(
  'blur',
  validateEmail
);

passwordInput.addEventListener(
  'blur',
  validatePassword
);

nameInput.addEventListener(
  'input',
  () => {
    if (nameError.textContent) {
      validateName();
    }
  }
);

emailInput.addEventListener(
  'input',
  () => {
    if (emailError.textContent) {
      validateEmail();
    }
  }
);

passwordInput.addEventListener(
  'input',
  () => {
    if (passwordError.textContent) {
      validatePassword();
    }
  }
);

form.addEventListener(
  'submit',
  e => {
    e.preventDefault();

    const validName =
      validateName();

    const validEmail =
      validateEmail();

    const validPassword =
      validatePassword();

    if (
      !validName ||
      !validEmail ||
      !validPassword
    ) {
      return;
    }

    const currentUser = {
      id: Date.now(),

      name:
        nameInput.value.trim(),

      email:
        emailInput.value
          .trim()
          .toLowerCase(),

      role: 'student'
    };

    localStorage.setItem(
      'campusfound-user',
      JSON.stringify(currentUser)
    );

    location.href = 'profile.html';
  }
);
