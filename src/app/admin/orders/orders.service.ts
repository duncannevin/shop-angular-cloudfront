import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './order.interface';
import { ApiService } from '../../core/api.service';

@Injectable()
export class OrdersService extends ApiService {
  orderUrl = this.getUrl('order', ``);

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderUrl);
  }
}
