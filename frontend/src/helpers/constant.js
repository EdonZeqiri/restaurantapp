export const routes = [
  {
    role: "admin",
    items: [
      { name: "Manage Users", to: "/users" },
      { name: "Manage Restaurants", to: "/restaurants" },
    ],
  },
  {
    role: "owner",
    items: [
      { name: "Pending Reviews", to: "/reviews" },
      { name: "Restaurants", to: "/restaurants" },
    ],
  },
  {
    role: "user",
    items: [{ name: "Restaurants", to: "/restaurants" }],
  },
];
