<template>
  <h2>前台</h2>
  <nav>
  <RouterLink to="/">Home</RouterLink> |
  <RouterLink to="/about">About</RouterLink> |
  <RouterLink to="/product">Product</RouterLink> |
  <RouterLink to="/cart">Cart</RouterLink> |
  <br>
  <RouterLink to="/login">Login</RouterLink> |
  <br>
  <RouterLink to="/admin">後台(後台製作完成記得刪掉)</RouterLink> |
  </nav>
  <!-- RouterView來自 import router from './router' -->
  <RouterView/>
</template>
