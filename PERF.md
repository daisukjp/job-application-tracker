## Baseline Issue

- Rendering the Applications List with 1000 items caused noticeable lag and slow scrolling.
- React re-rendered a large number of rows whenever filters or sorting changed.

## Changes

- Added dev-only seeding of 1000 mock applications.
- Introduced virtualization with `react-virtuoso` so only visible rows render.
- Memoized row cells and header components.
- Used `useCallback` for row handlers to avoid unnecessary re-renders.

## Results (Observed)

- Scrolling is smooth because only visible rows render.
- Render count reduced; React no longer re-renders hundreds of rows per update.
- Filters and sorting feel faster due to reduced DOM work.
