import React from 'react';
import {copyToClipboard} from '../../utils/CommonUtils';

describe('copyToClipboard fuction', () => {
  it('should return true on copy', () => {
    document.execCommand = jest.fn();
    expect(copyToClipboard('some text')).toEqual(true);
  });
});
