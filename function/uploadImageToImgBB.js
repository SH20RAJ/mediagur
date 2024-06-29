async function uploadImageToImgBB(imageFile , apiKey = "90dee15ce82c36b2fb078c7d2b5db03d") {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

module.export = {uploadImageToImgBB};