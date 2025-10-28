function formatearErroresZod(error) {
	const formatted = {};
	for (const key in error.format()) {
		if (error.format()[key]?._errors) {
			formatted[key] = error.format()[key]._errors.join(", ");
		}
	}
	return formatted;
}

export { formatearErroresZod };


function toCamel(obj) {
  const result = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[camelKey] = obj[key];
    }
  }
  return result;
}

export { toCamel };