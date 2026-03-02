// src/components/ProductForm.jsx
import React, { useEffect, useState } from "react";

export default function ProductForm({ onSave, editing }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("mobiles");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // base64

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setPrice(editing.price || "");
      setCategory(editing.category || "mobiles");
      setDescription(editing.description || "");
      setImage(editing.imageBase64 || editing.image || "");
    } else {
      setTitle(""); setPrice(""); setCategory("mobiles"); setDescription(""); setImage("");
    }
  }, [editing]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title || !price || !category || !image) {
      alert("Please fill all fields and upload image.");
      return;
    }
    onSave({
      
      id: editing?.id,
      title,
      description,
      price: parseFloat(price),
      category: category.toLowerCase(),
      imageBase64: image
    });
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h4 className="font-semibold mb-2">{editing ? "Edit Product" : "Add Product"}</h4>
      <div className="grid md:grid-cols-2 gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-2 border rounded" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" className="p-2 border rounded" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded">
          <option value="mobiles">Mobiles</option>
          <option value="laptops">Laptops</option>
          <option value="appliances">Appliances</option>
          <option value="headphones">Headphones</option>
          <option value="watches">Watches</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" />
      </div>

      {image && <div className="mt-3"><img src={image} alt="preview" className="h-28 w-28 object-cover rounded" /></div>}

      <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full p-2 border rounded mt-3" />

      <div className="mt-3">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? "Update" : "Add Product"}</button>
      </div>
    </form>
  );
}
