import menuLatte from "../assets/img/menu-latte.jpeg";
import menuMatcha from "../assets/img/menu-matcha.jpeg";
import menuBoissonRouge from "../assets/img/menu-boisson-rouge.jpeg";
import menuSandwich from "../assets/img/menu-sandwich.jpeg";
import menuBoissonGlacee from "../assets/img/menu-boisson-glacee.jpeg";

// Datos temporales para desarrollar y probar el Front-End.
// Posteriormente se sustituirán por los datos de la API Symfony.
// Las características alimentarias son ejemplos ficticios:
// Rachel deberá confirmar las características reales de cada producto.

export const foodCharacteristics = [
  {
    id: 1,
    name: "Végan",
  },
  {
    id: 2,
    name: "Végétarien",
  },
  {
    id: 3,
    name: "Sans lactose",
  },
];

export const categories = [
  {
    id: 1,
    name: "Coffee",
    description: "Cafés chauds et froids.",
    image: menuLatte,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Jus Exotiques",
    description: "Jus frais aux saveurs exotiques.",
    image: menuBoissonRouge,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Matcha & Signatures",
    description: "Matchas et boissons signatures.",
    image: menuMatcha,
    displayOrder: 3,
  },
  {
    id: 4,
    name: "Sweets",
    description: "Douceurs pour accompagner les boissons.",
    image: null,
    displayOrder: 4,
  },
  {
    id: 5,
    name: "Food",
    description: "Sélection salée.",
    image: menuSandwich,
    displayOrder: 5,
  },
];

export const products = [
  {
    id: 1,
    name: "Café filtre",
    description:
      "Doux et aromatique, une tasse légère à savourer tranquillement.",
    price: 3,
    image: menuLatte,
    isAvailable: true,
    displayOrder: 1,
    isFeatured: false,
    categoryId: 1,
    foodCharacteristics: [foodCharacteristics[0], foodCharacteristics[2]],
  },
  {
    id: 2,
    name: "Café du moment",
    description:
      "Une sélection qui évolue, avec un caractère à découvrir à chaque tasse.",
    price: 2,
    image: menuBoissonGlacee,
    isAvailable: false,
    displayOrder: 2,
    isFeatured: true,
    categoryId: 1,
    foodCharacteristics: [foodCharacteristics[2]],
  },
  {
    id: 3,
    name: "Jus exotique",
    description: "Un jus frais aux saveurs fruitées et exotiques.",
    price: 5,
    image: menuBoissonRouge,
    isAvailable: true,
    displayOrder: 1,
    isFeatured: false,
    categoryId: 2,
    foodCharacteristics: [foodCharacteristics[0], foodCharacteristics[2]],
  },
  {
    id: 4,
    name: "Matcha signature",
    description:
      "Onctueux et végétal, un équilibre doux pour une pause pleine de fraîcheur.",
    price: 6.5,
    image: menuMatcha,
    isAvailable: true,
    displayOrder: 1,
    isFeatured: true,
    categoryId: 3,
    foodCharacteristics: [foodCharacteristics[1], foodCharacteristics[2]],
  },
  {
    id: 5,
    name: "Cookie",
    description: "Une douceur gourmande pour accompagner une boisson.",
    price: 3.5,
    image: null,
    isAvailable: true,
    displayOrder: 1,
    isFeatured: false,
    categoryId: 4,
    foodCharacteristics: [foodCharacteristics[1]],
  },
  {
    id: 6,
    name: "Toast du moment",
    description: "Une proposition salée préparée selon les envies du moment.",
    price: 8,
    image: menuSandwich,
    isAvailable: true,
    displayOrder: 1,
    isFeatured: false,
    categoryId: 5,
    foodCharacteristics: [foodCharacteristics[1]],
  },

  // Productos adicionales para probar la cuadrícula y el scroll.
  {
    id: 7,
    name: "Café glacé",
    description: "Une boisson fraîche pour accompagner une pause en douceur.",
    price: 4,
    image: menuBoissonGlacee,
    isAvailable: true,
    displayOrder: 3,
    isFeatured: false,
    categoryId: 1,
    foodCharacteristics: [foodCharacteristics[0], foodCharacteristics[2]],
  },
  {
    id: 8,
    name: "Latte",
    description:
      "Un café doux et crémeux pour profiter d'un moment de détente.",
    price: 4.5,
    image: menuLatte,
    isAvailable: true,
    displayOrder: 4,
    isFeatured: false,
    categoryId: 1,
    foodCharacteristics: [foodCharacteristics[1]],
  },
  {
    id: 9,
    name: "Boisson glacée du moment",
    description: "Une proposition rafraîchissante à découvrir selon la saison.",
    price: 5,
    image: menuBoissonRouge,
    isAvailable: true,
    displayOrder: 5,
    isFeatured: false,
    categoryId: 1,
    foodCharacteristics: [foodCharacteristics[0], foodCharacteristics[2]],
  },
];
