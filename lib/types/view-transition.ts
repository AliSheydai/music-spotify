export type ViewTransitionAPI = {
  startViewTransition?: (updateCallback: () => void | Promise<void>) => { finished: Promise<void> };
};
