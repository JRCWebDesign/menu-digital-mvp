/*
 * CONFIGURACIÓN DEL LOCAL
 *
 * La idea es que esta estructura pueda venir de un backend más adelante.
 * Para la demo, cada local puede tener su propio archivo/configuración.
 */

export const restaurants = {
  "lKb-smash": {
    id: "lKb-smash",
    name: "LKB Smash",
    tagline: "Simple. Real. Smash.",
    currency: "$",
    whatsapp: "598XXXXXXXX",
    locale: "es-UY",

    // Si false, nunca se permiten pedidos aunque esté dentro del horario.
    acceptingOrders: true,

    orderSettings: {
      delivery: true,
      pickup: true,
      notes: true,
      scheduledOrders: false
    },

    // 0 = domingo, 1 = lunes ... 6 = sábado
    schedule: {
      0: [{ open: "20:00", close: "00:00" }],
      1: [{ open: "20:00", close: "00:00" }],
      2: [{ open: "20:00", close: "00:00" }],
      3: [{ open: "20:00", close: "00:00" }],
      4: [{ open: "20:00", close: "00:00" }],
      5: [{ open: "20:00", close: "01:00" }],
      6: [{ open: "20:00", close: "01:00" }]
    },

    categories: [
      { id: "burgers", name: "Hamburguesas" },
      { id: "fries", name: "Papas" },
      { id: "drinks", name: "Bebidas" },
      { id: "combos", name: "Combos" }
    ],

    products: [
      {
        id: "signature",
        categoryId: "burgers",
        name: "LKB Signature",
        description: "Triple carne, huevo, doble cheddar, muzza, jamón, cebolla caramelizada, panceta crispy y salsa exclusiva.",
        price: 450,
        tags: ["popular", "signature"],
        options: [
          {
            id: "extras",
            name: "Extras",
            required: false,
            multiple: true,
            choices: [
              { id: "extra-cheddar", name: "Extra cheddar", price: 30 },
              { id: "extra-bacon", name: "Extra panceta", price: 40 }
            ]
          }
        ]
      },
      {
        id: "triple",
        categoryId: "burgers",
        name: "La Triple",
        description: "Triple carne, huevo, cheddar, panceta crispy y salsa BBQ.",
        price: 390,
        tags: ["popular"]
      },
      {
        id: "especial",
        categoryId: "burgers",
        name: "La Especial",
        description: "Doble carne, cheddar, muzza, jamón, panceta y cebolla caramelizada.",
        price: 370,
        tags: []
      },
      {
        id: "sencillez",
        categoryId: "burgers",
        name: "La Sencillez",
        description: "Doble carne, cheddar, muzza, cebolla, lechuga y tomate.",
        price: 350,
        tags: []
      },
      {
        id: "cangre",
        categoryId: "burgers",
        name: "Cangre Burger",
        description: "Una carne, cheddar, muzza y Coca-Cola 250 ml.",
        price: 270,
        tags: ["kids"]
      },
      {
        id: "fries-simple",
        categoryId: "fries",
        name: "Papas simples",
        description: "Papas fritas.",
        price: 150,
        tags: []
      },
      {
        id: "fries-cheddar-bacon",
        categoryId: "fries",
        name: "Papas con cheddar y panceta",
        description: "Papas fritas con cheddar y panceta.",
        price: 230,
        tags: ["popular"]
      },
      {
        id: "fries-extra",
        categoryId: "fries",
        name: "Extra cheddar y panceta",
        description: "Agregado para tus papas.",
        price: 30,
        tags: ["extra"]
      },
      {
        id: "drink",
        categoryId: "drinks",
        name: "Refresco 600 ml",
        description: "Coca-Cola, Fanta o Sprite.",
        price: 90,
        tags: []
      },
      {
        id: "family",
        categoryId: "combos",
        name: "Combo Familiar",
        description: "2 La Sencillez + 2 La Especial + 2 papas simples + 2 refrescos 600 ml.",
        price: 1350,
        tags: ["popular", "combo"],
        fixedItems: [
          { productId: "sencillez", quantity: 2 },
          { productId: "especial", quantity: 2 },
          { productId: "fries-simple", quantity: 2 },
          { productId: "drink", quantity: 2 }
        ]
      }
    ]
  }
};
