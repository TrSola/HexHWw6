<template>
  <div>
    <div class="page">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li
            class="page-item"
            :class="{ disabled: pagesInPaginationComponent.current_page === 1 }"
          >
            <a
              class="page-link"
              aria-label="Previous"
              @click.prevent="
                emitPages(pagesInPaginationComponent.current_page - 1)
              "
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            v-for="(item, index) in pagesInPaginationComponent.total_pages"
            :key="index"
            class="page-item"
            :class="{
              active: item === pagesInPaginationComponent.current_page
            }"
          >
            <span
              class="page-link"
              v-if="item === pagesInPaginationComponent.current_page"
              >{{ item }}</span
            >
            <a class="page-link" v-else @click.prevent="emitPages(item)">{{
              item
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{
              disabled:
                pagesInPaginationComponent.current_page ===
                pagesInPaginationComponent.total_pages
            }"
          >
            <a
              class="page-link"
              aria-label="Next"
              @click.prevent="
                emitPages(pagesInPaginationComponent.current_page + 1)
              "
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, watch } from 'vue'
let pagesInPaginationComponent = 0
const props = defineProps(['pages'])
const emit = defineEmits(['emit-pages'])
const emitPages = (i) => {
  emit('emit-pages', i)
}
watch(props, (newProps, oldProps) => {
  pagesInPaginationComponent = newProps.pages
})
</script>
