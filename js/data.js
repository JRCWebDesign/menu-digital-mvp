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
    tagline: "🍔 Sabor, calidad, identidad.\nUna nueva forma de disfrutar una burger\n📍 La Paz - Las Piedras\n⏰ Mié a Vie: 19:30 a 23:30hs | Sáb: 19:30 a 00hs",
    logo: "/assets/img/logo.jpg",
    currency: "$",
    whatsapp: "59894518022",
    locale: "es-UY",
    instagramUrl: "https://www.instagram.com/lkb.smash_burgers/",
    whatsappUrl: "https://wa.me/59894518022",
    whatsappTesting: {
      enabled: true,
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
      3: [{ open: "19:30", close: "23:30" }],
      4: [{ open: "19:30", close: "23:30" }],
      5: [{ open: "19:30", close: "23:30" }],
      6: [{ open: "19:30", close: "00:00" }]
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
        image: "/assets/img/lgbsignature.jpg",
        price: 450,
        tags: ["popular", "signature"]
      },
      {
        id: "triple",
        categoryId: "burgers",
        name: "La Triple",
        description: "Triple carne, huevo, cheddar, panceta crispy y salsa BBQ.",
        image: "/assets/img/latriple.png",
        price: 390,
        tags: ["popular"]
      },
      {
        id: "especial",
        categoryId: "burgers",
        name: "La Especial",
        description: "Doble carne, cheddar, muzza, jamón, panceta y cebolla caramelizada.",
        image: "/assets/img/laespecial.png",
        price: 370,
        tags: []
      },
      {
        id: "sencillez",
        categoryId: "burgers",
        name: "La Sencillez",
        description: "Doble carne, cheddar, muzza, cebolla, lechuga y tomate.",
        image: "/assets/img/lasencillez.png",
        price: 350,
        tags: []
      },
      {
        id: "cangre",
        categoryId: "burgers",
        name: "Cangre Burger",
        description: "Una carne, cheddar, muzza y Coca-Cola 250 ml.",
        image: "/assets/img/cangreburger.png",
        price: 270,
        tags: ["kids"]
      },
      {
        id: "fries-simple",
        categoryId: "fries",
        name: "Papas simples",
        description: "Papas fritas clásicas. Sumales cheddar y panceta por $30.",
        image: "/assets/img/papassimples.png",
        price: 150,
        tags: [],
        options: potatoExtraOptions
      },
      {
        id: "fries-cheddar-bacon",
        categoryId: "fries",
        name: "Papas con cheddar y panceta",
        description: "Papas fritas con cheddar y panceta.",
        image: "/assets/img/papascheddarybacon.png",
        price: 230,
        tags: ["popular"]
      },
      {
        id: "drink",
        categoryId: "drinks",
        name: "Refresco 600 ml",
        description: "Coca-Cola, Fanta o Sprite.",
        image: "/assets/img/bebidas.png",
        price: 90,
        tags: []
      },
      {
        id: "family",
        categoryId: "combos",
        name: "Combo Familiar",
        description: "2 La Sencillez + 2 La Especial + 2 papas simples + 2 refrescos 600 ml.",
        image: "/assets/img/combofamiliar.png",
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

restaurants["burger-house"] = {
  ...structuredClone(restaurants["lKb-smash"]),
  id: "burger-house",
  name: "Burger House Company",
  theme: {
    primary: "#931b21",
    accent: "#fbb431",
    markColor: "#ffffff",
    glow: "rgba(251, 180, 49, .2)",
    pageGlow: "rgba(251, 180, 49, .12)",
    surfaceSoft: "#fff5df",
    focusRing: "rgba(251, 180, 49, .5)"
  },
  tagline: "Menú de muestra · pendiente de personalizar.",
  logo: "/assets/img/burger-house/logo.png",
  whatsapp: "59892972434",
  locale: "es-UY",
  instagramUrl: "",
  whatsappUrl: "https://wa.me/59892972434",
  whatsappTesting: {
    enabled: true,
    number: "59892972434"
  },
  googleReviewUrl: "",
  featuredProduct: null,
  acceptingOrders: true,
  burgerAndComboIncludes: [],
  burgerAndComboFriesOptions: [],
  categories: [
    { id: "burgers", name: "Hamburguesas" },
    { id: "combos", name: "Combos" },
    { id: "extras", name: "Extras" },
    { id: "fries", name: "Papas" },
    { id: "drinks", name: "Bebidas" }
  ],
  products: [
    {
      id: "double-payburger-fries",
      categoryId: "combos",
      name: "Doble PayBurger + papas",
      description: "Promo del día.",
      price: 390,
      originalPrice: 450,
      tags: ["promotion"]
    },
    {
      id: "double-quarter-pounder-fries",
      categoryId: "combos",
      name: "Doble cuarto de libra + papas",
      description: "Promo del día.",
      price: 390,
      originalPrice: 450,
      tags: ["promotion"]
    },
    {
      id: "double-cheese-family",
      categoryId: "combos",
      name: "2 doble Cheese + 2 papas cheddar y bacon",
      description: "Promo bajonera dúo.",
      price: 850,
      originalPrice: 1100,
      tags: ["promotion"]
    },
    {
      id: "three-plus-one-classic",
      categoryId: "combos",
      name: "3 + 1 clásica + papas",
      description: "Promo 3+1.",
      price: 1170,
      originalPrice: 1560,
      tags: ["promotion"]
    },
    {
      id: "nuggets-combo",
      categoryId: "combos",
      name: "Combo Nuggets",
      description: "",
      price: 350,
      tags: []
    },
    {
      id: "double-cheese-bacon-fries",
      categoryId: "combos",
      name: "Doble Cheese bacon + papas",
      description: "",
      price: 450,
      tags: []
    },
    {
      id: "extra-meat",
      categoryId: "extras",
      name: "Extra carne",
      description: "",
      price: 110,
      tags: []
    },
    {
      id: "fries-cheddar-bacon-portion",
      categoryId: "fries",
      name: "Porción de fritas con cheddar y bacon",
      description: "",
      price: 200,
      tags: []
    },
    {
      id: "double-chimiburger-fries",
      categoryId: "combos",
      name: "Doble ChimiBurger + papas",
      description: "Promo ChimiBurger.",
      price: 470,
      originalPrice: 520,
      tags: ["promotion"]
    },
    {
      id: "triple-cheese-bacon-fries",
      categoryId: "combos",
      name: "Triple Cheese bacon + papas",
      description: "Pan, triple carne, cheddar, bacon, cebolla.",
      price: 560,
      tags: []
    },
    {
      id: "four-quarter-pounders-fries",
      categoryId: "combos",
      name: "Cuatro cuarto de libra + papas",
      description: "Pan, cuatro carnes, cheddar, cebolla.",
      price: 670,
      tags: []
    },
    {
      id: "double-quarter-family-drinks",
      categoryId: "combos",
      name: "2 doble cuarto de libra + 2 papas + 2 refrescos",
      description: "Promo Especial.",
      price: 990,
      originalPrice: 1100,
      tags: ["promotion"]
    },
    {
      id: "double-burgers-cheddar-fries",
      categoryId: "combos",
      name: "2 Burger dobles + 2 papas cheddar y bacon",
      description: "Promo dúo 2.",
      price: 950,
      tags: ["promotion"]
    },
    {
      id: "quarter-pounder-fries-drink",
      categoryId: "combos",
      name: "Doble cuarto + papas + refresco",
      description: "Nuevo combo.",
      price: 500,
      tags: []
    },
    {
      id: "three-double-cheese-no-fries",
      categoryId: "burgers",
      name: "3 Burger doble Cheese (sin papas)",
      description: "Promo amig@s.",
      price: 1100,
      tags: ["promotion"]
    },
    {
      id: "pepsi-half-liter",
      categoryId: "drinks",
      name: "Pepsi medio litro",
      description: "",
      price: 100,
      tags: []
    },
    {
      id: "seven-up-half-liter",
      categoryId: "drinks",
      name: "7up medio litro",
      description: "",
      price: 100,
      tags: []
    },
    {
      id: "fries-portion",
      categoryId: "fries",
      name: "Porción de fritas",
      description: "",
      price: 110,
      tags: []
    }
  ]
};
