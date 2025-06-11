 let escrowBalance = 0;

    document.getElementById('btnEscrowTopup').addEventListener('click', () => {
      Swal.fire({
        title: 'Top Up Escrow Wallet',
        input: 'number',
        inputLabel: 'Enter amount to top up',
        inputAttributes: { min: 1, step: 0.01 },
        showCancelButton: true,
        confirmButtonText: 'Top Up'
      }).then(result => {
        const amt = parseFloat(result.value);
        if (!result.isConfirmed || isNaN(amt) || amt <= 0) {
          return Swal.fire('Invalid Amount', 'Please enter a valid number.', 'error');
        }
        escrowBalance += amt;
        document.getElementById('escrow-balance').textContent = escrowBalance.toFixed(2);
        Swal.fire('Escrow Funded', `Fcfa ${amt.toFixed(2)} added.`, 'success');
      });
    });

    document.getElementById('escrowForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('escrowName').value;
      const approver1 = document.getElementById('approver1').value;
      const approver2 = document.getElementById('approver2').value;
      const amount = parseFloat(document.getElementById('initialAmount').value);

      if (isNaN(amount) || amount <= 0) {
        return Swal.fire('Invalid Amount', 'Please enter a valid amount.', 'error');
      }

      escrowBalance += amount;
      document.getElementById('escrow-balance').textContent = escrowBalance.toFixed(2);

      Swal.fire({
        icon: 'success',
        title: 'Escrow Initialized',
        html: `
          <p>Escrow <strong>${name}</strong> started with:</p>
          <ul>
            <li>Approver 1: ${approver1}</li>
            <li>Approver 2: ${approver2}</li>
            <li>Initial Amount: Fcfa ${amount.toFixed(2)}</li>
          </ul>
        `
      });

      document.getElementById('escrowForm').reset();
    });