import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

export function BlockDialog(props) {
  const { isOpen } = props;
  return (
    <Dialog
      disableBackdropClick
      open={isOpen}
      maxWidth="xs"
    >

      <div className="flex txt-center-hoz padding-16 txt-center-ver">
        <CircularProgress />
        <p className="font-muli-14 margin margin-left-16">Sedang memproses ...</p>
      </div>
    </Dialog>
  )
}
