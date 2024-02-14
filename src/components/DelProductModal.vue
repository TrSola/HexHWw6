<template>
  <div>
    <div
      id="delProductModal"
      ref="delProductModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="delProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong>
            商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDelete(product)"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'

const props = defineProps(['tempProduct'])
const emit = defineEmits(['get-data', 'emitDelProductModal'])
let delProductModal = null
let delProductModalInDelProduct = null
const apiAdmin = 'https://ec-course-api.hexschool.io/v2/api/aca101139/admin'
const confirmDelete = () => {
  axios
    .delete(`${apiAdmin}/product/${props.tempProduct.id}`)
    .then((res) => {
      alert(res.data.message)
      delProductModalInDelProduct.hide()
      emit('get-data')
    })
    .catch((err) => alert(err))
}

onMounted(() => {
  delProductModal = new Modal(document.getElementById('delProductModal'), {
    keyboard: false
  })
  delProductModalInDelProduct = delProductModal
  emit('emitDelProductModal', delProductModal)
})
</script>
