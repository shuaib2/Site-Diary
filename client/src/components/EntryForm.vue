<template>
  <form class="card" @submit.prevent="handleSubmit">
    <h2>New diary entry</h2>

    <div class="error-list" v-if="errors.length">
      <ul>
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>

    <div class="field">
      <label for="date">Date</label>
      <input id="date" type="date" v-model="form.date" :max="todayIso" required />
    </div>

    <div class="field">
      <label for="contract">Contract name</label>
      <input id="contract" type="text" v-model="form.contract" placeholder="e.g. Riverside Bridge" required />
    </div>

    <div class="field">
      <label for="weather">Weather</label>
      <input id="weather" type="text" v-model="form.weather" placeholder="e.g. Overcast, 14°C" />
    </div>

    <div class="field">
      <label for="author">Author</label>
      <input id="author" type="text" v-model="form.author" placeholder="Your name" required />
    </div>

    <div class="field">
      <label for="notes">Notes</label>
      <textarea
        id="notes"
        v-model="form.notes"
        :maxlength="maxNotesLength"
        placeholder="What happened on site today?"
        required
      ></textarea>
      <span class="char-count" :class="{ over: form.notes.length > maxNotesLength }">
        {{ form.notes.length }} / {{ maxNotesLength }}
      </span>
    </div>

    <button class="btn-primary" type="submit" :disabled="submitting">
      {{ submitting ? 'Saving…' : 'Add entry' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { createEntry } from '../api';

const maxNotesLength = 500;
const emit = defineEmits(['created']);

const todayIso = new Date().toISOString().slice(0, 10);

const form = reactive({
  date: todayIso,
  contract: '',
  weather: '',
  author: '',
  notes: '',
});

const errors = ref([]);
const submitting = ref(false);

function clientSideErrors() {
  const problems = [];
  if (!form.date) problems.push('Date is required.');
  else if (form.date > todayIso) problems.push('Date cannot be in the future.');
  if (!form.contract.trim()) problems.push('Contract name is required.');
  if (!form.author.trim()) problems.push('Author name is required.');
  if (!form.notes.trim()) problems.push('Notes are required.');
  else if (form.notes.length > maxNotesLength) problems.push(`Notes must be ${maxNotesLength} characters or fewer.`);
  return problems;
}

async function handleSubmit() {
  errors.value = clientSideErrors();
  if (errors.value.length > 0) return;

  submitting.value = true;
  try {
    const created = await createEntry({ ...form });
    emit('created', created);
    // keep contract and author since consecutive entries are usually for the same site/person
    form.weather = '';
    form.notes = '';
    form.date = todayIso;
  } catch (err) {
    errors.value = [err.message];
  } finally {
    submitting.value = false;
  }
}
</script>
