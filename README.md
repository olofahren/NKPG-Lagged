# NKPG-Lagged

This is the `NKPG-Lagged` project, a web application built with [Next.js](https://nextjs.org) and [React](https://reactjs.org). The project uses [Leaflet](https://leafletjs.com/) for interactive maps and Firebase for backend services.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `src/components/`: Contains React components used throughout the application.
  - `MyMap.tsx`: Component for rendering the interactive map using Leaflet.
  - `LeaderBoard.tsx`: Component for displaying the leaderboard.
- `src/app/utils/`: Contains utility functions and Firebase integration.
  - `firebase.ts`: Functions for interacting with Firebase.
  - `mapFunctions.ts`: Utility functions for map-related operations.
- `public/`: Contains static files such as images and JSON data.
  - `areas.json`: GeoJSON data for map areas.

## Features

- **Interactive Map**: Uses Leaflet to display an interactive map with markers and polygons.
- **Real-time Updates**: Integrates with Firebase to provide real-time updates for team positions and area claims.
- **Leaderboard**: Displays a leaderboard with team rankings based on points.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs/getting-started.html) - Learn about React.
- [Leaflet Documentation](https://leafletjs.com/) - Learn about Leaflet for interactive maps.
- [Firebase Documentation](https://firebase.google.com/docs) - Learn about Firebase for backend services.