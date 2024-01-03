// ammend this to use live url
const API_ENDPOINT = 'http://localhost:6116'; 
const COMPANY_ID = '0f40cbf6-3502-4836-b548-37e864eec836';

async function onSubmit(e) {
    e.preventDefault();

    const formElement = document.getElementById('getestimate');
    const formData = new FormData(formElement);

    try {
        const object = convertFormDataToObject(formData);
        const enquiryResponse = await postEnquiry(object);

        if (enquiryResponse && !enquiryResponse.error && object['photos'].length > 0) {
            const uploadResponse = await generatePresignedUrl(object);
            await uploadFiles(formData, uploadResponse.presigned_urls);
        }

        displaySuccessMessage();
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage();
    }
}

function convertFormDataToObject(formData) {
    const object = { photos: [], company_id: COMPANY_ID };
    formData.forEach((value, key) => {
        if (key === 'upload_imgs[]') {
            object['photos'].push(value.name);
        } else {
            object[key] = value;
        }
    });
    return object;
}

async function postEnquiry(object) {
    const response = await fetch(`${API_ENDPOINT}/new_enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    });
    return response.json();
}

async function generatePresignedUrl(object) {
    const newObject = {
        file_names: object['photos'],
        company_id: COMPANY_ID,
        fullname: object['full_name']
    };

    const response = await fetch(`${API_ENDPOINT}/generate_presigned_url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObject)
    });
    return response.json();
}

async function uploadFiles(formData, presignedUrls) {
    const files = formData.getAll('upload_imgs[]');

    for (const urlInfo of presignedUrls) {
        const file = files.find(f => f.name === urlInfo.file_name);
        if (file) {
            await fetch(urlInfo.presigned_url, {
                method: 'PUT',
                body: file
            });
        }
    }
}

var imgUpload = document.getElementById('upload_imgs')
, imgPreview = document.getElementById('img_preview')
, totalFiles
, previewTitle
, previewTitleText
, img;

imgUpload.addEventListener('change', previewImgs, false);

function previewImgs(event) {
totalFiles = imgUpload.files.length;

if(!!totalFiles) {
imgPreview.classList.remove('quote-imgs-thumbs--hidden');
previewTitle = document.createElement('p');
previewTitle.style.fontWeight = 'bold';
previewTitleText = document.createTextNode(totalFiles + ' Total Images Selected');
previewTitle.appendChild(previewTitleText);
imgPreview.appendChild(previewTitle);
}

for(var i = 0; i < totalFiles; i++) {
img = document.createElement('img');
img.src = URL.createObjectURL(event.target.files[i]);
img.classList.add('img-preview-thumb');
imgPreview.appendChild(img);
}
}

function displaySuccessMessage(){
// Remove the form or hide it
document.getElementById('getestimate').style.display = 'none';

// Create a success message element
var messageDiv = document.createElement('div');
messageDiv.innerHTML = "<strong>Thank you!</strong> Your request for an estimate has been sent.";
messageDiv.className = "success-message"; // Add a class for styling

// Select the target div with id 'register-form'
var targetDiv = document.getElementById('register-form');

// Append the success message to the 'register-form' div
if(targetDiv) {
    targetDiv.appendChild(messageDiv);
} else {
    console.error("Couldn't find the target div to append the success message.");
}
}

function displayErrorMessage(){
// Create an error message element
var messageDiv = document.createElement('div');
messageDiv.innerHTML = "<strong>Error!</strong> Something went wrong, please try again later.";
messageDiv.className = "error-message"; // Add a class for styling
// Select the target div with id 'register-form'
var targetDiv = document.getElementById('register-form');

// Append the success message to the 'register-form' div
if(targetDiv) {
    targetDiv.appendChild(messageDiv);
} else {
    console.error("Couldn't find the target div to append the success message.");
}
}

