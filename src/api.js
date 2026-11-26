const API = "https://apifakedelivery.vercel.app";

// Dados locais de demonstração: usados automaticamente se a API estiver fora do ar.
const DEMO = {
  users: [
    {
      id: 1,
      name: "Gustavo Nogueira",
      email: "gustavo@email.com",
      phone: "(51) 99999-0001",
      address: "Taquara, Rio Grande do Sul"
    },
    {
      id: 2,
      name: "Mariana Souza",
      email: "mariana@email.com",
      phone: "(51) 99999-0002",
      address: "Três Coroas, Rio Grande do Sul"
    },
    {
      id: 3,
      name: "Lucas Oliveira",
      email: "lucas@email.com",
      phone: "(51) 99999-0003",
      address: "Igrejinha, Rio Grande do Sul"
    }
  ],
  restaurants: [
    {
      id: 1,
      name: "Burger House",
      category: "Hambúrgueres",
      description: "Hambúrgueres artesanais preparados na hora, com ingredientes selecionados.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900",
      address: "Centro, Taquara - RS",
      deliveryTime: "25–40 min",
      rating: 4.8
    },
    {
      id: 2,
      name: "Pizza da Vila",
      category: "Pizzaria",
      description: "Pizzas tradicionais e especiais, com massa leve e ingredientes frescos.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
      address: "Centro, Taquara - RS",
      deliveryTime: "35–50 min",
      rating: 4.7
    },
    {
      id: 3,
      name: "Sabor Caseiro",
      category: "Comida brasileira",
      description: "Refeições caseiras, pratos feitos e aquele tempero especial.",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
      address: "Santa Maria, Taquara - RS",
      deliveryTime: "20–35 min",
      rating: 4.9
    },
    {
      id: 4,
      name: "Sushi Zen",
      category: "Japonesa",
      description: "Sushis, temakis e combinados preparados com cuidado.",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900",
      address: "Centro, Taquara - RS",
      deliveryTime: "40–55 min",
      rating: 4.6
    }
  ],
  foods: [
    {
      id: 1,
      name: "X-Burger Especial",
      price: 29.9,
      description: "Pão macio, hambúrguer bovino, queijo, alface, tomate e molho especial.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
      category: "Hambúrguer",
      deliveryTime: "25–40 min",
      restaurantId: 1
    },
    {
      id: 2,
      name: "Pizza de Calabresa",
      price: 39.9,
      description: "Pizza com molho de tomate, muçarela, calabresa fatiada e cebola.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
      category: "Pizza",
      deliveryTime: "35–50 min",
      restaurantId: 2
    },
    {
      id: 3,
      name: "Prato Feito",
      price: 24.9,
      description: "Arroz, feijão, bife grelhado, ovo e batata frita.",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
      category: "Brasileira",
      deliveryTime: "20–35 min",
      restaurantId: 3
    },
    {
      id: 4,
      name: "Combo Sushi",
      price: 45.0,
      description: "Seleção especial de sushis variados para aproveitar.",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900",
      category: "Japonesa",
      deliveryTime: "40–55 min",
      restaurantId: 4
    },
    {
      id: 5,
      name: "Batata Frita",
      price: 16.9,
      description: "Porção de batatas fritas crocantes, servida quentinha.",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900",
      category: "Acompanhamento",
      deliveryTime: "20–30 min",
      restaurantId: 1
    },
    {
      id: 6,
      name: "Brownie com Sorvete",
      price: 19.9,
      description: "Brownie de chocolate acompanhado de uma bola de sorvete.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900",
      category: "Sobremesa",
      deliveryTime: "20–30 min",
      restaurantId: 3
    }
  ]
};

function getDemoData(path) {
  const cleanPath = path.split("?")[0].replace(/\/+$/, "");
  const match = cleanPath.match(/^\/(users|restaurants|foods)(?:\/([^/]+))?$/);

  if (!match) throw new Error(`Rota não reconhecida: ${path}`);

  const [, resource, id] = match;
  const list = DEMO[resource];

  if (!id) return list;

  const item = list.find((entry) => String(entry.id) === String(id));
  if (!item) throw new Error(`Não encontramos o item ${id} em ${resource}.`);

  return item;
}

export async function getData(path) {
  try {
    // O limite evita deixar a tela presa caso o servidor não responda.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${API}${path}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error(`API respondeu com status ${response.status}`);

      const data = await response.json();

      // Se a API responder vazia, usamos os dados demonstrativos.
      if (
        data === null ||
        data === undefined ||
        (Array.isArray(data) && data.length === 0)
      ) {
        console.warn(`[FoodGo] API sem dados em ${path}. Usando demonstração local.`);
        return getDemoData(path);
      }

      return data;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.warn(`[FoodGo] Não foi possível acessar ${path}. Usando dados locais.`, error);
    return getDemoData(path);
  }
}

export function asList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of ["data", "items", "results", "users", "restaurants", "foods"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [data];
}

export function pick(obj, keys, fallback = "") {
  if (!obj || typeof obj !== "object") return fallback;
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        if (value.url) return value.url;
        if (value.src) return value.src;
      }
      return value;
    }
  }
  return fallback;
}

export function imageOf(item) {
  return pick(item, ["image", "imageUrl", "image_url", "photo", "picture", "thumbnail", "avatar", "url"], "");
}

export function titleOf(item, fallback = "Item") {
  return pick(item, ["name", "title", "nome", "restaurantName", "foodName", "fullName"], fallback);
}

export function priceOf(item) {
  const value = pick(item, ["price", "preco", "value", "amount"], null);
  if (value === null || value === "") return null;
  const number = Number(String(value).replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(number) ? number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : value;
}

export function descriptionOf(item) {
  return pick(item, ["description", "descriptionFood", "details", "descricao", "about", "bio"], "Confira os detalhes deste item.");
}

export function idOf(item, index = 0) {
  return pick(item, ["id", "_id", "userId", "restaurantId", "foodId"], index + 1);
}
