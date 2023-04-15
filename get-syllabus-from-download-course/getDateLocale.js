const getDateLocale = () => {
	return new Date()
		.toLocaleString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: '2-digit',
		})
		.replaceAll(' ', '-');
};
module.exports = getDateLocale;
