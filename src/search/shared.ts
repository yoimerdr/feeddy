export const dateTypes = ["published", "updated"] as const,
  parametersMap = {
    "max-results": "max",
    "start-index": "start",
    "published-min": "publishedAtLeast",
    "published-max": "publishedAtMost",
    "updated-min": "updatedAtLeast",
    "updated-max": "updatedAtMost",
    "orderby": "order",
    "q": "query",
    "alt": "alt",
  };
