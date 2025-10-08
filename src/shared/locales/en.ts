export const locales = {
  // Site metadata
  site: {
    title: "Star Wars Intelligence",
    description: "Explore characters, planets, starships, and more with AI",
  },

  // Navigation
  nav: {
    home: "Home",
    characters: "Characters",
    planets: "Planets",
    spaceships: "Spaceships",
    vehicles: "Vehicles",
    aiChat: "AI Chat",
  },

  // Page titles and descriptions
  pages: {
    home: {
      title: "Star Wars source of truth",
      subtitle: "Your complete guide to the galaxy far, far away powered by AI",
    },
    chat: {
      title: "Star Wars AI Chat",
      subtitle: "Get instant answers about characters, lore, planets, and more",
      placeholder: "Ask me anything...",
      emptyState: "Ask anything about the Star Wars universe",
    },
    characters: {
      title: "Characters",
      description:
        "Meet the heroes, villains, and legends that shaped the galaxy's destiny.",
    },
    planets: {
      title: "Planets",
      description:
        "Journey through iconic worlds from desert plains to gleaming city-planets.",
    },
    spaceships: {
      title: "Spaceships",
      description:
        "Discover the legendary vessels that defined space combat and exploration.",
    },
    vehicles: {
      title: "Vehicles",
      description:
        "From speeder bikes to walkers, explore the machines of ground warfare.",
    },
  },

  // Card sections on home page
  homeCards: {
    characters: {
      title: "Characters",
      description: "Explore heroes, villains, and everyone in between",
    },
    planets: {
      title: "Planets",
      description: "Visit worlds from Tatooine to Coruscant",
    },
    spaceships: {
      title: "Spaceships",
      description: "Command the galaxy's most legendary vessels",
    },
    vehicles: {
      title: "Vehicles",
      description: "Pilot speeders, walkers, and battle machines",
    },
    chatButton: "Chat with AI",
  },

  // Field labels
  fields: {
    birthYear: "Birth Year",
    gender: "Gender",
    height: "Height",
    mass: "Mass",
    eyeColor: "Eye Color",
    hairColor: "Hair Color",
    climate: "Climate",
    terrain: "Terrain",
    population: "Population",
    diameter: "Diameter",
    gravity: "Gravity",
    surfaceWater: "Surface Water",
    model: "Model",
    manufacturer: "Manufacturer",
    class: "Class",
    length: "Length",
    crew: "Crew",
    passengers: "Passengers",
    cost: "Cost",
  },

  // Common UI text
  ui: {
    loading: "Loading...",
    endOfList: "You've reached the end of the list",
    backToTop: "Back to top",
    tryAgain: "Try Again",
    previous: "Previous",
    next: "Next",
    send: "Send",
    sending: "Sending...",
  },

  // Error messages
  errors: {
    title: "Oops! Something went wrong",
    generic: "An error occurred. Please try again.",
    retry: "Try Again",
    characters: "Failed to fetch characters",
    planets: "Failed to fetch planets",
    starships: "Failed to fetch starships",
    vehicles: "Failed to fetch vehicles",
    films: "Failed to fetch films",
    species: "Failed to fetch species",
    chat: "Sorry, I encountered an error. Please try again.",
  },

  // Aria labels for accessibility
  aria: {
    chatMessage: "Chat message",
    sendMessage: "Send message",
    sendingMessage: "Sending message",
    previousPage: "Previous page",
    nextPage: "Next page",
    goToPage: "Go to page",
    mainNavigation: "Main navigation",
    pagination: "Pagination",
  },
} as const;

export type Locales = typeof locales;
