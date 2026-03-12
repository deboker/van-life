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
        <h1>Upraviť dodávku</h1>
        <p className="muted">
          Aktualizujte fotky, ceny alebo popis. Zmeny sa prejavia okamžite.
        </p>
      </div>
      <form className="van-edit-form" onSubmit={handleSubmit}>
        <label>
          Názov
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cena za deň (EUR)
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
          Typ
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="simple">Simple</option>
            <option value="rugged">Rugged</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>
        <label>
          URL hlavného obrázka
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Alebo nahrajte nový hlavný obrázok
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainFile(e.target.files?.[0] || null)}
          />
        </label>
        <label>
          URL obrázkov galérie (jeden na riadok alebo oddelené čiarkou)
          <textarea
            name="galleryText"
            rows={3}
            value={form.galleryText}
            onChange={handleChange}
          />
        </label>
        <label>
          Alebo nahrajte obrázky galérie
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
          />
        </label>
        <label>
          Popis
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
            Zrušiť
          </button>
          <button className="link-button" type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Ukladám...
              </>
            ) : (
              "Uložiť zmeny"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
