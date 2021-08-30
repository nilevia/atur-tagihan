import React from 'react';
import PaymentInfoCard from '../global-component/PaymentInfoCard';

export function PaymentInstruction(paymentInfo) {

  // Array lengkap, ada title dan content
  if(paymentInfo.instruction_message[0].title) {
    return paymentInfo.instruction_message.map((item) => (
      <PaymentInfoCard title={item.title} isOpen={false} splittedInstruction={item.content.split('\n')} />),
    );
  }
  // Array hanya konten
  else {
    const splittedInstruction = paymentInfo.instruction_message.toString().split('\n');
    return <PaymentInfoCard title="Cara Pembayaran" isOpen={true} splittedInstruction={splittedInstruction} />;
  }
}
