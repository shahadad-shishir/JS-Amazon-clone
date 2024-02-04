//loading variables from other files
import {cart} from '../data/cart.js';
import { products } from '../data/products.js';


//data structure for products
//Loaded in products.js file

//generating html for products
let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
      <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart added-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

//putting html
document.querySelector('.js-products-grid').innerHTML = productsHTML;


//adding event listener in add to cart btn
let timeoutId;
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      //getting data from data- attribute
      const {productId} = button.dataset;

      //getting quantity from selector
      const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      let matchingItem; //**

      cart.forEach((item) => {
        if (productId === item.productId) {
          matchingItem = item;
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

      //Calculating total cart quantity for the header
      let cartQuantity = 0;

      cart.forEach((item) =>{
        cartQuantity += item.quantity;
      });

      document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;

      //added msg
      document.querySelector(`.added-${productId}`).classList.add('added-visible');

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        document.querySelector(`.added-${productId}`).classList.remove('added-visible');
      }, 2000);

    });
  });