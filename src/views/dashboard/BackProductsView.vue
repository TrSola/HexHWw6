<template>
  <div>
    <div class="container">
      <div class="text-end mt-4">
        <button class="btn btn-primary" @click="openModal('new')">
          建立新的產品
        </button>
      </div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productList" :key="product.id">
            <td>{{ product.category }}</td>
            <td>{{ product.title }}</td>
            <td class="text-end">{{ product.origin_price }}</td>
            <td class="text-end">{{ product.price }}</td>
            <td>
              <span class="text-success" v-if="product.is_enabled">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="openModal('edit', product)"
                >
                  編輯
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openModal('delete', product)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- page -->
      <PaginationComponent
        :pages="pagination"
        @emit-pages="getData"
      ></PaginationComponent>
      <!-- page -->
    </div>
    <!-- Modal -->
    <ProductModal
      :status="status"
      :temp-product="tempProduct"
      @get-data="getData"
      @emit-product-modal="emitProductModal"
    ></ProductModal>
    <DelProductModal
      :temp-product="tempProduct"
      @get-data="getData"
      @emit-del-product-modal="emitDelProductModal"
    ></DelProductModal>
    <!-- Modal -->
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import ProductModal from '../../components/ProductModal.vue'
import DelProductModal from '../../components/DelProductModal.vue'
import PaginationComponent from '../../components/PaginationComponent.vue'

let productModal2 = null
let delProductModal2 = null

const apiUrl = 'https://ec-course-api.hexschool.io/v2'
const apiPath = 'aca101139'

const status = ref(false)
const productList = ref([])
const tempProduct = ref({
  imagesUrl: []
})
const pagination = ref({})

const checkLogin = () => {
  axios
    .post(`${apiUrl}/api/user/check`)
    .then(() => {
      getData()
    })
    .catch((err) => {
      alert(err.data.message)
      window.location = 'index.html'
    })
}
const getData = (page = 1) => {
  axios
    .get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
    .then((res) => {
      productList.value = res.data.products
      pagination.value = res.data.pagination
    })
    .catch((err) => alert(err.response.data.message))
}

const openModal = (arg, product) => {
  if (arg === 'new') {
    tempProduct.value = {
      imagesUrl: []
    }
    status.value = 'new'
    productModal2.show()
  } else if (arg === 'edit') {
    tempProduct.value = { ...product }
    status.value = 'edit'
    productModal2.show()
  } else if (arg === 'delete') {
    tempProduct.value = { ...product }
    delProductModal2.show()
  }
}
const emitProductModal = (productModal) => {
  productModal2 = productModal
}
const emitDelProductModal = (delProductModal) => {
  delProductModal2 = delProductModal
}

onMounted(() => {
  // Retrieve Token
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)WillyToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  axios.defaults.headers.common.Authorization = token

  checkLogin()
})
</script>
