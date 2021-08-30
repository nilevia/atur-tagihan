import React from 'react';
import {additionalProductURL} from '../../utils/MappingIdToUrl';

describe('additionalProductURL', () => {
  it('should return url /pulsa-dan-data on 5 id', () => {
    expect(additionalProductURL(5)).toEqual('/pulsa-dan-data');
  });
  it('should return url /token-listrik on 6 id', () => {
    expect(additionalProductURL(6)).toEqual('/token-listrik');
  });
  it('should return url /pulsa-dan-data on 7 id', () => {
    expect(additionalProductURL(7)).toEqual('/pulsa-dan-data');
  });
  it('should return url 404 on other id id', () => {
    expect(additionalProductURL(10)).toEqual('/404');
  });

});
