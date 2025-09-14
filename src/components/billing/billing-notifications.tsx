'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface BillingNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
}

interface BillingNotificationsProps {
  notifications: BillingNotification[];
  onDismiss: (id: string) => void;
}

export default function BillingNotifications({ notifications, onDismiss }: BillingNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<BillingNotification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    notifications.forEach((notification) => {
      if (!notification.persistent && notification.duration !== 0) {
        const duration = notification.duration || 5000;
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onDismiss]);

  const getIcon = (type: NotificationType) => {
    const iconClass = 'h-5 w-5 flex-shrink-0';

    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  const getButtonColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-green-600 hover:text-green-800 focus:ring-green-500';
      case 'error':
        return 'text-red-600 hover:text-red-800 focus:ring-red-500';
      case 'warning':
        return 'text-yellow-600 hover:text-yellow-800 focus:ring-yellow-500';
      case 'info':
        return 'text-blue-600 hover:text-blue-800 focus:ring-blue-500';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out ${getBackgroundColor(notification.type)}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${getTextColor(notification.type)}`}>{notification.title}</h3>
              <p className={`mt-1 text-sm ${getTextColor(notification.type)} opacity-90`}>{notification.message}</p>
              {notification.action && (
                <div className="mt-3">
                  <button
                    onClick={notification.action.onClick}
                    className={`text-sm font-medium underline ${getButtonColor(notification.type)}`}>
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => onDismiss(notification.id)}
                className={`rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none ${getButtonColor(notification.type)}`}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

class NotificationManager {
  private notifications: BillingNotification[] = [];
  private listeners: Set<(notifications: BillingNotification[]) => void> = new Set();

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  add(notification: Omit<BillingNotification, 'id'>): string {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const fullNotification: BillingNotification = {
      id,
      ...notification,
    };

    this.notifications.push(fullNotification);
    this.notify();

    return id;
  }

  remove(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear(): void {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener: (notifications: BillingNotification[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);

    return () => {
      this.listeners.delete(listener);
    };
  }

  success(title: string, message: string, action?: BillingNotification['action']): string {
    return this.add({
      type: 'success',
      title,
      message,
      action,
      duration: 5000,
    });
  }

  error(title: string, message: string, action?: BillingNotification['action']): string {
    return this.add({
      type: 'error',
      title,
      message,
      action,
      persistent: true,
    });
  }

  warning(title: string, message: string, action?: BillingNotification['action']): string {
    return this.add({
      type: 'warning',
      title,
      message,
      action,
      duration: 7000,
    });
  }

  info(title: string, message: string, action?: BillingNotification['action']): string {
    return this.add({
      type: 'info',
      title,
      message,
      action,
      duration: 5000,
    });
  }
}

export const billingNotifications = new NotificationManager();

export function useBillingNotifications() {
  const [notifications, setNotifications] = useState<BillingNotification[]>([]);

  useEffect(() => {
    return billingNotifications.subscribe(setNotifications);
  }, []);

  const dismiss = (id: string) => {
    billingNotifications.remove(id);
  };

  return {
    notifications,
    dismiss,
    success: billingNotifications.success.bind(billingNotifications),
    error: billingNotifications.error.bind(billingNotifications),
    warning: billingNotifications.warning.bind(billingNotifications),
    info: billingNotifications.info.bind(billingNotifications),
    clear: billingNotifications.clear.bind(billingNotifications),
  };
}
