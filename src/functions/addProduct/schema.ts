export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    img: { type: 'string' }
  },
  required: ['title', 'price', 'img']
} as const;
