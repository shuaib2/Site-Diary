const MAX_NOTES_LENGTH = 500;

// Returns an array of human-readable error messages; empty array means valid.
function validateEntry(payload) {
  const errors = [];
  const { date, contract, notes, author } = payload || {};

  if (!date || typeof date !== 'string') {
    errors.push('Date is required.');
  } else {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('Date is not valid.');
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // allow the whole of today
      if (parsed.getTime() > today.getTime()) {
        errors.push('Date cannot be in the future.');
      }
    }
  }

  if (!contract || !contract.trim()) {
    errors.push('Contract name is required.');
  }

  if (!author || !author.trim()) {
    errors.push('Author name is required.');
  }

  if (!notes || !notes.trim()) {
    errors.push('Notes are required.');
  } else if (notes.length > MAX_NOTES_LENGTH) {
    errors.push(`Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`);
  }

  return errors;
}

module.exports = { validateEntry, MAX_NOTES_LENGTH };
