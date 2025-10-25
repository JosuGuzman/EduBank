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
