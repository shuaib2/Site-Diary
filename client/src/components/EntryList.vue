<template>
  <div class="card">
    <h2>Diary entries</h2>

    <div class="field">
      <label for="filter">Filter by contract</label>
      <select id="filter" v-model="selectedContract" @change="$emit('filter-change', selectedContract)">
        <option value="">All contracts</option>
        <option v-for="contract in contracts" :key="contract" :value="contract">{{ contract }}</option>
      </select>
    </div>

    <p class="empty-state" v-if="entries.length === 0">No entries yet.</p>

    <div v-else>
      <div class="entry" v-for="entry in entries" :key="entry.id">
        <div class="entry-header">
          <span class="entry-contract">{{ entry.contract }}</span>
          <span class="entry-date">{{ formatDate(entry.date) }}</span>
        </div>
        <div class="entry-meta">
          {{ entry.author }}<span v-if="entry.weather"> · {{ entry.weather }}</span>
        </div>
        <p class="entry-notes">{{ entry.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  entries: { type: Array, required: true },
  contracts: { type: Array, required: true },
});
defineEmits(['filter-change']);

const selectedContract = ref('');

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>
