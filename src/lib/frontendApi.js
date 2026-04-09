// lib/frontendApi.js
export const fetchData = async (data) => {
  try {
    const res = await fetch(`https://frontbackend.amphlo.com/${data}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const text = await res.text();
    const json = text ? JSON.parse(text) : {}; 
  
    return json;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; 
  }
};

export const postData = async (endpoint, data) => {
  try {
    const res = await fetch(`https://frontbackend.amphlo.com/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Post error:", error);
    throw error;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const res = await fetch(`https://frontbackend.amphlo.com/${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Patch error:", error);
    throw error;
  }
};

export const uploadImageData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('images', file);
    
    const res = await fetch('https://frontbackend.amphlo.com/file-upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const res = await fetch(`https://frontbackend.amphlo.com/${endpoint}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};