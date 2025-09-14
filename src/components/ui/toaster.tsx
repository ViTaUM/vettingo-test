'use client';

import { Toaster as RootToaster } from 'react-hot-toast';
import UIToastMessage from './toast-message';

export default function UIToaster() {
  const duration = 3000;

  return (
    <RootToaster
      position="bottom-right"
      toastOptions={{
        duration,
      }}>
      {({ id, message, type, duration, visible }) => (
        <UIToastMessage
          id={id}
          message={message?.toString() ?? ''}
          type={type}
          duration={duration ?? 0}
          visible={visible}
        />
      )}
    </RootToaster>
  );
}
