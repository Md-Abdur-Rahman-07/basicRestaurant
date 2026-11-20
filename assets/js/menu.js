// Prices are integer cents.
export const categories = ['All', 'Drinks', 'Pizza', 'Burgers', 'Pasta', 'Desserts', 'Seafood', 'Salads', 'Sandwiches', 'Steaks', 'Asian Cuisine', 'Mexican', 'Indian', 'Breakfast', 'Vegan'];

export const menu = [
  { id: 'margherita', name: 'Margherita Pizza', category: 'Pizza', group: 'Kitchen favourites', priceCents: 799, calories: 800, image: 'pizza', description: 'Tomato, creamy mozzarella and fresh basil. A classic for a reason.', featured: true },
  { id: 'cheeseburger', name: 'Cheeseburger', category: 'Burgers', group: 'Kitchen favourites', priceCents: 550, calories: 550, image: 'burger', description: 'A juicy beef patty, melted cheese, crisp lettuce and tomato in a soft bun.' },
  { id: 'veggie-pasta', name: 'Veggie Pasta', category: 'Pasta', group: 'Kitchen favourites', priceCents: 699, calories: 450, image: 'pasta', description: 'Seasonal vegetables and pasta tossed in a light tomato and olive oil sauce.', vegan: true },
  { id: 'salmon', name: 'Grilled Salmon', category: 'Seafood', group: 'Kitchen favourites', priceCents: 1599, calories: 600, image: 'salmon', description: 'Tender grilled salmon, garden herbs and a bright squeeze of lemon.' },
  { id: 'chicken-curry', name: 'Chicken Curry', category: 'Indian', group: 'Kitchen favourites', priceCents: 950, calories: 500, image: 'curry', description: 'Slow-cooked chicken in a rich tomato sauce with warming spices.', spicy: true },
  { id: 'tacos', name: 'Tacos', category: 'Mexican', group: 'Kitchen favourites', priceCents: 499, calories: 250, image: 'tacos', description: 'Soft tortillas, seasoned meat, cheese and fresh vegetables with a little heat.', spicy: true },
  { id: 'ribeye', name: 'Ribeye Steak', category: 'Steaks', group: 'Kitchen favourites', priceCents: 1899, calories: 800, image: 'steak', description: 'A beautifully grilled ribeye, served with creamy mashed potatoes.' },
  { id: 'club-sandwich', name: 'Club Sandwich', category: 'Sandwiches', group: 'Kitchen favourites', priceCents: 575, calories: 450, image: 'sandwich', description: 'Turkey, bacon, lettuce and tomato, layered between golden toast.' },
  { id: 'pancakes', name: 'Pancakes', category: 'Breakfast', group: 'Kitchen favourites', priceCents: 525, calories: 400, image: 'pancakes', description: 'Fluffy pancakes, sweet syrup and a generous handful of fresh berries.' },
  { id: 'caesar-salad', name: 'Caesar Salad', category: 'Salads', group: 'Fresh & light', priceCents: 650, calories: 350, image: 'salad', description: 'Crisp romaine, golden croutons and our creamy Caesar dressing.' },
  { id: 'sushi', name: 'Sushi', category: 'Asian Cuisine', group: 'Fresh & light', priceCents: 1250, calories: 300, image: 'sushi', description: 'A colourful selection of fresh fish, seasoned rice and seaweed rolls.' },
  { id: 'tofu-stir-fry', name: 'Tofu Stir-fry', category: 'Vegan', group: 'Fresh & light', priceCents: 799, calories: 350, image: 'tofu', description: 'Golden tofu and crunchy seasonal vegetables in a light soy sauce.', vegan: true },
  { id: 'ice-cream', name: 'Ice Cream', category: 'Desserts', group: 'Something sweet', priceCents: 350, calories: 200, image: 'ice-cream', description: 'A little scoop of happiness. Smooth, creamy and made for a sweet finish.' },
  { id: 'red-velvet', name: 'Red Velvet Cake', category: 'Desserts', group: 'Something sweet', priceCents: 400, calories: 400, image: 'red-velvet', description: 'Soft red velvet layers and a generous swirl of cream cheese frosting.' },
  { id: 'coke', name: 'Coke', category: 'Drinks', group: 'Drinks', priceCents: 199, calories: 140, image: 'cola', description: 'The refreshing original, served chilled and ready to enjoy.' },
  { id: 'pepsi', name: 'Pepsi', category: 'Drinks', group: 'Drinks', priceCents: 250, calories: 150, image: 'pepsi', description: 'Bold, refreshing cola. Best enjoyed ice cold.' },
  { id: 'lemonade', name: 'Lemonade', category: 'Drinks', group: 'Drinks', priceCents: 300, calories: 120, image: 'lemonade', description: 'Fresh lemons, a touch of sweetness and a wonderfully bright finish.' }
];

export const menuById = new Map(menu.map(item => [item.id, item]));
export const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const money = cents => currency.format(cents / 100);
