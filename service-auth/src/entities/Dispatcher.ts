export interface Dispatcher {
  dispatch(
    route: { url: string; method: string },
    packet: { [key: string]: any }
  ): Promise<string>;
}
