document.addEventListener('DOMContentLoaded', function() {
	var homeSub = document.querySelector('#home-subtitle');
	var imagesWrapper = document.querySelector('.images-wrapper');
	var founderImages = imagesWrapper.querySelectorAll('img[data-src]');
	

	setTimeout(function() {
		homeSub.classList.add('fade-in');
	}, 500);

	function checkViewport(ele) {
		var rect = ele.getBoundingClientRect();
		return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
	    );
	}

	founderImages.forEach(function(image) {
		image.setAttribute('src', image.getAttribute('data-src'));
		image.onload = function() {
			image.removeAttribute('data-src');
		};
	});
});