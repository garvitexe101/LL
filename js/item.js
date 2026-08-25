function renderItem() {
  if (document.body.dataset.page !== 'item') return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const item = items.find(i => i.id == id);

  if (!item) {
    $('#itemPage').innerHTML = `
      <div class="not-found">
        Item not found.
      </div>
    `;
    return;
  }

  const u = user();

  $('#itemPage').innerHTML = `
    <section class="item-detail">

      <div class="detail-art">
        ${item.icon || icon(item.category)}
      </div>

      <div class="detail-main">

        <p class="eyebrow">
          <span></span>
          ${item.type ? item.type.toUpperCase() : 'ITEM'} REPORT
        </p>

        <h1>
          ${item.name || 'Unnamed item'}
        </h1>

        <p class="detail-description">
          ${item.description || 'No description provided.'}
        </p>

        <div class="detail-grid">

          <div>
            <small>CATEGORY</small>
            <b>${item.category || 'Other'}</b>
          </div>

          <div>
            <small>COLOUR</small>
            <b>${item.colour || item.color || 'Not specified'}</b>
          </div>

          <div>
            <small>STATUS</small>
            <b>${item.status || 'Open'}</b>
          </div>

          <div>
            <small>CAMPUS ZONE</small>
            <b>${item.zone || 'Not specified'}</b>
          </div>

          <div>
            <small>DATE</small>
            <b>${item.date || 'Not specified'}</b>
          </div>

          <div>
            <small>TYPE</small>
            <b>${item.type ? item.type.toUpperCase() : 'UNKNOWN'}</b>
          </div>

        </div>

      </div>

    </section>

    ${
      item.type === 'found' && item.status !== 'Returned'
        ? `
          <section class="claim-box">

            <p class="eyebrow">
              <span></span>
              OWNERSHIP VALIDATION
            </p>

            <h2>
              Think it may be yours?
            </h2>

            <p>
              Submit your answers below. Your claim will be reviewed manually by a campus administrator.
            </p>

            ${
              item.claim === 'pending'
                ? `
                  <p class="alert-row">
                    Your claim has been submitted and is waiting for admin review.
                  </p>
                `
                : `
                  <form id="claimForm">

                    <label>
                      What colour is it?

                      <input
                        type="text"
                        id="claimColour"
                        placeholder="Enter the colour"
                        required
                      >
                    </label>

                    <label>
                      Where was it found?

                      <input
                        type="text"
                        id="claimLocation"
                        placeholder="Enter the location"
                        required
                      >
                    </label>

                    <label>
                      Name one private feature

                      <input
                        type="text"
                        id="claimPrivate"
                        placeholder="Enter a private identifying feature"
                        required
                      >
                    </label>

                    <label>
                      What public-description word matches?

                      <input
                        type="text"
                        id="claimDescription"
                        placeholder="Enter a matching description word"
                        required
                      >
                    </label>

                    <button
                      type="submit"
                      class="btn btn-dark"
                    >
                      Submit verification
                      <b>→</b>
                    </button>

                  </form>
                `
            }

          </section>
        `
        : ''
    }
  `;

  setupClaimForm(item);
}

function setupClaimForm(item) {
  const claimForm = document.getElementById('claimForm');

  if (!claimForm) return;

  claimForm.addEventListener('submit', e => {
    e.preventDefault();

    const u = user();

    if (!u) {
      toast('Please sign in before submitting a claim.');

      setTimeout(() => {
        location.href = 'profile.html';
      }, 700);

      return;
    }

    const colourAnswer =
      document.getElementById('claimColour').value.trim();

    const locationAnswer =
      document.getElementById('claimLocation').value.trim();

    const privateAnswer =
      document.getElementById('claimPrivate').value.trim();

    const descriptionAnswer =
      document.getElementById('claimDescription').value.trim();

    if (
      !colourAnswer ||
      !locationAnswer ||
      !privateAnswer ||
      !descriptionAnswer
    ) {
      toast('Please answer all verification questions.');
      return;
    }

    item.claim = 'pending';

    item.claimantName =
      u.name || 'Student';

    item.claimantEmail =
      u.email || '';

    item.claimAnswers = {
      colour: colourAnswer,
      location: locationAnswer,
      privateFeature: privateAnswer,
      descriptionWord: descriptionAnswer
    };

    item.claimSubmittedAt =
      new Date().toISOString();

    save();

    toast(
      'Claim submitted successfully. An admin will review it.'
    );

    setTimeout(() => {
      renderItem();
    }, 500);
  });
}

renderItem();
