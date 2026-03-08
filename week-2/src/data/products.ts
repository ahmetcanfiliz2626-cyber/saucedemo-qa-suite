export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // cents
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack.',
    price: 2999,
    image: 'sauce-backpack.jpg',
  },
  {
    id: 2,
    name: 'Sauce Labs Bike Light',
    description: 'A red light isn\'t the desired state in testing but it sure helps when riding.',
    price: 999,
    image: 'bike-light.jpg',
  },
  {
    id: 3,
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt.',
    price: 1599,
    image: 'bolt-shirt.jpg',
  },
  {
    id: 4,
    name: 'Sauce Labs Fleece Jacket',
    description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket.',
    price: 4999,
    image: 'fleece-jacket.jpg',
  },
  {
    id: 5,
    name: 'Sauce Labs Onesie',
    description: 'Rib snap infant onesie for the junior automation engineer in development.',
    price: 799,
    image: 'onesie.jpg',
  },
  {
    id: 6,
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to a keyboard.',
    price: 1599,
    image: 'red-shirt.jpg',
  },
];
