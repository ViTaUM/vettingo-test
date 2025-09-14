export type ServerActionResponse<T, E extends Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
      action?: string;
    };
