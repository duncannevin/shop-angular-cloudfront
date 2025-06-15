import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProductsService } from './products.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [ProductItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  private readonly cartService = inject(CartService);

  products = toSignal(inject(ProductsService).getProducts(), {
    initialValue: [],
  });

  ngOnInit() {
    this.cartService.createOrGetCart();
  }
}
