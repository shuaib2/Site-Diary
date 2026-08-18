<script setup>
import { onMounted, ref } from 'vue';
import EntryForm from './components/EntryForm.vue';
import EntryList from './components/EntryList.vue';
import SummaryView from './components/SummaryView.vue';
import { fetchContracts, fetchEntries, fetchSummary } from './api';

const activeTab = ref('diary');
const entries = ref([]);
const contracts = ref([]);
const summary = ref([]);
const currentFilter = ref('');
const loadError = ref('');

async function loadEntries() {
  try {
    entries.value = await fetchEntries(currentFilter.value);
    contracts.value = await fetchContracts();
  } catch (err) {
    loadError.value = err.message;
  }
}

async function loadSummary() {
  try {
    summary.value = await fetchSummary();
  } catch (err) {
    loadError.value = err.message;
  }
}

function handleFilterChange(contract) {
  currentFilter.value = contract;
  loadEntries();
}

function handleCreated() {
  loadEntries();
}

function showSummary() {
  activeTab.value = 'summary';
  loadSummary();
}

onMounted(loadEntries);
</script>

<template>
  <h1>Site Diary</h1>

  <div class="tabs">
    <button
      class="tab-button"
      :class="{ active: activeTab === 'diary' }"
      @click="activeTab = 'diary'"
    >
      Diary
    </button>
    <button
      class="tab-button"
      :class="{ active: activeTab === 'summary' }"
      @click="showSummary"
    >
      Summary
    </button>
  </div>

  <div v-if="loadError" class="error-list">{{ loadError }}</div>

  <template v-if="activeTab === 'diary'">
    <EntryForm @created="handleCreated" />
    <EntryList :entries="entries" :contracts="contracts" @filter-change="handleFilterChange" />
  </template>

  <template v-else>
    <SummaryView :summary="summary" />
  </template>
</template>

