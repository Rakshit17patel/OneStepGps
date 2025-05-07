import React from 'react';

type ScreenName = 'AppLoader' | 'HomePage' | 'DeviceDetailsPage' | 'MapView';

type ScreenType = React.ComponentType<any>;
type ScreenBuilderType = () => ScreenType;

let screenBuilderRegistry = new Map<ScreenName, ScreenBuilderType>();

/**
 * Returns a function for lazily loading a screen.
 */
export default function getScreenBuilder(
  screen: ScreenName,
): ScreenBuilderType {
  if (!screenBuilderRegistry.has(screen)) {
    let cached: ScreenType | null = null;
    const builder = () => {
      if (cached === null) {
        const start = global.performance.now();
        cached = getScreen(screen);
        if (typeof cached === 'function') {
          cached = React.memo(cached); // Memoize for performance
        }
        const end = global.performance.now();
        console.log(
          `Lazily registered Screen "${screen}" in ${end - start}ms!`,
        );
      }
      return cached;
    };
    screenBuilderRegistry.set(screen, builder);
  }

  return screenBuilderRegistry.get(screen)!;
}

function getScreen(screenName: ScreenName): ScreenType {
  switch (screenName) {
    case 'AppLoader':
      return require('../screens/AppLoader').default;
    case 'HomePage':
      return require('../screens/HomePage/HomePage').default;
    case 'DeviceDetailsPage':
      return require('../screens/DeviceDetailPage/DeviceDetailPage').default;
    case 'MapView':
      return require('../screens/MapView/MapView').default;
    default:
      return assertUnreachableScreen(screenName);
  }
}

function assertUnreachableScreen(screenName: never): never {
  throw new Error(
    `Failed to create screen builder for screen name "${screenName}"`,
  );
}
