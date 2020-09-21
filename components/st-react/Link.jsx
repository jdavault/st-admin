import React from 'react';
import NextLink from 'next/link';

const Link = ({to, children, ...props}) => !to ?
  null :
  <NextLink href={to}><a {...props}>{children}</a></NextLink>;

export default Link;
