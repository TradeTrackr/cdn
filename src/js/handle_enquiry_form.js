const API_ENDPOINT = 'https://api.tradetrackr.co.uk'; 
const COMPANY_ID = '0db75150-bc17-4c96-b1f3-1f15c498472d';

var imgUpload = document.getElementById('upload_imgs'),
    imgPreview = document.getElementById('img_preview'),
    accumulatedFiles = [], // Array to hold all files over time
    previewTitle = document.createElement('p'),
    img;


function getCurrentDateTime() {
  let now = new Date();

  let year = now.getFullYear();
  let month = ('0' + (now.getMonth() + 1)).slice(-2);
  let day = ('0' + now.getDate()).slice(-2);
  let hours = ('0' + now.getHours()).slice(-2);
  let minutes = ('0' + now.getMinutes()).slice(-2);
  let seconds = ('0' + now.getSeconds()).slice(-2);
  let milliseconds = ('00' + now.getMilliseconds()).slice(-3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function onSubmit(e) {
    e.preventDefault();

    const formElement = document.getElementById('getestimate');
    const formData = new FormData(formElement);
    formData.append('status', 'new')
    formData.append('type', 'website')
    formData.append('timestamp', getCurrentDateTime())
    accumulatedFiles.forEach((file, index) => {
        // The 'files[]' name should match with the backend expectation for array of files
        formData.append('upload_imgs[]', file, file.name);
    });


    if (!validateForm()) {
        // Highlighting and validation are handled in validateForm
        return false;
    }

    try {
        const object = convertFormDataToObject(formData);
        const enquiryResponse = await postEnquiry(object);

        if (enquiryResponse && !enquiryResponse.error && object['photos'].length > 0) {
            const uploadResponse = await generatePresignedUrl(object, enquiryResponse);
            await uploadFiles(formData, uploadResponse.presigned_urls);
        }

        displaySuccessMessage();
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage();
    }
}

function convertFormDataToObject(formData) {
    const object = { photos: [], company_id: COMPANY_ID};
    formData.forEach((value, key) => {
        if (key === 'upload_imgs[]') {
            if (! object['photos'].includes(value.name)){
                object['photos'].push(value.name);
            }
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

async function generatePresignedUrl(object, enquiryResponse) {
    const newObject = {
        file_names: object['photos'],
        company_id: COMPANY_ID,
        fullname: object['full_name'],
        enquiry_id: enquiryResponse[0]['id']
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
imgUpload.addEventListener('change', previewImgs, false);

previewTitle.style.fontWeight = 'bold';
imgPreview.appendChild(previewTitle);

function fileAlreadyAdded(file, files) {

    let isDuplicate = files.some(f => f.name === file.name && f.size === file.size);
    
    return isDuplicate;
}

function previewImgs(event) {
    // Add the newly selected files to the accumulated files if not already present
    for (var i = 0; i < imgUpload.files.length; i++) {
        if (!fileAlreadyAdded(imgUpload.files[i], accumulatedFiles)) {
            accumulatedFiles.push(imgUpload.files[i]);
        }
    }

    // Update totalFiles with the length of accumulatedFiles
    var totalFiles = accumulatedFiles.length;

    if (!!totalFiles) {
        imgPreview.classList.remove('quote-imgs-thumbs--hidden');
        previewTitle.textContent = totalFiles + ' Total Images Selected';
    } else {
        imgPreview.classList.add('quote-imgs-thumbs--hidden');
    }

    console.log("Current children before clearing: ", imgPreview.children.length);

    // We'll collect all children that need to be removed in an array first
    let childrenToRemove = [];
    for (let child of imgPreview.children) {
        if (child !== previewTitle) {
            childrenToRemove.push(child);
        }
    }

    // Now we remove the collected children
    for (let child of childrenToRemove) {
        imgPreview.removeChild(child);
    }

    console.log("Current children after clearing: ", imgPreview.children.length);

    // Add all accumulated files to the preview
    accumulatedFiles.forEach(function(file) {
        var img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.classList.add('img-preview-thumb');
        imgPreview.appendChild(img);
    });
}


function displaySuccessMessage(){
// Remove the form or hide it
document.getElementById('getestimate').style.display = 'none';

// Create a success message element
var messageDiv = document.createElement('div');
messageDiv.innerHTML = "<strong>Thank you!</strong> Your request for an estimate has been sent. We will get back to you soon.";
messageDiv.className = "success-message"; // Add a class for styling

// Select the target div with id 'register-form'
var targetDiv = document.getElementById('register-form');
document.getElementById('register-form').scrollIntoView({
    behavior: 'smooth'
});
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

function validateForm() {
let isValid = true;
const formElement = document.getElementById('getestimate');
const inputs = formElement.querySelectorAll('input, textarea');

inputs.forEach(input => {
    // Reset styles for all inputs
    input.style.border = '1px solid #ccc';

    // Check if the input is empty
    if (input.required && !input.value.trim()) {
        // Highlight field in red
        input.style.border = '2px solid red';
        isValid = false;
    }
});

// Check file input separately if needed
// const fileInput = document.querySelector('[name="upload_imgs[]"]');
// if (fileInput.files.length === 0) {
//     fileInput.style.border = '2px solid red';
//     isValid = false;
// } else {
//     fileInput.style.border = '1px solid #ccc';
// }

return isValid;
}
