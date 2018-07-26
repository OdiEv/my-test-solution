import $ from 'jquery';
import {tagBody, modalForm, scrollW} from './common';
import modalWindow from './common';

$(document).ready(function() {

	modalWindow();
	const modalBlock = $('.js-modal-block');
	
// ----------------Categories GET---------------------------

	const category = $('.js-category');
	const addNewService = $('.js-addservice');

	function getCategories() {
		fetch('http://504080.com/api/v1/services/categories', {
			method: 'GET',
			headers: {
				"Content-type": "application/json",
				"Authorization": "f30fa27afb096d10078a384ebbb4da9e4be6a466"
			}
		})
		.then(res => res.json())
		.then(body => {

			if (body.success == true) {
				let arrCat = body.data;
				arrCat.forEach(item => {
					const template = `
						<div class="category__block">
							<div class="category__item">
								<img class="category__icon" src="${item.icon}" alt="icon">
							</div>
							<p class="category__title">${item.title}</p>
						</div>
					`;
					category.append(template);
				});
			} else if (body.success == false) {
				const template = `
					<h3 class="h3">${body.error.message}</h3>
					<p>${body.error.description}</p>
				`;
				modalBlock.append(template);
				modalForm.css('display', 'block');
				tagBody.css({
					overflow: 'hidden',
					paddingRight: scrollW
				});
			}

		})
		.catch(err => {
			console.log('problem with fetch operation' + err);
		})
		category.empty();
	}

	addNewService.click(getCategories)
	if(category){getCategories();}

}); // close jQuery