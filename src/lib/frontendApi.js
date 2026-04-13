const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const buildUrl = (endpoint) =>
  `${BASE_URL}/${endpoint.replace(/^\//, "")}`;

export const fetchData = async (endpoint) => {
  try {
    const res = await fetch(buildUrl(endpoint));

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const res = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Post error:", error);
    throw error;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const res = await fetch(buildUrl(endpoint), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Patch error:", error);
    throw error;
  }
};

export const uploadImageData = async (file) => {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const res = await fetch(`${BASE_URL}/file-upload/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const res = await fetch(buildUrl(endpoint), {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};