import $ from 'jquery';
import Dropzone from 'dropzone';
import {tagBody, modalForm, scrollW} from './common';
import modalWindow from './common';

$(document).ready(function() {

	modalWindow();
	const modalBlock = $('.js-modal-block');

// -----------------Enquiry GET-----------------------------

	const form = $('#my-form');
	const selectEnquiry = $('#enquiry_type');

	function getEnquiry() {
		fetch('http://504080.com/api/v1/directories/enquiry-types', {
			method: 'GET',
			headers: {
				"Content-type": "application/json"
			}
		})
		.then(res => res.json())
		.then(body => {
			if (body.success == true) {
				let arr = body.data;
				arr.forEach(item => {
					const selectOption = `
						<option class="option" value="${item.name}">${item.name}</option>
					`;
					selectEnquiry.append(selectOption);
				});
			} 
		})
		.catch(err => {
			console.log('problem with fetch operation' + err);
		})
	}

	if(selectEnquiry){getEnquiry();}

// ---------------File Validation---------------------------

	const dzMessage = document.getElementById('dz__message');
	
	new Dropzone ('#my-form', {
		previewsContainer: '.dz__previews',
		thumbnailWidth: null,
    thumbnailHeight: null,
		maxFiles: 1,
		maxFilesize: 5,
		autoProcessQueue: false,
		acceptedFiles: 'image/*',
		init: function() {

			this.on("addedfile", function(file) {

				if (this.files.length >= this.options.maxFiles) {
					dzMessage.style.display = 'none';
				} else {
					dzMessage.style.display = 'flex';
				}

				if (!file.type.match(/image.*/) || file.size > 5*1024*1024) {
					let dzError = Dropzone.createElement("<div class='dz__error'><div class='dz__message flex'><h5 class='h5'>Add photo</h5><p>Maximum size of 300x300 jpeg jpg png 5 MB</p><p><span>The photo does not meet the requirements</span></p></div></div>");
					file.previewElement.appendChild(dzError);
					file.previewElement.querySelector('[data-dz-thumbnail]').remove();
				}

				let dzRemove = Dropzone.createElement("<button class='dz__remove'><div class='dz__remove-inner'></div></button>");
				let _this = this;
        dzRemove.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
          _this.removeFile(file);
          dzMessage.style.display = 'flex';
        });
        file.previewElement.appendChild(dzRemove);
      });

			this.on("thumbnail", function(file) {
				if (file.width > 300 || file.height > 300 || file.size > 5*1024*1024) {
					file.rejectDimensions();
				} else {
					file.acceptDimensions();
				}
			});

		},
		accept: function(file, done) {
			file.acceptDimensions = done;
			file.rejectDimensions = function() {
				let dzError = Dropzone.createElement("<div class='dz__error'><div class='dz__message flex'><h5 class='h5'>Add photo</h5><p>Maximum size of 300x300 jpeg jpg png 5 MB</p><p><span>The photo does not meet the requirements</span></p></div></div>");
				file.previewElement.appendChild(dzError);
				file.previewElement.querySelector('[data-dz-thumbnail]').remove();
			};
		}
	});

// ------------------FORM POST------------------------------

  const formOther = $('#other');
  const formName = $('#user_name');
  const formEmail = $('#email');
  const formSubject = $('#subject');
  const formDescription = $('#description');
  const textareaCount = $('.js-count');
  const errorText = $('.error');

	selectEnquiry.change(function() {
		if (selectEnquiry.val() == 'Other') {
			formOther.removeAttr('disabled');
			formOther.focus();
		} else {
			formOther.attr('disabled', 'disabled');
		}
	});

	formDescription.keyup(function () {
    textareaCount.text('(' + $(this).val().length + '/1000)');
  });

	form.submit((e) => {
		e.preventDefault();
		let formEnquiry = selectEnquiry.val();
		if (formEnquiry == 'Other') {
			formEnquiry == formOther.val();
		}
		const data = {
			enquiry_type: formEnquiry,
			user_name: formName.val(),
			email: formEmail.val(),
			subject: formSubject.val(),
			description: formDescription.val()
		};
		fetch('http://504080.com/api/v1/support', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then(body => {
			if (body.success == false) {
				if (body.error.message == 'Validation failed') {
					let arrDetails = body.error.details;
					arrDetails.forEach((item) => {
						let formField = document.getElementById(item.field);
						let spanError = document.getElementById('error-' + item.field);
						spanError.textContent = item.description;
						formField.style.borderColor = '#fb6363';
					});
				} else {
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
			} else if (body.success == true){
				const template = `<p>${body.data.message}</p>`;
				const previewMessage = $('#dz__message');
				modalBlock.append(template);
				modalForm.css('display', 'block');
				tagBody.css({
					overflow: 'hidden',
					paddingRight: scrollW
				});
				form.trigger('reset');
				previewMessage.nextAll().remove();
				previewMessage.css('display', 'flex');
				textareaCount.text('(0/1000)');
			}

		})
		.catch(err => {
			console.log('problem with fetch operation' + err);
		})
		errorText.text('');
		errorText.prev().css('border-color', '#c8cdd5');
	});

}); // close jQuery