/*
 * CONFIGURACIÓN DEL LOCAL
 *
 * La idea es que esta estructura pueda venir de un backend más adelante.
 * Para la demo, cada local puede tener su propio archivo/configuración.
 */

const potatoExtraOptions = [
  {
    id: "fries-topping",
    name: "Extras para las papas",
    required: false,
    multiple: false,
    choices: [
      { id: "cheddar-bacon", name: "Cheddar y panceta", price: 30 }
    ]
  }
];

export const restaurants = {
  "lKb-smash": {
    id: "lKb-smash",
    name: "LKB Smash",
    tagline: "Simple. Real. Smash.",
    logo: "./assets/img/logo.jpg",
    currency: "$",
    whatsapp: "59894518022",
    locale: "es-UY",
    instagramUrl: "https://www.instagram.com/lkb.smash_burgers/",
    whatsappUrl: "https://wa.me/59894518022",
    whatsappTesting: {
      enabled: false,
      number: "59892972434"
    },
    googleReviewUrl: "",
    featuredProduct: {
      productId: "signature",
      eyebrow: "EL FAVORITO DE LA CASA",
      message: "Nuestra smash más completa, con todo lo que nos representa."
    },

    // Si false, nunca se permiten pedidos aunque esté dentro del horario.
    acceptingOrders: true,

    orderSettings: {
      delivery: true,
      pickup: true,
      notes: true,
      scheduledOrders: false
    },

    paymentMethods: [
      { id: "cash", label: "Efectivo" },
      { id: "transfer", label: "Transferencia" }
    ],
    burgerAndComboIncludes: ["Pan de papa", "Papas fritas"],
    burgerAndComboFriesOptions: potatoExtraOptions,

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
        image: "./assets/img/lgbsignature.jpg",
        price: 450,
        tags: ["popular", "signature"]
      },
      {
        id: "triple",
        categoryId: "burgers",
        name: "La Triple",
        description: "Triple carne, huevo, cheddar, panceta crispy y salsa BBQ.",
        image: "./assets/img/latriple.png",
        price: 390,
        tags: ["popular"]
      },
      {
        id: "especial",
        categoryId: "burgers",
        name: "La Especial",
        description: "Doble carne, cheddar, muzza, jamón, panceta y cebolla caramelizada.",
        image: "./assets/img/laespecial.png",
        price: 370,
        tags: []
      },
      {
        id: "sencillez",
        categoryId: "burgers",
        name: "La Sencillez",
        description: "Doble carne, cheddar, muzza, cebolla, lechuga y tomate.",
        image: "./assets/img/lasencillez.png",
        price: 350,
        tags: []
      },
      {
        id: "cangre",
        categoryId: "burgers",
        name: "Cangre Burger",
        description: "Una carne, cheddar, muzza y Coca-Cola 250 ml.",
        image: "./assets/img/cangreburger.png",
        price: 270,
        tags: ["kids"]
      },
      {
        id: "fries-simple",
        categoryId: "fries",
        name: "Papas simples",
        description: "Papas fritas clásicas. Sumales cheddar y panceta por $30.",
        image: "./assets/img/papassimples.png",
        price: 150,
        tags: [],
        options: potatoExtraOptions
      },
      {
        id: "fries-cheddar-bacon",
        categoryId: "fries",
        name: "Papas con cheddar y panceta",
        description: "Papas fritas con cheddar y panceta.",
        image: "./assets/img/papascheddarybacon.png",
        price: 230,
        tags: ["popular"]
      },
      {
        id: "drink",
        categoryId: "drinks",
        name: "Refresco 600 ml",
        description: "Coca-Cola, Fanta o Sprite.",
        image: "./assets/img/bebidas.png",
        price: 90,
        tags: []
      },
      {
        id: "family",
        categoryId: "combos",
        name: "Combo Familiar",
        description: "2 La Sencillez + 2 La Especial + 2 papas simples + 2 refrescos 600 ml.",
        image: "./assets/img/combofamiliar.png",
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
