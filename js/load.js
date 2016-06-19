document.addEventListener('DOMContentLoaded', function() {
	var iconWrapper = document.querySelector('.member-icon-wrapper');
	var icons = iconWrapper.querySelectorAll('*');
	var homeSub = document.querySelector('#home-subtitle');
	var totalIcons = icons.length;

	(function showIcons(iconArray, current) {
		if(current >= totalIcons) {
			homeSub.classList.add('fade-in');
			return;
		}

		iconArray[current].classList.add('fade-in');

		setTimeout(function() {
			showIcons(icons, current+1);
		}, 1500);

	})(icons, 0);
});