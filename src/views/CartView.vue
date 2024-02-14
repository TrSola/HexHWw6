<template>
   <div class="container">
        <div class="mt-4">
          <!-- 產品Modal -->
          <user-product-modal
            :product="product"
            ref="userProductModal"
            @add-to-cart="addToCart"
          ></user-product-modal>
          <!-- 產品Modal -->

          <table class="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td style="width: 200px">
                  <div
                    style="
                      height: 100px;
                      background-size: cover;
                      background-position: center;
                    "
                    :style="{backgroundImage: `url(${product.imageUrl})`}"
                  ></div>
                </td>
                <td>{{ product.title }}</td>
                <td>
                  <div class="h5" v-if="!product.price">
                    {{ product.origin_price }} 元
                  </div>
                  <del class="h6" v-if="product.price"
                    >原價 {{ product.origin_price }} 元</del
                  >
                  <div class="h5" v-if="product.price">
                    現在只要 {{ product.price}} 元
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="getProduct(product.id)"
                      :disabled="loadingStatus.loadingItem === product.id || !product.is_enabled"
                    >
                      <!-- id一樣就啟用spinner -->
                      <i
                        class="fas fa-spinner fa-pulse"
                        v-if="loadingStatus['loadingItem'] === product.id"
                      ></i>
                      查看更多
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="addToCart(product.id)"
                      :disabled="loadingStatus.loadingItem === product.id || !product.is_enabled"
                    >
                      <i
                        class="fas fa-spinner fa-pulse"
                        v-if="loadingStatus['loadingItem'] === product.id"
                      ></i>
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 購物車列表 -->
          <div class="text-end">
            <template v-if="cart.carts && cart.carts.length !==0 ">
              <div>
                <button
                  class="btn btn-outline-danger"
                  type="button"
                  @click="deleteAllCarts"
                >
                  清空購物車
                </button>
              </div>
            </template>
            <template v-else>
              <div>
                <h3>目前購物車沒有品項</h3>
              </div>
            </template>
          </div>
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 150px">數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="cart.carts">
                <tr v-for="cartItem in cart.carts" :key="cartItem.id">
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeCartItem(cartItem.id)"
                      :disabled="loadingStatus.loadingItem === cartItem.id"
                    >
                      <i
                        class="fas fa-spinner fa-pulse"
                        v-if="loadingStatus.loadingItem === cartItem.id"
                      ></i>
                      x
                    </button>
                  </td>
                  <td>
                    {{ cartItem.product.title }}
                    <div class="text-success">已套用優惠券</div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <div class="input-group mb-3">
                        <input
                          min="1"
                          type="number"
                          class="form-control"
                          v-model.number="cartItem.qty"
                          @blur="updateCart(cartItem)"
                          :disabled="loadingStatus.loadingItem === cartItem.id"
                        />
                        <span class="input-group-text" id="basic-addon2"
                          >{{ cartItem.product.unit }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td class="text-end">
                    <small
                      class="text-success"
                      v-if="cartItem.final_total !== cartItem.total"
                      >折扣價：</small
                    >
                    {{ cartItem.final_total }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ cart.total }}</td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ cart.final_total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="my-5 row justify-content-center">
          <v-form
            ref="form"
            class="col-md-6"
            v-slot="{ errors }"
            @submit="createOrder"
          >
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <v-field
                id="email"
                name="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors['email'] }"
                placeholder="請輸入 Email"
                rules="email|required"
                v-model="form.user.email"
              ></v-field>
              <error-message
                name="email"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">收件人姓名</label>
              <v-field
                id="name"
                name="姓名"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['姓名'] }"
                placeholder="請輸入姓名"
                rules="required"
                v-model="form.user.name"
              ></v-field>
              <error-message
                name="姓名"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="tel" class="form-label">收件人電話</label>
              <v-field
                id="tel"
                name="電話"
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors['電話'] }"
                placeholder="請輸入電話"
                rules="required|min:8|max:10"
                v-model="form.user.tel"
              ></v-field>
              <error-message
                name="電話"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">收件人地址</label>
              <v-field
                id="address"
                name="地址"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['地址'] }"
                placeholder="請輸入地址"
                rules="required"
                v-model="form.user.address"
              ></v-field>
              <error-message
                name="地址"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="message" class="form-label">留言</label>
              <textarea
                name="message"
                id="message"
                class="form-control"
                cols="30"
                rows="10"
                v-model="form.message"
              ></textarea>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-danger">送出訂單</button>
            </div>
          </v-form>
        </div>
      </div>
</template>

<script>
import userProductModal from '../components/userProductModal.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../assets/main.css'
const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true
})

const apiUrl = 'https://ec-course-api.hexschool.io/v2'
const apiPath = 'aca101139'

export default {
  data () {
    return {
      loadingStatus: {
        loadingItem: ''
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      cart: {}
    }
  },
  methods: {
    getProducts () {
      const url = `${apiUrl}/api/${apiPath}/products`
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    getProduct (id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`
      this.loadingStatus.loadingItem = id
      axios
        .get(url)
        .then((response) => {
          this.loadingStatus.loadingItem = ''
          this.product = response.data.product
          this.$refs.userProductModal.modalInModalComponent.show()
          this.$refs.userProductModal.qty = 1
        })
        .catch((err) => {
          alert(err)
        })
    },
    addToCart (id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`
      this.loadingStatus.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }

      this.$refs.userProductModal.modalInModalComponent.hide()
      axios
        .post(url, { data: cart })
        .then((response) => {
          this.loadingStatus.loadingItem = ''
          this.getCart()
          Toast.fire({
            icon: 'success',
            title: '已加入購物車'
          })
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    updateCart (data) {
      this.loadingStatus.loadingItem = data.id
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`
      const cart = {
        product_id: data.product_id,
        qty: data.qty
      }
      axios
        .put(url, { data: cart })
        .then((response) => {
          alert(response.data.message)
          this.loadingStatus.loadingItem = ''
          this.getCart()
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.loadingStatus.loadingItem = ''
        })
    },
    deleteAllCarts () {
      Swal.fire({
        title: '是否清空購物車?',
        showDenyButton: true,
        confirmButtonText: '確認清空',
        denyButtonText: '再想想好了'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Toast.fire({
            icon: 'warning',
            title: '刪除成功'
          })
          axios
            .delete(url)
            .then(() => {
              this.getCart()
            })
            .catch((err) => {
              alert(err.response.data.message)
            })
        } else if (result.isDenied) {
          Toast.fire({
            icon: 'info',
            title: '已為您保留購物車內容'
          })
        }
      }).catch(() => {
        alert('伺服器錯誤')
      })
      const url = `${apiUrl}/api/${apiPath}/carts`
    },
    getCart () {
      const url = `${apiUrl}/api/${apiPath}/cart`
      axios
        .get(url)
        .then((response) => {
          this.cart = response.data.data
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    removeCartItem (id) {
      Swal.fire({
        title: '確認要刪除',
        showDenyButton: true,
        confirmButtonText: '確認刪除',
        denyButtonText: '再想想好了'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Toast.fire({
            icon: 'warning',
            title: '刪除成功'
          })
          axios
            .delete(url)
            .then((response) => {
              this.loadingStatus.loadingItem = ''
              this.getCart()
            })
            .catch((err) => {
              alert(err.response.data.message)
            })
        } else if (result.isDenied) {
          Toast.fire({
            icon: 'info',
            title: '已為您保留該品項'
          })
        }
      })
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`
      this.loadingStatus.loadingItem = id
    },
    createOrder () {
      if (this.cart.carts.length === 0) {
        alert('購物車內沒有品項')
      } else {
        const url = `${apiUrl}/api/${apiPath}/order`
        const order = this.form
        axios
          .post(url, { data: order })
          .then((response) => {
            alert(response.data.message)
            this.$refs.form.resetForm()
            this.getCart()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      }
    }
  },
  mounted () {
    this.getProducts()
    this.getCart()
  },
  components: {
    userProductModal
  }

}

</script>
