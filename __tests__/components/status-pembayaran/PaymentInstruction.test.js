import React from 'react';
import { PaymentInstruction } from '../../../components/status-pembayaran/PaymentInstruction';

describe('Payement Instruction', () => {
  const paymentInfoString = { instruction_message: ['Harga tidak ditemukan'] };
  const paymentInfoCompelete = { instruction_message: [{ title: 'bayar', content: 'ini konten' }] };

  it('should passing title and content if payment info complete array', () => {
    PaymentInstruction(paymentInfoCompelete);
  });

  it('should passing default title if payment info complete array', () => {
    PaymentInstruction(paymentInfoString);
  });
});
