import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVan, updateVan, uploadImages } from "../../api";

export default function HostVanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid") || "123";
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    type: "simple",
    imageUrl: "",
    galleryText: "",
    gallery: [],
    description: "",
  });
  const [mainFile, setMainFile] = React.useState(null);
  const [galleryFiles, setGalleryFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getVan(id);
        if (data.hostId && data.hostId !== uid) {
          setError({ message: "You can only edit your own vans." });
          return;
        }
        setForm({
          name: data.name || "",
          price: data.price || "",
          type: data.type || "simple",
          imageUrl: data.imageUrl || "",
          gallery: data.gallery || [],
          galleryText: (data.gallery || []).join("\n"),
          description: data.description || "",
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let imageUrl = form.imageUrl;
      let gallery = form.galleryText
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (mainFile || galleryFiles.length) {
        const uploaded = await uploadImages({
          hostId: uid,
          vanId: id,
          mainFile,
          galleryFiles,
        });
        if (uploaded.mainUrl) imageUrl = uploaded.mainUrl;
        if (uploaded.galleryUrls.length) gallery = [...gallery, ...uploaded.galleryUrls];
      }

      const payload = {
        ...form,
        imageUrl,
        gallery,
      };
      await updateVan(id, payload);
      navigate(`/host/vans/${id}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h3 className="login-error">{error.message}</h3>;

  return (
    <section className="van-edit">
      <div className="add-van-head">
        <h1>Edit van</h1>
        <p className="muted">
          Update photos, pricing, or copy. Changes go live immediately.
        </p>
      </div>
      <form className="van-edit-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
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
            required
          />
        </label>
        <label>
          Or upload new main image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainFile(e.target.files?.[0] || null)}
          />
        </label>
        <label>
          Gallery image URLs (one per line or comma-separated)
          <textarea
            name="galleryText"
            rows={3}
            value={form.galleryText}
            onChange={handleChange}
          />
        </label>
        <label>
          Or upload gallery images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className="login-error">{error.message}</p>}
        <div className="form-actions">
          <button
            type="button"
            className="link-button secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button className="link-button" type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
