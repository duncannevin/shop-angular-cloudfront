import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://ql1arll5s0.execute-api.us-west-2.amazonaws.com/prod',
    order:
      'https://895jtvcxa2.execute-api.us-west-2.amazonaws.com/prod/api/profile/cart/order',
    import:
      'https://ql1arll5s0.execute-api.us-west-2.amazonaws.com/prod/products',
    bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    cart: 'https://895jtvcxa2.execute-api.us-west-2.amazonaws.com/prod/api/profile/cart',
  },
  apiEndpointsEnabled: {
    product: true,
    order: true,
    import: true,
    bff: false,
    cart: true,
  },
};
