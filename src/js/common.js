import $ from 'jquery';

export const tagBody = $('.js-body');
export const modalForm = $('.js-modal');

let div = document.createElement('div');
div.style.overflowY = 'scroll';
div.style.width = '20px';
div.style.height = '20px';
div.style.visibility = 'hidden';
document.body.appendChild(div);
export let scrollW = div.offsetWidth - div.clientWidth;
document.body.removeChild(div);

const modalWindow = function() {
	
	const modalBack = $('.js-modal-back');
	const modalClose = $('.js-modal-close');

	modalClose.click(function() {
		modalForm.css('display', 'none');
		tagBody.css({
			overflow: 'auto',
			paddingRight: '0'
		});
		modalClose.nextAll().remove();
	});
	modalBack.click(function() {
		modalForm.css('display', 'none');
		tagBody.css({
			overflow: 'auto',
			paddingRight: '0'
		});
		modalClose.nextAll().remove();
	});

}

export default modalWindow;