/**
 * @method getRupiah
 * @summary melakukan spliting pada input menjadi format mata uang Rp
 * @param nominal
 * @returns {string}
 */
import { isNotUndefined } from './Validator';

export function getRupiah(nominal) {
  if (!isNotUndefined(nominal) || nominal === null || nominal === '') return 'Harga tidak ditemukan';
  return `Rp${nominal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;
}

// ################ Converted to library ################

/**
 * @method countDownTimer
 * @summary custom countdown timer by giving specific date and calculate it based on date now
 * see how to use it on status-pembayaran page
 * @param endDate
 * @returns {{sec: number, hours: number, min: number}|boolean}
 */
// export function countDownTimer(endDate) {
//   let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;
//
//   // clear countdown when date is reached
//   if (diff < 0) return false;
//
//   const timeLeft = {
//     hours: 0,
//     min: 0,
//     sec: 0,
//   };
//
//   if (diff >= 3600) { // 60 * 60
//     timeLeft.hours = Math.floor(diff / 3600);
//     diff -= timeLeft.hours * 3600;
//   }
//   if (diff >= 60) {
//     timeLeft.min = Math.floor(diff / 60);
//     diff -= timeLeft.min * 60;
//   }
//   timeLeft.sec = diff;
//
//   return timeLeft;
// }

/**
 * @method addLeadingZeros
 * @summary menambahkan angka 0 pada waktu yang dibawah 2 digit
 * misal dari 1 menjad 01
 * @param val
 * @returns {string}
 */
// export function addLeadingZeros(val) {
//   let value = String(val);
//   while (value.length < 2) {
//     value = `0${value}`;
//   }
//   return value;
// }
