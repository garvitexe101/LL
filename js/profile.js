function renderProfile() {
  if (document.body.dataset.page !== 'profile') return;

  const u = user();

  if (!u) {
    $('#profilePage').innerHTML = `
      <section class="profile-card">

        <p class="eyebrow">
          <span></span>
          YOUR LOSTLINK PROFILE
        </p>

        <span class="large-avatar">
          ◉
        </span>

        <h1>
          Welcome to<br>
          LostLink.
        </h1>

        <p>
          Sign in to create reports, see match updates and follow your claims.
        </p>

        <div class="profile-actions">

          <button
            class="btn btn-dark"
            id="quickSignIn"
          >
            Sign in <b>→</b>
          </button>

          <a
            class="btn btn-light"
            href="admin.html"
          >
            Admin sign in
          </a>

        </div>

      </section>
    `;

    $('#quickSignIn').onclick = () => {
      location.href = 'signin.html';
    };

    return;
  }

  const mine = items.filter(
    i => i.ownerEmail === u.email
  );

  $('#profilePage').innerHTML = `
    <section class="profile-card profile-top">

      <p class="eyebrow">
        <span></span>
        ${
          u.role === 'admin'
            ? 'ADMINISTRATOR'
            : 'STUDENT'
        } ACCOUNT
      </p>

      <span class="large-avatar">
        ${
          u.name
            ? u.name[0].toUpperCase()
            : 'U'
        }
      </span>

      <h1>
        ${u.name || 'LostLink User'}
      </h1>

      <p>
        ${u.email || ''}
      </p>

      <div class="profile-actions">

        ${
          u.role === 'admin'
            ? `
              <a
                class="btn btn-dark"
                href="admin.html"
              >
                Admin dashboard <b>→</b>
              </a>
            `
            : `
              <a
                class="btn btn-dark"
                href="lost.html"
              >
                Report an item <b>→</b>
              </a>
            `
        }

        <button
          class="btn btn-light"
          id="signOut"
        >
          Sign out
        </button>

      </div>

    </section>

    <section class="notification-centre">

      <p class="eyebrow">
        <span></span>
        NOTIFICATION CENTRE
      </p>

      <h2>
        Recent updates
      </h2>

      <div id="profileNoticeList"></div>

      <p
        class="alert-row"
        id="emptyNotificationMessage"
      >
        ✓ You’re all caught up. New matches and claim updates will appear here.
      </p>

    </section>

    <section class="my-reports">

      <div>

        <p class="eyebrow">
          <span></span>
          MY REPORTS
        </p>

        <h2>
          Your lost & found activity
        </h2>

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

  const signOut = $('#signOut');

  if (signOut) {
    signOut.onclick = () => {
      localStorage.removeItem(
        'LostLink-user'
      );

      renderProfile();

      if (
        typeof updateProfile === 'function'
      ) {
        updateProfile();
      }
    };
  }

  profileNotices();
}

function getProfileNotices() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          'LostLink-notices'
        )
      ) || []
    );
  } catch {
    return [];
  }
}

function profileNotices() {
  if (
    document.body.dataset.page !== 'profile' ||
    !user()
  ) {
    return;
  }

  const currentUser = user();

  const mine = getProfileNotices()
    .filter(
      n =>
        n.email === currentUser.email
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  const target =
    $('#profileNoticeList');

  if (!target) return;

  const emptyMessage =
    $('#emptyNotificationMessage');

  if (!mine.length) {
    if (emptyMessage) {
      emptyMessage.style.display =
        'block';
    }

    return;
  }

  if (emptyMessage) {
    emptyMessage.remove();
  }

  target.innerHTML = mine
    .map(n => {

      if (
        n.type === 'claim-approved'
      ) {
        return `
          <div class="claim-approved-notice">

            <div class="notice-icon">
              ✓
            </div>

            <div class="notice-content">

              <span class="notice-label">
                CLAIM UPDATE
              </span>

              <h3>
                ${n.title || 'Claim approved'}
              </h3>

              <p>
                ${n.message}
              </p>

              <div class="collection-location">

                <span>
                  COLLECTION LOCATION
                </span>

                <b>
                  Security Office behind Turing Block
                </b>

              </div>

              <div class="collection-note">

                <b>
                  Important reminder
                </b>

                <span>
                  ${
                    n.note ||
                    'Please carry your valid Student ID while visiting the Security Office to collect the item.'
                  }
                </span>

              </div>

            </div>

          </div>
        `;
      }

      if (
        n.type === 'claim-rejected'
      ) {
        return `
          <div class="claim-rejected-notice">

            <div class="notice-icon rejected-icon">
              ×
            </div>

            <div class="notice-content">

              <span class="notice-label">
                CLAIM UPDATE
              </span>

              <h3>
                ${n.title || 'Claim rejected'}
              </h3>

              <p>
                ${n.message}
              </p>

              <div class="collection-note">

                <b>
                  Note
                </b>

                <span>
                  ${
                    n.note ||
                    'If you believe this decision was incorrect, please contact the campus lost-and-found team.'
                  }
                </span>

              </div>

            </div>

          </div>
        `;
      }

      return `
        <div class="claim-approved-notice">

          <div class="notice-icon">
            ✓
          </div>

          <div class="notice-content">

            <span class="notice-label">
              CLAIM UPDATE
            </span>

            <h3>
              ${n.title || 'Claim update'}
            </h3>

            <p>
              ${n.message || ''}
            </p>

          </div>

        </div>
      `;
    })
    .join('');
}

renderProfile();
