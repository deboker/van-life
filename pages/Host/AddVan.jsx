import React from "react";
import { useNavigate } from "react-router-dom";
import { addVan } from "../../api";

const initial = {
  name: "",
  price: "",
  type: "simple",
  imageUrl: "",
  galleryText: "",
  description: "",
};

export default function AddVan() {
  const [form, setForm] = React.useState(initial);
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid") || "123";

  const parseGallery = (text) =>
    text
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const payload = {
        ...form,
        gallery: parseGallery(form.galleryText),
      };
      await addVan(payload, uid);
      setForm(initial);
      navigate("/host/vans");
    } catch (err) {
      setError(err);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <section className="add-van">
      <div className="add-van-head">
        <h1>Add a new van</h1>
        <p className="muted">
          Fill in the details and publish. You can edit later from the van
          detail page.
        </p>
      </div>
      {error && <p className="error">Could not save: {error.message}</p>}
      <form className="add-van-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Green Wonder"
          />
        </label>
        <label>
          Price per day (USD)
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="70"
          />
        </label>
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="simple">Simple</option>
            <option value="rugged">Rugged</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>
        <label>
          Image URL
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </label>
        <label>
          Gallery image URLs (one per line or comma-separated)
          <textarea
            name="galleryText"
            value={form.galleryText}
            onChange={handleChange}
            rows={3}
            placeholder="https://.../photo1.jpg&#10;https://.../photo2.jpg"
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Tell people what makes this van special."
          />
        </label>
        <button
          className="pill primary"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Saving..." : "Publish van"}
        </button>
      </form>
    </section>
  );
}
