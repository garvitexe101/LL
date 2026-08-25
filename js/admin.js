function renderAdmin() {
    if (document.body.dataset.page !== 'admin') return;

    const u = user();

    if (!u || u.role !== 'admin') return;

    const pending = items.filter(i => i.claim === 'pending');

    $('#adminApp').innerHTML = `
        <div class="admin-dashboard">

            <div class="admin-head">
                <div>
                    <p class="eyebrow">
                        <span></span> CAMPUSFOUND ADMIN
                    </p>

                    <h1>Good morning, Admin.</h1>

                    <p>
                        Moderate reports and decide verified ownership claims.
                    </p>
                </div>
            </div>


            <div class="admin-stats">

                <div class="stat">
                    <span>Visible reports</span>
                    <b>
                        ${items.filter(i => i.visible !== false).length}
                    </b>
                </div>

                <div class="stat">
                    <span>Returned items</span>
                    <b>
                        ${items.filter(i => i.status === 'Returned').length}
                    </b>
                </div>

                <div class="stat">
                    <span>Possible matches</span>
                    <b>
                        ${items.filter(i => i.status === 'Possible match').length}
                    </b>
                </div>

                <div class="stat">
                    <span>Claims to review</span>
                    <b>${pending.length}</b>
                </div>

            </div>


            <section class="moderation">

                <h2>Claim review</h2>

                ${
                    pending.length
                        ? pending.map(i => `
                            <div class="claim-review">

                                <div>
                                    <b>${i.name || 'Unnamed item'}</b>

                                    <small>
                                        Claimant: ${i.claimantEmail || 'Student'}
                                        ·
                                        ${i.zone || 'Unknown location'}
                                    </small>

                                    <p>
                                        Answers:
                                        ${
                                            i.claimAnswers?.join(' · ') ||
                                            'Verified'
                                        }
                                    </p>
                                </div>


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
                        `).join('')

                        : `
                            <p class="empty-map-state">
                                No claims are waiting for review.
                            </p>
                        `
                }

            </section>


            <section class="moderation">

                <h2>Report visibility</h2>

                ${
                    items.map(i => `
                        <div class="moderation-row">

                            <span class="moderation-icon">
                                ${i.icon || icon(i.category)}
                            </span>


                            <div class="moderation-info">

                                <b>
                                    ${i.name || 'Unnamed item'}
                                </b>

                                <small>
                                    ${i.type ? i.type.toUpperCase() : 'UNKNOWN'}
                                    ·
                                    ${i.status || 'Open'}
                                </small>

                            </div>


                            <button
                                class="visibility"
                                data-hide="${i.id}"
                            >
                                ${
                                    i.visible === false
                                        ? 'Make visible'
                                        : 'Hide report'
                                }
                            </button>

                        </div>
                    `).join('')
                }

            </section>

        </div>
    `;


    // APPROVE CLAIM
    $$('[data-approve]').forEach(b => {

        b.onclick = () => {

            const i = items.find(
                x => x.id == b.dataset.approve
            );

            if (!i) return;

            i.claim = 'approved';
            i.status = 'Returned';

            save();

            toast(
                'Claim approved and item marked returned.'
            );

            renderAdmin();
            adminItemActions();
        };

    });


    // REJECT CLAIM
    $$('[data-reject]').forEach(b => {

        b.onclick = () => {

            const i = items.find(
                x => x.id == b.dataset.reject
            );

            if (!i) return;

            i.claim = 'rejected';
            i.status = 'Open';

            save();

            toast('Claim rejected.');

            renderAdmin();
            adminItemActions();
        };

    });


    // VISIBILITY BUTTON
    $$('[data-hide]').forEach(b => {

        b.onclick = () => {

            const i = items.find(
                x => x.id == b.dataset.hide
            );

            if (!i) return;

            i.visible = i.visible === false;

            save();

            renderAdmin();
            adminItemActions();
        };

    });


    adminItemActions();
}


function adminItemActions() {

    if (
        document.body.dataset.page !== 'admin' ||
        !user() ||
        user().role !== 'admin'
    ) {
        return;
    }


    $$('.moderation-row').forEach(row => {

        const b = row.querySelector('[data-hide]');

        if (!b) return;

        const id = b.dataset.hide;

        row.style.cursor = 'pointer';


        // CLICK CARD -> OPEN ITEM
        row.onclick = e => {

            if (e.target !== b) {
                location.href = `item.html?id=${id}`;
            }

        };


        // CHANGE BUTTON TO REMOVE ITEM
        b.textContent = 'Remove item';


        // REMOVE ITEM
        b.onclick = e => {

            e.stopPropagation();

            const confirmed = confirm(
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
}


renderAdmin();
