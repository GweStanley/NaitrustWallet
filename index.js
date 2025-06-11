let balance = 0.00;

    function updateBalanceDisplay() {
      document.getElementById('balance-display').textContent =
        `${balance.toFixed(2)}`;
    }

    // Deposit
    document.getElementById('btn-deposit').addEventListener('click', () => {
      Swal.fire({
        title: 'Deposit Funds',
        input: 'number',
        inputLabel: 'Enter amount to deposit',
        inputAttributes: { min: 1, step: 0.01 },
        showCancelButton: true,
        confirmButtonText: 'Deposit',
      }).then(result => {
        if (result.isConfirmed) {
          const amt = parseFloat(result.value);
          if (isNaN(amt) || amt <= 0) {
            Swal.fire('Invalid Amount', 'Please enter a positive number.', 'error');
          } else {
            balance += amt;
            updateBalanceDisplay();
            Swal.fire('Success', `Fcfa ${amt.toFixed(2)} deposited.`, 'success');
          }
        }
      });
    });

    // Withdraw
    document.getElementById('btn-withdraw').addEventListener('click', async () => {
      const { value: amt } = await Swal.fire({
        title: 'Withdraw Funds',
        input: 'number',
        inputLabel: 'Enter amount to withdraw',
        inputAttributes: { min: 1, step: 0.01 },
        showCancelButton: true,
        confirmButtonText: 'Next',
      });
      const amount = parseFloat(amt);
      if (!amt) return;
      if (isNaN(amount) || amount <= 0) {
        return Swal.fire('Invalid Amount', 'Please enter a positive number.', 'error');
      }
      if (amount > balance) {
        return Swal.fire('Insufficient Balance', 'You do not have enough funds.', 'error');
      }
      const { value: pin } = await Swal.fire({
        title: 'PIN Verification',
        input: 'password',
        inputLabel: 'Enter your 4-digit PIN',
        inputAttributes: { maxlength: 4, pattern: '\\d*' },
        showCancelButton: true,
        confirmButtonText: 'Verify',
      });
      if (pin !== '1234') {
        return Swal.fire('Wrong PIN', 'The PIN you entered is incorrect.', 'error');
      }
      const { value: otp } = await Swal.fire({
        title: 'OTP Verification',
        html: `<p>We sent an OTP to your phone.</p>
               <input type="text" id="swal-otp" class="swal2-input" placeholder="Enter OTP">`,
        focusConfirm: false,
        preConfirm: () => document.getElementById('swal-otp').value,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
      });
      if (otp !== '000000') {
        return Swal.fire('Wrong OTP', 'The OTP you entered is incorrect.', 'error');
      }
      balance -= amount;
      updateBalanceDisplay();
      Swal.fire('Withdrawal Successful', `Fcfa ${amount.toFixed(2)} withdrawn.`, 'success');
    });

    // Transfer
    document.getElementById('btn-transfer').addEventListener('click', async () => {
      // 1. Recipient account
      const { value: recipient } = await Swal.fire({
        title: 'Internal Transfer',
        input: 'text',
        inputLabel: 'Enter recipient NiaTrust account number',
        inputPlaceholder: 'e.g. NT-12345678',
        showCancelButton: true,
        confirmButtonText: 'Next',
      });
      if (!recipient) return;

      // 2. Amount
      const { value: amt } = await Swal.fire({
        title: 'Transfer Amount',
        input: 'number',
        inputLabel: `Enter amount to transfer to ${recipient}`,
        inputAttributes: { min: 1, step: 0.01 },
        showCancelButton: true,
        confirmButtonText: 'Next',
      });
      const amount = parseFloat(amt);
      if (!amt) return;
      if (isNaN(amount) || amount <= 0) {
        return Swal.fire('Invalid Amount', 'Please enter a positive number.', 'error');
      }
      if (amount > balance) {
        return Swal.fire('Insufficient Balance', 'You do not have enough funds.', 'error');
      }

      // 3. PIN 
      const { value: pin } = await Swal.fire({
        title: 'PIN Verification',
        input: 'password',
        inputLabel: 'Enter your 4-digit PIN',
        inputAttributes: { maxlength: 4, pattern: '\\d*' },
        showCancelButton: true,
        confirmButtonText: 'Verify',
      });
      if (pin !== '1234') {
        return Swal.fire('Wrong PIN', 'The PIN you entered is incorrect.', 'error');
      }

      // 4. OTP
      const { value: otp } = await Swal.fire({
        title: 'OTP Verification',
        html: `<p>We sent an OTP to your phone.</p>
               <input type="text" id="swal-otp-transfer" class="swal2-input" placeholder="Enter OTP">`,
        focusConfirm: false,
        preConfirm: () => document.getElementById('swal-otp-transfer').value,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
      });
      if (otp !== '000000') {
        return Swal.fire('Wrong OTP', 'The OTP you entered is incorrect.', 'error');
      }

      // Complete transfer
      balance -= amount;
      updateBalanceDisplay();
      Swal.fire('Transfer Successful', `Fcfa ${amount.toFixed(2)} sent to ${recipient}.`, 'success');
    });

    // Initialize display
    updateBalanceDisplay();