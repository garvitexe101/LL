const form = document.getElementById('studentLoginForm');

const nameInput = document.getElementById('studentName');
const emailInput = document.getElementById('studentEmail');
const passwordInput = document.getElementById('studentPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

const togglePassword = document.getElementById('togglePassword');

function error(input, target, message) {
  input.classList.add('input-error');
  input.classList.remove('input-success');

  target.textContent = message;

  return false;
}

function success(input, target) {
  input.classList.remove('input-error');
  input.classList.add('input-success');

  target.textContent = '';

  return true;
}

function validateName() {
  const name = nameInput.value.trim();

  if (!name) {
    return error(
      nameInput,
      nameError,
      'Please enter your full name.'
    );
  }

  if (name.length < 3) {
    return error(
      nameInput,
      nameError,
      'Name must contain at least 3 characters.'
    );
  }

  if (!/^[a-zA-Z ]+$/.test(name)) {
    return error(
      nameInput,
      nameError,
      'Name can contain letters and spaces only.'
    );
  }

  return success(
    nameInput,
    nameError
  );
}

function validateEmail() {
  const email =
    emailInput.value.trim().toLowerCase();

  if (!email) {
    return error(
      emailInput,
      emailError,
      'Please enter your university email.'
    );
  }

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    return error(
      emailInput,
      emailError,
      'Enter a valid email address.'
    );
  }

  if (!email.endsWith('@chitkara.edu.in')) {
    return error(
      emailInput,
      emailError,
      'Use your Chitkara University email.'
    );
  }

  return success(
    emailInput,
    emailError
  );
}

function validatePassword() {
  const password =
    passwordInput.value;

  if (!password) {
    return error(
      passwordInput,
      passwordError,
      'Please enter your password.'
    );
  }

  if (password.length < 6) {
    return error(
      passwordInput,
      passwordError,
      'Password must contain at least 6 characters.'
    );
  }

  return success(
    passwordInput,
    passwordError
  );
}

togglePassword.onclick = () => {
  const hidden =
    passwordInput.type === 'password';

  passwordInput.type =
    hidden ? 'text' : 'password';

  togglePassword.textContent =
    hidden ? 'Hide' : 'Show';
};

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
