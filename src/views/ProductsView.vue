<template>
 <div class='container'>
        <div class='row py-3'>
          <div class='col-md-6'>
            <h2>產品列表</h2>
            <table class='table table-hover mt-4'>
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>查看細節</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for='product in products' :key='product.id'>
                  <td width='150'>{{product.title}}</td>
                  <td width='120'>{{product.origin_price}}</td>
                  <td width='120'>{{product.price}}</td>
                  <td width='150'>
                    <template v-if='product.is_enabled'>
                      <p class='text-success'>啟用</p>
                    </template>
                    <template v-else>
                      <p>未啟用</p>
                    </template>
                  </td>
                  <td width='120'>
                    <button
                      class='btn btn-primary'
                      type='button'
                      @click='seeDetails(product)'
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {{ `目前有 ${products.length} 項產品` }}
          </div>
          <div class='col-md-6'>
            <h2>單一產品細節</h2>
            <template v-if='tempProduct.title'>
              <div class='card mb-3'>
                <img :src='tempProduct.imageUrl' alt='' />
                <div class='card-body'>
                  <h5 class='card-title'>
                    {{ tempProduct.title}}
                    <span class='badge bg-primary ms-2'
                      >{{tempProduct.category}}</span
                    >
                  </h5>
                  <p class='card-text'>
                    商品描述 : {{tempProduct.description}}
                  </p>
                  <p class='card-text'>商品內容 : {{tempProduct.content}}</p>
                  <p>
                    <span class='me-2'> {{tempProduct.price}} </span
                    ><span class='text-muted text-decoration-line-through'>
                      {{tempProduct.origin_price}} </span
                    ><span>/ {{tempProduct.unit}}</span>
                  </p>
                </div>
              </div>
              <img
                :src='image'
                alt=''
                v-for='(image, i) in tempProduct.imagesUrl'
                :key='"image" + i'
                class='image m-2 img-fluid w-25'
              />
            </template>
            <template v-else>
              <p>請選擇一個商品查看</p>
            </template>
          </div>
        </div>
      </div>
</template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      products: [],
      tempProduct: {}
    }
  },
  methods: {
    seeDetails (product) {
      this.tempProduct = product
    },
    getData () {
      const { VITE_APP_URL } = import.meta.env
      const { VITE_APP_PATH } = import.meta.env
      axios
        .get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/products/all`)
        .then((res) => {
          (this.products = res.data.products)
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  mounted () {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)WillyToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    axios.defaults.headers.common.Authorization = token
    this.getData()
  }
}
</script>
