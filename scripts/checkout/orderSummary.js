//Named Export
import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummery} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';


export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);
    
    cartSummaryHTML +=
    `
      <div class="cart-item-container js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html +=
      `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;


  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummery();
      });
    });


  //making update link interactive
  document.querySelectorAll('.js-update-quantity-link')
    .forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-quantity-link')
    .forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
        const productId = saveLink.dataset.productId;

        const inputValue = Number(document.querySelector('.is-editing-quantity .js-quantity-input').value);

        if (inputValue < 0 || inputValue >= 1000) {
          alert('Quantity should not be less than 0 or greater than 1000');
          return;
        }

        updateQuantity(productId, inputValue);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummery();
        
        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;

        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummery();
      });
    });
}
