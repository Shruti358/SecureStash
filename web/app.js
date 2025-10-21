(function(){
  // Updated date (now)
  const updated = document.querySelector('[data-updated]');
  if(updated){
    const d = new Date();
    const opts = { year:'numeric', month:'short', day:'2-digit' };
    updated.textContent = d.toLocaleDateString(undefined, opts);
  }

  // Footer year
  const yearNode = document.querySelector('[data-year]');
  if(yearNode){ yearNode.textContent = new Date().getFullYear(); }

  // Mirror link: update to point to same APK in a remote host if provided via ?mirror=URL
  const params = new URLSearchParams(location.search);
  const mirror = params.get('mirror');
  const mirrorLink = document.getElementById('mirrorLink');
  if(mirror && mirrorLink){ mirrorLink.href = mirror; mirrorLink.textContent = 'Mirror link'; }
  else if(mirrorLink){ mirrorLink.style.display = 'none'; }

  // Generate a QR code pointing to this page (so users can load and tap download)
  const qrEl = document.getElementById('qrcode');
  if(qrEl && window.QRCode){
    const url = location.href.split('#')[0];
    new QRCode(qrEl, {
      text: url,
      width: 160,
      height: 160,
      correctLevel: QRCode.CorrectLevel.M
    });
  }
})();
