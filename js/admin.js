function renderAdmin() {
  if (document.body.dataset.page !== 'admin') return;

  const u = user();

  if (!u || u.role !== 'admin') return;

  const pending =
    items.filter(i => i.claim === 'pending');

  $('#adminApp').innerHTML = `
    <div class="admin-dashboard">

      <div class="admin-head">

        <div>

          <p class="eyebrow">
            <span></span>
            CAMPUSFOUND ADMIN
          </p>

          <h1>
            Good morning, Admin.
          </h1>

          <p>
            Moderate reports and decide verified ownership claims.
          </p>

        </div>

      </div>

      <div class="admin-stats">

        <div class="stat">
          <span>Visible reports</span>

          <b>
            ${
              items.filter(
                i => i.visible !== false
              ).length
            }
          </b>
        </div>

        <div class="stat">
          <span>Returned items</span>

          <b>
            ${
              items.filter(
                i => i.status === 'Returned'
              ).length
            }
          </b>
        </div>

        <div class="stat">
          <span>Possible matches</span>

          <b>
            ${
              items.filter(
                i => i.status === 'Possible match'
              ).length
            }
          </b>
        </div>

        <div class="stat">
          <span>Claims to review</span>

          <b>
            ${pending.length}
          </b>
        </div>

      </div>

      <section class="moderation">

        <h2>
          Claim review
        </h2>

        ${
          pending.length
            ? pending
                .map(i => `
                  <div class="claim-review">

                    <div class="claim-review-main">

                      <div class="claim-review-title">

                        <span class="moderation-icon">
                          ${i.icon || icon(i.category)}
                        </span>

                        <div>
                          <h3>
                            ${i.name || 'Unnamed item'}
                          </h3>

                          <small>
                            ${i.type ? i.type.toUpperCase() : 'ITEM'}
                            ·
                            ${i.status || 'Open'}
                          </small>
                        </div>

                      </div>

                      <div class="admin-claim-grid">

                        <div class="admin-claim-section">

                          <h4>
                            Claimant details
                          </h4>

                          <p>
                            <span>Name</span>
                            <b>
                              ${i.claimantName || 'Student'}
                            </b>
                          </p>

                          <p>
                            <span>Email</span>
                            <b>
                              ${i.claimantEmail || 'Not available'}
                            </b>
                          </p>

                          <p>
                            <span>Submitted</span>
                            <b>
                              ${
                                i.claimSubmittedAt
                                  ? new Date(
                                      i.claimSubmittedAt
                                    ).toLocaleString()
                                  : 'Not available'
                              }
                            </b>
                          </p>

                        </div>

                        <div class="admin-claim-section">

                          <h4>
                            Claimant answers
                          </h4>

                          <p>
                            <span>Colour</span>
                            <b>
                              ${
                                i.claimAnswers?.colour ||
                                'Not provided'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Where was it found?</span>
                            <b>
                              ${
                                i.claimAnswers?.location ||
                                'Not provided'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Private feature</span>
                            <b>
                              ${
                                i.claimAnswers?.privateFeature ||
                                'Not provided'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Description word</span>
                            <b>
                              ${
                                i.claimAnswers?.descriptionWord ||
                                'Not provided'
                              }
                            </b>
                          </p>

                        </div>

                        <div class="admin-claim-section finder-private">

                          <h4>
                            Finder's original details
                          </h4>

                          <p>
                            <span>Finder</span>
                            <b>
                              ${
                                i.ownerEmail ||
                                i.finderEmail ||
                                'Not available'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Original colour</span>
                            <b>
                              ${
                                i.colour ||
                                i.color ||
                                'Not available'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Reported location</span>
                            <b>
                              ${i.zone || 'Not available'}
                            </b>
                          </p>

                          <p>
                            <span>Private detail</span>
                            <b>
                              ${
                                i.privateDetail ||
                                i.privateFeature ||
                                i.secretDetail ||
                                'Not provided'
                              }
                            </b>
                          </p>

                          <p>
                            <span>Description</span>
                            <b>
                              ${
                                i.description ||
                                'Not available'
                              }
                            </b>
                          </p>

                        </div>

                      </div>

                    </div>

                    <div class="claim-actions">

                      <button
                        class="approve-claim"
                        data-approve="${i.id}"
                      >
                        Approve & return
                      </button>

                      <button
                        class="reject-claim"
                        data-reject="${i.id}"
                      >
                        Reject
                      </button>

                    </div>

                  </div>
                `)
                .join('')

            : `
              <p class="empty-map-state">
                No claims are waiting for review.
              </p>
            `
        }

      </section>

      <section class="moderation">

        <h2>
          Report visibility
        </h2>

        ${
          items
            .map(i => `
              <div class="moderation-row">

                <span class="moderation-icon">
                  ${i.icon || icon(i.category)}
                </span>

                <div class="moderation-info">

                  <b>
                    ${i.name || 'Unnamed item'}
                  </b>

                  <small>
                    ${
                      i.type
                        ? i.type.toUpperCase()
                        : 'UNKNOWN'
                    }
                    ·
                    ${i.status || 'Open'}
                  </small>

                </div>

                <button
                  class="visibility"
                  data-delete="${i.id}"
                >
                  Remove item
                </button>

              </div>
            `)
            .join('')
        }

      </section>

    </div>
  `;

  bindAdminActions();
}

function bindAdminActions() {
  $$('[data-approve]').forEach(button => {
    button.onclick = () => {
      const item = items.find(
        i => i.id == button.dataset.approve
      );

      if (!item) return;

      item.claim = 'approved';
      item.status = 'Returned';
      item.visible = false;

      addClaimNotice(
        item.claimantEmail,
        `Your claim for ${item.name} was approved.`
      );

      save();

      toast(
        'Claim approved and item marked as returned.'
      );

      renderAdmin();
    };
  });

  $$('[data-reject]').forEach(button => {
    button.onclick = () => {
      const item = items.find(
        i => i.id == button.dataset.reject
      );

      if (!item) return;

      item.claim = 'rejected';
      item.status = 'Open';

      addClaimNotice(
        item.claimantEmail,
        `Your claim for ${item.name} was rejected.`
      );

      save();

      toast('Claim rejected.');

      renderAdmin();
    };
  });

  $$('[data-delete]').forEach(button => {
    button.onclick = e => {
      e.stopPropagation();

      const id =
        button.dataset.delete;

      const confirmed =
        confirm(
          'Remove this item report from the prototype?'
        );

      if (!confirmed) return;

      items = items.filter(
        i => i.id != id
      );

      save();

      toast('Item removed.');

      renderAdmin();
    };
  });

  $$('.moderation-row').forEach(row => {
    const button =
      row.querySelector('[data-delete]');

    if (!button) return;

    const id =
      button.dataset.delete;

    row.style.cursor = 'pointer';

    row.onclick = e => {
      if (e.target.closest('[data-delete]')) {
        return;
      }

      location.href =
        `item.html?id=${id}`;
    };
  });
}

function addClaimNotice(email, message) {
  if (!email) return;

  if (
    typeof notices !== 'function'
  ) {
    return;
  }

  const allNotices = notices();

  allNotices.push({
    id: Date.now(),
    email: email,
    message: message,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    'campusfound-notices',
    JSON.stringify(allNotices)
  );
}

renderAdmin();
