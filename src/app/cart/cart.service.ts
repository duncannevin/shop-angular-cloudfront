import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { take, tap } from 'rxjs/operators';
import { Product } from '../products/product.interface';
import { toObservable } from '@angular/core/rxjs-interop';

export interface CartItem {
  id: string;
  product_id: string;
  price: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  cartUrl = this.getUrl('cart', ``);
  orderUrl = this.getUrl('order', ``);

  /** Key - item id, value - ordered amount */
  #cart = signal<Record<string, number>>({});

  cart = this.#cart.asReadonly();

  cart$ = toObservable(this.#cart);

  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  createOrGetCart() {
    this.http
      .get<CartItem[]>(this.cartUrl)
      .pipe(
        take(1),
        tap((cartItems) => {
          if (cartItems && cartItems.length) {
            const cart: Record<string, number> = {};
            for (const item of cartItems) {
              cart[item.product_id] = item.count;
            }
            this.#cart.set(cart);
          } else {
            console.warn('No cart found, initializing empty cart.');
            this.#cart.set({});
          }
        }),
      )
      .subscribe();
  }

  totalInCart = computed(() => {
    const values = Object.values(this.cart());

    if (!values.length) {
      return 0;
    }

    return values.reduce((acc, val) => acc + val, 0);
  });

  addItem(product: Product): void {
    this.updateCount(product.id, 1);

    if (this.debounceTimers.has(product.id)) {
      clearTimeout(this.debounceTimers.get(product.id)!);
    }

    const timer = setTimeout(() => {
      this.http
        .put(this.cartUrl, { product, count: this.cart()[product.id] })
        .subscribe(() => {
          console.log(`Backend updated for product: ${product.id}`);
        });
      this.debounceTimers.delete(product.id); // Remove the timer after the call
    }, 500); // Adjust debounce time as needed

    this.debounceTimers.set(product.id, timer);
  }

  removeItem(id: string): void {
    this.updateCount(id, -1);
  }

  empty(): void {
    this.#cart.set({});
  }

  private updateCount(id: string, type: 1 | -1): void {
    const val = this.cart();
    const newVal = {
      ...val,
    };

    if (!(id in newVal)) {
      newVal[id] = 0;
    }

    if (type === 1) {
      newVal[id] = ++newVal[id];
      this.#cart.set(newVal);
      return;
    }

    if (newVal[id] === 0) {
      console.warn('No match. Skipping...');
      return;
    }

    newVal[id]--;

    if (!newVal[id]) {
      delete newVal[id];
    }

    console.log(newVal);
    this.#cart.set(newVal);
  }
}
