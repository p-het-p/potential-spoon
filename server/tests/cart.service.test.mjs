import assert from 'node:assert/strict';
import test from 'node:test';

const { cartService } = await import('../dist/services/cart.service.js');
const { cartRepository } = await import('../dist/repositories/cart.repository.js');
const { productRepository } = await import('../dist/repositories/product.repository.js');

test('cart service creates a member cart and uses the member price', async () => {
  const original = {
    findActiveCartByUserId: cartRepository.findActiveCartByUserId,
    createCart: cartRepository.createCart,
    findCartItem: cartRepository.findCartItem,
    addCartItem: cartRepository.addCartItem,
    findById: productRepository.findById,
  };
  try {
    cartRepository.findActiveCartByUserId = async () => null;
    cartRepository.createCart = async () => ({ cart_id: 41 });
    cartRepository.findCartItem = async () => null;
    productRepository.findById = async () => ({ product_id: 9, is_active: true, stock_quantity: 8, member_price: 99, non_member_price: 149 });
    cartRepository.addCartItem = async (item) => item;

    const item = await cartService.addItem({ userId: 'member-1', productId: 9, quantity: 2 });
    assert.deepEqual(item, { cart_id: 41, product_id: 9, quantity: 2, unit_price: 99 });
  } finally {
    Object.assign(cartRepository, original);
  }
});

test('cart service rejects a request with no authenticated owner', async () => {
  await assert.rejects(
    cartService.getCart({}),
    (error) => error.code === 'UNAUTHORIZED'
  );
});
