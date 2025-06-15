import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { Observable, switchMap } from 'rxjs';
import { ProductCheckout } from '../products/product.interface';
import { map, take } from 'rxjs/operators';
import { ShippingInfo } from './shipping-info.interface';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService extends ApiService {
  orderUrl = this.getUrl('order', ``);

  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);

  checkout(shippingInfo: ShippingInfo) {
    return this.http
      .put(this.orderUrl, {
        items: this.cartService.cart(),
        address: shippingInfo,
      })
      .pipe(
        map(() => this.cartService.empty()),
        take(1),
      );
  }

  getProductsForCheckout(): Observable<ProductCheckout[]> {
    return this.cartService.cart$.pipe(
      switchMap((cart) =>
        this.productsService.getProductsForCheckout(Object.keys(cart)).pipe(
          map((products) =>
            products.map((product) => ({
              ...product,
              orderedCount: cart[product.id],
              totalPrice: +(cart[product.id] * product.price).toFixed(2),
            })),
          ),
        ),
      ),
    );
  }
}
