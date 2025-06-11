const transactions = [
      {
        id: 'TX12345',
        account: 'ACCT-0001',
        initiator: 'Admin +237654321000',
        amount: 25000,
        purpose: 'Rent Deposit',
        approver1: 'Pending',
        approver2: 'Pending',
        startTime: new Date().getTime()
      },
      {
        id: 'TX67890',
        account: 'ACCT-0002',
        initiator: 'Sub Admin +237650000111',
        amount: 12000,
        purpose: 'Service Payment',
        approver1: 'Approved',
        approver2: 'Pending',
        startTime: new Date().getTime()
      }
    ];

    const txList = document.getElementById('transactionList');
    const noTx = document.getElementById('noTx');

    if (transactions.length === 0) {
      noTx.style.display = 'block';
    } else {
      transactions.forEach((tx, index) => {
        const cardId = `collapseTx${index}`;
        const timerId = `timer-${tx.id}`;
        const card = document.createElement('div');
        card.className = 'card shadow mb-3';

        card.innerHTML = `
          <div class="card-header bg-light d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#${cardId}">
            <span><strong>Transaction #${tx.id}</strong></span>
            <span class="badge bg-orange text-white"><span id="${timerId}">15:00</span></span>
          </div>
          <div id="${cardId}" class="collapse">
            <div class="card-body">
              <p><strong>Initiator:</strong> ${tx.initiator}</p>
              <p><strong>Account:</strong> ${tx.account}</p>
              <p><strong>Amount:</strong> Fcfa ${tx.amount}</p>
              <p><strong>Purpose:</strong> ${tx.purpose}</p>
              <p><strong>Approver 1:</strong> ${tx.approver1} | <strong>Approver 2:</strong> ${tx.approver2}</p>
              <button class="btn btn-success btn-sm me-2" onclick="promptApproval('${tx.id}')">Approve</button>
              <button class="btn btn-danger btn-sm" onclick="rejectTx('${tx.id}')">Reject</button>
            </div>
          </div>
        `;
        txList.appendChild(card);
        startCountdown(tx.startTime, timerId);
      });
    }

    function startCountdown(startTime, timerId) {
      const endTime = startTime + 15 * 60 * 1000;
      const timerElement = document.getElementById(timerId);
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;
        if (distance < 0) {
          clearInterval(interval);
          timerElement.textContent = "Expired";
          timerElement.classList.remove("bg-orange");
          timerElement.classList.add("bg-danger");
        } else {
          const minutes = Math.floor(distance / 60000);
          const seconds = Math.floor((distance % 60000) / 1000);
          timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }, 1000);
    }

    let attempts = 3;
    const correctPassword = "saved Password";

    function promptApproval(txId) {
      document.getElementById('txToApprove').value = txId;
      document.getElementById('txLabel').textContent = `Transaction #${txId}`;
      document.getElementById('approvalPassword').value = '';
      const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
      modal.show();
    }

    function confirmApproval() {
      const txId = document.getElementById('txToApprove').value;
      const password = document.getElementById('approvalPassword').value;

      if (password === '') {
        alert('Password is required to approve.');
        return;
      }

      if (password === correctPassword) {
        alert(`✅ Transaction ${txId} approved successfully.`);
        const modal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
        modal.hide();
        attempts = 3;
      } else {
        attempts--;
        if (attempts > 0) {
          alert(`❌ Wrong password. ${attempts} attempt(s) remaining.`);
          document.getElementById('approvalPassword').value = '';
        } else {
          alert('🚫 Access denied. Maximum attempts exceeded.');
          const modal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
          modal.hide();
          attempts = 3;
        }
      }
    }

    function rejectTx(txId) {
      if (confirm(`Are you sure you want to reject transaction ${txId}?`)) {
        alert(`❗ Transaction ${txId} rejected by the designated signatory.`);
      }
    }