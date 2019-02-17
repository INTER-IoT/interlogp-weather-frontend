export default {
  graphqlUrl: () => 'http://localhost:3020/graphql',
  subscriptionUrl: () => 'ws://localhost:3020/subscriptions',
  // graphqlUrl: () => 'http://vmbrk01.westeurope.cloudapp.azure.com:3020/graphql',
  // subscriptionUrl: () => 'ws://vmbrk01.westeurope.cloudapp.azure.com:3020/subscriptions',
  inactiveStationThresholdMillis: 10 * 1000,
};
