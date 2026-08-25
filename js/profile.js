function renderProfile() {
    if (document.body.dataset.page !== 'profile') return;

    const u = user();

    if (!u) {
        $('#profilePage').innerHTML = `
            <section class="profile-card">
                <p class="eyebrow">
                    <span></span> YOUR LOSTLINK PROFILE
                </p>

                <span class="large-avatar">◉</span>

                <h1>
                    Welcome to
                    <br>
                    LOSTLINK.
                </h1>

                <p>
                    Sign in to create reports, see match updates and follow your claims.
                </p>

                <div class="profile-actions" id="profileActions">
                    <button class="btn btn-dark" id="quickSignIn">
                        Sign in <b>→</b>
                    </button>

                    <a class="btn btn-light" href="admin.html">
                        Admin sign in
                    </a>
                </div>

                <div class="profile-login-form" id="profileLoginForm" hidden>
                    <div class="profile-login-head">
                        <button type="button" class="login-back" id="loginBack">
                            ←
                        </button>

                        <div>
                            <p class="eyebrow">
                                <span></span> STUDENT SIGN IN
                            </p>

                            <h2>Welcome.</h2>
                        </div>
                    </div>

                    <p class="login-copy">
                        Sign in using your university account.
                    </p>

                    <form id="studentLoginForm" novalidate>
                        <div class="login-field">
                            <label for="studentName">Full name</label>

                            <input
                                type="text"
                                id="studentName"
                                placeholder="Enter your full name"
                                autocomplete="name"
                            >

                            <small id="nameError"></small>
                        </div>

                        <div class="login-field">
                            <label for="studentEmail">University email</label>

                            <input
                                type="email"
                                id="studentEmail"
                                placeholder="name@chitkara.edu.in"
                                autocomplete="email"
                            >

                            <small id="emailError"></small>
                        </div>

                        <div class="login-field">
                            <label for="studentPassword">Password</label>

                            <div class="password-input">
                                <input
                                    type="password"
                                    id="studentPassword"
                                    placeholder="Enter password"
                                    autocomplete="current-password"
                                >

                                <button type="button" id="togglePassword">
                                    Show
                                </button>
                            </div>

                            <small id="passwordError"></small>
                        </div>

                        <button type="submit" class="btn btn-dark login-submit">
                            Sign in <b>→</b>
                        </button>
                    </form>
                </div>
            </section>
        `;

        bindLoginForm();

        return;
    }

    const mine = items.filter(i => i.ownerEmail === u.email);

    const alerts = mine
        .filter(i => i.status !== 'Open')
        .map(i => `${i.name}: ${i.status}`)
        .concat(
            items
                .filter(i => i.claim === 'pending')
                .map(i => `A claim is pending for ${i.name}`)
        );

    $('#profilePage').innerHTML = `
        <section class="profile-card profile-top">
            <p class="eyebrow">
                <span></span>
                ${u.role === 'admin' ? 'ADMINISTRATOR' : 'STUDENT'} ACCOUNT
            </p>

            <span class="large-avatar">
                ${u.name ? u.name[0].toUpperCase() : 'U'}
            </span>

            <h1>${u.name}</h1>

            <p>${u.email}</p>

            <div class="profile-actions">
                ${
                    u.role === 'admin'
                        ? `
                            <a class="btn btn-dark" href="admin.html">
                                Admin dashboard <b>→</b>
                            </a>
                        `
                        : `
                            <a class="btn btn-dark" href="lost.html">
                                Report an item <b>→</b>
                            </a>
                        `
                }

                <button class="btn btn-light" id="signOut">
                    Sign out
                </button>
            </div>
        </section>

        <section class="notification-centre">
            <p class="eyebrow">
                <span></span> NOTIFICATION CENTRE
            </p>

            <h2>Recent updates</h2>

            ${
                alerts.length
                    ? alerts
                        .map(a => `
                            <p class="alert-row">
                                ✦ ${a}
                            </p>
                        `)
                        .join('')
                    : `
                        <p class="alert-row">
                            ✓ You’re all caught up. New matches and claim updates will appear here.
                        </p>
                    `
            }
        </section>

        <section class="my-reports">
            <div>
                <p class="eyebrow">
                    <span></span> MY REPORTS
                </p>

                <h2>Your lost & found activity</h2>
            </div>

            <div class="my-report-grid">
                ${
                    mine.length
                        ? mine.map(card).join('')
                        : `
                            <p class="empty-map-state">
                                You have not posted a report yet.
                            </p>
                        `
                }
            </div>
        </section>
    `;

    bindCards();

    $('#signOut').onclick = () => {
        localStorage.removeItem('LOSTLINK-user');

        renderProfile();

        updateProfile();
    };
}

function bindLoginForm() {
    const quickSignIn = $('#quickSignIn');
    const profileActions = $('#profileActions');
    const loginFormBox = $('#profileLoginForm');
    const loginBack = $('#loginBack');
    const form = $('#studentLoginForm');

    const nameInput = $('#studentName');
    const emailInput = $('#studentEmail');
    const passwordInput = $('#studentPassword');

    const nameError = $('#nameError');
    const emailError = $('#emailError');
    const passwordError = $('#passwordError');

    quickSignIn.onclick = () => {
        profileActions.hidden = true;
        loginFormBox.hidden = false;
        nameInput.focus();
    };

    loginBack.onclick = () => {
        loginFormBox.hidden = true;
        profileActions.hidden = false;

        clearLoginErrors();
    };

    $('#togglePassword').onclick = () => {
        const hidden = passwordInput.type === 'password';

        passwordInput.type = hidden ? 'text' : 'password';

        $('#togglePassword').textContent = hidden ? 'Hide' : 'Show';
    };

    function setError(input, error, message) {
        input.classList.add('input-error');
        input.classList.remove('input-success');
        error.textContent = message;

        return false;
    }

    function setSuccess(input, error) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        error.textContent = '';

        return true;
    }

    function clearLoginErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';

        nameInput.classList.remove('input-error', 'input-success');
        emailInput.classList.remove('input-error', 'input-success');
        passwordInput.classList.remove('input-error', 'input-success');
    }

    function validateName() {
        const name = nameInput.value.trim();

        if (!name) {
            return setError(
                nameInput,
                nameError,
                'Please enter your full name.'
            );
        }

        if (name.length < 3) {
            return setError(
                nameInput,
                nameError,
                'Name must contain at least 3 characters.'
            );
        }

        if (!/^[a-zA-Z ]+$/.test(name)) {
            return setError(
                nameInput,
                nameError,
                'Name can contain letters and spaces only.'
            );
        }

        return setSuccess(nameInput, nameError);
    }

    function validateEmail() {
        const email = emailInput.value.trim().toLowerCase();

        if (!email) {
            return setError(
                emailInput,
                emailError,
                'Please enter your university email.'
            );
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return setError(
                emailInput,
                emailError,
                'Enter a valid email address.'
            );
        }

        if (!email.endsWith('@chitkara.edu.in')) {
            return setError(
                emailInput,
                emailError,
                'Use your Chitkara University email.'
            );
        }

        return setSuccess(emailInput, emailError);
    }

    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            return setError(
                passwordInput,
                passwordError,
                'Please enter your password.'
            );
        }

        if (password.length < 6) {
            return setError(
                passwordInput,
                passwordError,
                'Password must contain at least 6 characters.'
            );
        }

        return setSuccess(passwordInput, passwordError);
    }

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);

    form.onsubmit = e => {
        e.preventDefault();

        const validName = validateName();
        const validEmail = validateEmail();
        const validPassword = validatePassword();

        if (!validName || !validEmail || !validPassword) {
            return;
        }

        const currentUser = {
            id: Date.now(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            role: 'student'
        };

        localStorage.setItem(
            'LOSTLINK-user',
            JSON.stringify(currentUser)
        );

        if (typeof toast === 'function') {
            toast('Signed in successfully.');
        }

        renderProfile();

        updateProfile();
    };
}

function profileNotices() {
    if (
        document.body.dataset.page !== 'profile' ||
        !user()
    ) {
        return;
    }

    const mine = notices().filter(
        n => n.email === user().email
    );

    if (!mine.length) return;

    const target = $('.notification-centre');

    if (target) {
        target.insertAdjacentHTML(
            'afterbegin',
            mine
                .map(
                    n => `
                        <p class="alert-row accepted-alert">
                            ✓ ${n.message}
                        </p>
                    `
                )
                .join('')
        );
    }
}

renderProfile();

setTimeout(profileNotices, 0);
