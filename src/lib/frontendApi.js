// lib/frontendApi.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontbackend.amphlo.com";

export const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`);
    
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
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: "include",
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
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: "include",
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
    
    const res = await fetch(`${API_URL}/file-upload`, {
      method: 'POST',
      body: formData,
      credentials: "include",
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
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
      method: 'DELETE',
      credentials: "include",
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