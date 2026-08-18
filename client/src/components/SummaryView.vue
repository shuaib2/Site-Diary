<template>
  <div class="card">
    <h2>Summary by contract</h2>

    <p class="empty-state" v-if="summary.length === 0">No entries yet.</p>

    <table class="summary-table" v-else>
      <thead>
        <tr>
          <th>Contract</th>
          <th>Entries</th>
          <th>Last entry</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in summary" :key="row.contract">
          <td>{{ row.contract }}</td>
          <td><span class="count-badge">{{ row.count }}</span></td>
          <td>{{ formatDate(row.lastEntryDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  summary: { type: Array, required: true },
});

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>
