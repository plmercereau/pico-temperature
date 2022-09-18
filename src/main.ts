import { createApp } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'

// Create the apollo client
const apolloClient = new ApolloClient({
  uri: 'https://ewjsnnbowmzrfyouyuxn.nhost.run/v1/graphql',
  cache: new InMemoryCache()
})

createApp(App).provide(DefaultApolloClient, apolloClient).mount('#app')
