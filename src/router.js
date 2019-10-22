// @flow

export default class Router {
  // This class abstracts the fast storage of commands in localStorage

  constructor() {}

  registerCommand(key: string, state: ?any): void {}

  registerRegex(regex: string, state: ?any): void {}

  getSearchForQuery(query: string): string {
    return "";
  }

  getSuggestForQuery(query: string): Array<[string, string]> {
    return [];
  }
}
