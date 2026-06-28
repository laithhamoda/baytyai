export interface ActionSuccess<T = undefined> {
  success: true;
  data: T;
}

export interface ActionError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionResult<T = undefined> = ActionSuccess<T> | ActionError;

export function ok<T>(data: T): ActionSuccess<T> {
  return { success: true, data };
}

export function err(error: string, fieldErrors?: Record<string, string[]>): ActionError {
  return { success: false, error, fieldErrors };
}
