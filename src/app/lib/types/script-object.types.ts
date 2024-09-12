export type ScriptObject = {
  text: string;
  textId?: number;
  focussedDiv?: string;
  userAction?: UserActionObject;
};

export type UserActionObject = {
  userActionType: string,
  targetPhrase?: string,
  elementId?: string,
  prompt?: string,
  customFunction?: Function,
}