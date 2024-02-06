import {calculateCartQuantity} from "../../data/cart.js";

export function renderCheckoutHeader() {
  const totalCartQuantity = calculateCartQuantity();

  document.querySelector('.js-header-middle-section')
    .innerHTML = `
    Checkout (<a class="return-to-home-link"
    href="amazon.html">
    ${totalCartQuantity} items
    </a>)
    `;
}