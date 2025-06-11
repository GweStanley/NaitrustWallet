 const signinForm = document.getElementById('signinForm');
  signinForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const role = document.querySelector('input[name="role"]:checked').value;
    const accountNumber = document.getElementById('signinAccountNumber').value;
    const phone = document.getElementById('signinPhone').value;
    const password = document.getElementById('signinPassword').value;

    if (role === 'sub-admin') {
      const res = await fetch('/api/validate-subadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, phone })
      });
      const data = await res.json();
      if (!data.valid) {
        alert(`Access denied. You are not an admin to account ${accountNumber}.`);
        return;
      }
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, accountNumber, phone, password })
    });

    const data = await res.json();
    if (data.success) {
      location.href = '/dashboard.html';
    } else {
      alert(data.message || 'Login failed.');
    }
  });