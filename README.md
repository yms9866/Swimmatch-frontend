# SwimMatch

**SwimMatch** is an intelligent, location-aware swimming marketplace built with React. It connects swimmers with swimming instructors and service providers through personalized search, filtering, and matching.

Users can explore swimming lessons, compare instructors and providers, view provider details, save their preferred providers, manage swimmer profiles, and submit booking requests.

## Live Application

[SwimMatch – Live Demo](https://swimmatch.vercel.app)

## Features

- **Browse Services:** Explore available swimming lessons and services.
- **Find Instructors:** Discover swimming instructors and review their profiles.
- **Search and Filter:** Filter results based on swimming level, lesson type, budget, location, availability, and other preferences.
- **Provider Details:** View provider information and available services.
- **Personalized Matching:** Discover relevant swimming services based on swimmer preferences.
- **Saved Providers:** Save preferred providers for future reference.
- **Swimmer Profile:** Create and update swimmer profile information.
- **Booking Requests:** Submit booking requests and review booking summaries.
- **Interactive Maps:** View provider locations using OpenStreetMap.

## Technologies

- React
- JavaScript
- Vite
- CSS
- REST API
- Browser Local Storage
- OpenStreetMap

## Prerequisites

- Node.js 22.22 or newer
- npm (included with Node.js)
- Internet connection for API and map data

## Installation and Setup

Clone the repository and navigate to the project directory.

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## API Configuration

The application communicates with its backend through a REST API.

- **API Base URL:** https://swimmatch.onrender.com
- **Configuration:** `src/services/providers.js`
- **Environment Variables:** No `.env` file or additional environment variables are currently required.

An active internet connection is required to retrieve provider, service, instructor, booking, and map data.

If the API becomes unavailable, the application displays route-level error messages with an option to retry.

## Data Persistence

The application uses browser Local Storage to preserve selected user information between sessions.

The following information is persisted locally:

- Swimmer profile details
- Saved providers
- Booking summaries

This information is browser-specific and is not automatically synchronized across different devices or browsers.

## Maps

Provider locations are displayed using OpenStreetMap embeds. No API key is required.

## Project Status

SwimMatch is an academic team project developed as part of the ISTE 340 Client Programming course.