import React from 'react';

/**
 * Company Logo function to display Company Logo that set detail product
 * @returns {*}
 * @constructor
 */
export default function CompanyLogo(props) {
  // eslint-disable-next-line
  const {src, className} = props;
  return (
    <img
      id="companyLogo"
      src={src}
      style={{ height: '45px' }}
      className={className}
    />
  );
}
