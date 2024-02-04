export const cart = [];

export function addToCart(productId) {
  //getting quantity from selector
  const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

  let matchingItem; //**

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if(matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity
    });
  }
}