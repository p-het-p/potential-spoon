import { cartRepository } from '../repositories/cart.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.js';

type CartOwner = { userId?: string; attendeeId?: number };

function assertOwner({ userId, attendeeId }: CartOwner): void {
  if (!userId && !attendeeId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  }
  if (userId && attendeeId) {
    throw new AppError(400, 'INVALID_CART_OWNER', 'A cart can belong to only one owner');
  }
}

async function findCart(owner: CartOwner) {
  assertOwner(owner);
  return owner.userId
    ? cartRepository.findActiveCartByUserId(owner.userId)
    : cartRepository.findActiveCartByAttendeeId(owner.attendeeId!);
}

async function getOrCreateCart(owner: CartOwner) {
  return (await findCart(owner)) ?? cartRepository.createCart({
    user_id: owner.userId,
    attendee_id: owner.attendeeId,
  });
}

async function assertCartItemOwner(cartItemId: number, owner: CartOwner) {
  const item = await cartRepository.findCartItemById(cartItemId);
  if (!item) throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Cart item not found');

  const cart = await cartRepository.getCartWithOwnerInfo(item.cart_id);
  if (!cart || cart.status !== 'active' || cart.user_id !== (owner.userId ?? null) || cart.attendee_id !== (owner.attendeeId ?? null)) {
    throw new AppError(403, 'FORBIDDEN', 'You do not have access to this cart item');
  }
  return item;
}

export const cartService = {
  async getCart(owner: CartOwner) {
    const cart = await findCart(owner);
    if (!cart) return { items: [], subtotal: 0, currency: 'INR' };

    const items = await cartRepository.getCartItems(cart.cart_id);
    const normalizedItems = items.map((item) => ({
      ...item,
      unit_price: Number(item.unit_price),
      total: Number(item.unit_price) * item.quantity,
    }));
    return {
      cart_id: cart.cart_id,
      items: normalizedItems,
      subtotal: normalizedItems.reduce((sum, item) => sum + item.total, 0),
      currency: 'INR',
    };
  },

  async addItem(params: CartOwner & { productId: number; quantity: number }) {
    assertOwner(params);
    const product = await productRepository.findById(params.productId);
    if (!product || !product.is_active) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    if (product.stock_quantity !== null && product.stock_quantity < params.quantity) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', 'Not enough stock available');
    }

    const cart = await getOrCreateCart(params);
    const existing = await cartRepository.findCartItem(cart.cart_id, params.productId);
    const quantity = (existing?.quantity ?? 0) + params.quantity;
    if (quantity > 10) throw new AppError(400, 'QUANTITY_LIMIT_EXCEEDED', 'Maximum 10 items per product');
    if (product.stock_quantity !== null && product.stock_quantity < quantity) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', 'Not enough stock available');
    }

    if (existing) return cartRepository.updateCartItemQuantity(existing.cart_item_id, quantity);
    const isMember = Boolean(params.userId);
    const normalPrice = Number(product.non_member_price ?? product.member_price);
    const unitPrice = isMember
      ? (product.product_type === 'event_ticket' ? Math.round(normalPrice * 0.70 * 100) / 100 : Number(product.member_price))
      : normalPrice;
    return cartRepository.addCartItem({ cart_id: cart.cart_id, product_id: product.product_id, quantity, unit_price: Number(unitPrice) });
  },

  async updateItemQuantity(params: CartOwner & { cartItemId: number; quantity: number }) {
    assertOwner(params);
    const item = await assertCartItemOwner(params.cartItemId, params);
    const stock = await productRepository.getAvailableStock(item.product_id);
    if (stock !== null && stock < params.quantity) throw new AppError(400, 'INSUFFICIENT_STOCK', 'Not enough stock available');
    return cartRepository.updateCartItemQuantity(item.cart_item_id, params.quantity);
  },

  async removeItem(params: CartOwner & { cartItemId: number }) {
    assertOwner(params);
    const item = await assertCartItemOwner(params.cartItemId, params);
    await cartRepository.removeCartItem(item.cart_item_id);
  },
};
