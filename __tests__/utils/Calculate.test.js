import React from 'react';
import { getRupiah} from '../../utils/Calculate';

describe('getRupiaj fuction', () => {
  const notFound = "Harga tidak ditemukan"
  it('should successfully return formatted rupiah', () => {
    expect(getRupiah(1000)).toEqual('Rp1.000');
  });

  it('should return Harga tidak ditemukan on undefined', () => {
    expect(getRupiah(undefined)).toEqual(notFound);
  });

  it('should return Harga tidak ditemukan on null', () => {
    expect(getRupiah(null)).toEqual(notFound);
  });

  it('should return Harga tidak ditemukan on null', () => {
    expect(getRupiah('')).toEqual(notFound);
  });
});


