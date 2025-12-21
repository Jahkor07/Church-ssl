// Helper functions for creating notifications

/**
 * Create a notification
 * @param title - Notification title
 * @param message - Notification message
 * @param type - Notification type (info | success | warning | error)
 */
export async function createNotification(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<void> {
  try {
    // In a real app, this would make an API call to create a notification
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[NOTIFICATION] ${type.toUpperCase()}: ${title} - ${message}`);
    }

    // Make API call to create notification
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, message, type }),
    });
  } catch (error) {
    // Silently fail if notification creation fails
    console.error('Failed to create notification:', error);
  }
}

/**
 * Create lesson-related notification
 */
export async function createLessonNotification(
  action: 'created' | 'updated' | 'deleted',
  lessonTitle: string
): Promise<void> {
  const title = `Lesson ${action.charAt(0).toUpperCase() + action.slice(1)}`;
  const message = `Lesson "${lessonTitle}" has been ${action}`;
  const type = action === 'deleted' ? 'warning' : 'success';
  
  await createNotification(title, message, type);
}

/**
 * Create quarter-related notification
 */
export async function createQuarterNotification(
  action: 'added' | 'modified',
  quarter: string
): Promise<void> {
  const title = `Quarter ${action.charAt(0).toUpperCase() + action.slice(1)}`;
  const message = `Quarter "${quarter}" has been ${action}`;
  await createNotification(title, message, 'info');
}

/**
 * Create user login notification
 */
export async function createUserLoginNotification(
  userEmail: string
): Promise<void> {
  const title = 'User Login';
  const message = `User ${userEmail} has logged in`;
  await createNotification(title, message, 'info');
}

/**
 * Create backend error notification
 */
export async function createBackendErrorNotification(
  error: string
): Promise<void> {
  const title = 'Backend Error';
  const message = error;
  await createNotification(title, message, 'error');
}