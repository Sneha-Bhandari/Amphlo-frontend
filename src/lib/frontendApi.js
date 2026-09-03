
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const fetchData = async (endpoint) => {
  const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
    method: "GET",
    credentials: "include",
  });
  console.log(res,"boom")

  return handleResponse(res);
};

export const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP error ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
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

// export const postData = async (endpoint, data) => {
//   try {
//     console.log(`Posting to: ${API_URL}/${endpoint}`);
//     console.log("Data:", JSON.stringify(data, null, 2));
    
//     const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//       credentials: "include",
//     });

//     const responseText = await res.text();
//     console.log("Response status:", res.status);
//     console.log("Response text:", responseText);
    
//     if (!res.ok) {
//       let errorMessage = `HTTP error! status: ${res.status}`;
//       try {
//         const errorJson = JSON.parse(responseText);
//         errorMessage = errorJson.message || errorJson.error || responseText;
//       } catch (e) {
//         errorMessage = responseText || errorMessage;
//       }
//       throw new Error(errorMessage);
//     }

//     try {
//       return JSON.parse(responseText);
//     } catch (e) {
//       return { success: true, data: responseText };
//     }
//   } catch (error) {
//     console.error("Post error:", error);
//     throw error;
//   }
// };

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
    
    const res = await fetch(`${API_URL}/file-upload/`, {
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