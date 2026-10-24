/* Live campus map (Leaflet + OpenStreetMap) and zone report list. Markers are zone-level only. */
(async function () {
  if (document.body.dataset.page !== 'map') return;

  let data;
  try {
    data = await api('/map');
  } catch (e) {
    toast(e.message);
    return;
  }
  let allItems = [];
  try {
    allItems = (await api('/items')).items;
  } catch (e) { /* list stays empty */ }

  function show(zone) {
    const list = allItems.filter(i => !zone || i.zone === zone);
    $('#zoneTitle').textContent = zone ? `${zone} reports` : 'All active campus reports';
    $('#zoneItems').innerHTML = list.map(i => `<a class="map-report-card" href="item.html?id=${i.id}"><span class="map-report-icon ${esc(i.type)}">${icon(i.category)}</span><span><b>${esc(i.name)}</b><small>⌖ ${esc(i.zone)}</small></span><strong>→</strong></a>`).join('') || '<p class="empty-map-state">No active reports in this zone.</p>';
  }

  const showAll = $('#showAllZones');
  if (showAll) showAll.onclick = () => show();
  show();

  const el = $('#liveCampusMap');
  if (!el) return;
  if (typeof L === 'undefined') {
    el.innerHTML = '<p class="empty-map-state">The map could not load (no internet connection). Reports are listed below.</p>';
    return;
  }

  const map = L.map(el).setView([data.center.lat, data.center.lng], 17);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  data.zones.forEach(z => {
    const total = z.lost + z.found;
    const marker = L.marker([z.lat, z.lng], {
      title: z.name,
      icon: L.divIcon({
        className: '',
        html: `<span class="live-zone-marker" style="font-size:14px;font-weight:700">${total}</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    }).addTo(map);

    const links = z.items.map(i => `<a href="item.html?id=${i.id}">${i.type === 'lost' ? '🔴' : '🟢'} ${esc(i.name)}</a>`).join('<br>');
    marker.bindPopup(`<b>${esc(z.name)}</b><br>${z.found} found · ${z.lost} lost<br>${links || 'No active reports'}`);
    marker.on('click', () => show(z.name));
  });
})();
